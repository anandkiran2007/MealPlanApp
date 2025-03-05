import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a storage adapter that works on both web and native
const storage = Platform.select({
  web: {
    getItem: (name: string) => {
      const value = localStorage.getItem(name);
      return Promise.resolve(value);
    },
    setItem: (name: string, value: string) => {
      localStorage.setItem(name, value);
      return Promise.resolve();
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
      return Promise.resolve();
    }
  },
  default: AsyncStorage
});

interface WasteLog {
  id: string;
  date: string;
  savedItems: string[];
  wastedItems: string[];
  mealPlanId?: string;
  impact: {
    co2Saved: number;
    waterSaved: number;
    moneySaved: number;
  }
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  dateCompleted?: string;
}

interface WasteReductionState {
  wasteLogs: WasteLog[];
  achievements: Achievement[];
  totalImpact: {
    co2Saved: number;
    waterSaved: number;
    moneySaved: number;
    mealsTracked: number;
    wasteReduced: number;
  };
  addWasteLog: (log: Omit<WasteLog, 'id' | 'impact'>) => void;
  updateAchievements: () => void;
  getWeeklyStats: () => {
    savedItems: number;
    wastedItems: number;
    co2Saved: number;
    waterSaved: number;
    moneySaved: number;
  };
  getMonthlyProgress: () => {
    totalLogs: number;
    consistencyPercentage: number;
    improvement: number;
  };
}

const calculateImpact = (savedItems: string[]): WasteLog['impact'] => {
  const CO2_PER_ITEM = 2.5;
  const WATER_PER_ITEM = 1000;
  const MONEY_PER_ITEM = 5;

  return {
    co2Saved: savedItems.length * CO2_PER_ITEM,
    waterSaved: savedItems.length * WATER_PER_ITEM,
    moneySaved: savedItems.length * MONEY_PER_ITEM
  };
};

// Helper function to calculate consecutive days
const getConsecutiveDays = (logs: WasteLog[]): number => {
  if (logs.length === 0) return 0;

  const sortedDates = [...new Set(logs.map(log => 
    new Date(log.date).toISOString().split('T')[0]
  ))].sort();

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

export const useWasteReductionStore = create<WasteReductionState>()(
  persist(
    (set, get) => ({
      wasteLogs: [],
      achievements: [
        {
          id: '1',
          title: 'Waste Warrior',
          description: 'Track your food waste for 7 consecutive days',
          icon: '🎯',
          progress: 0,
          target: 7,
          completed: false
        },
        {
          id: '2',
          title: 'Climate Champion',
          description: 'Save 25kg of CO2 emissions',
          icon: '🌍',
          progress: 0,
          target: 25,
          completed: false
        },
        {
          id: '3',
          title: 'Water Guardian',
          description: 'Save 10,000L of water through waste reduction',
          icon: '💧',
          progress: 0,
          target: 10000,
          completed: false
        },
        {
          id: '4',
          title: 'Money Saver',
          description: 'Save $100 through reduced food waste',
          icon: '💰',
          progress: 0,
          target: 100,
          completed: false
        },
        {
          id: '5',
          title: 'Consistency King',
          description: 'Log waste reduction for 30 consecutive days',
          icon: '👑',
          progress: 0,
          target: 30,
          completed: false
        }
      ],
      totalImpact: {
        co2Saved: 0,
        waterSaved: 0,
        moneySaved: 0,
        mealsTracked: 0,
        wasteReduced: 0
      },

      addWasteLog: (log) => {
        const impact = calculateImpact(log.savedItems);
        const newLog: WasteLog = {
          id: Date.now().toString(),
          ...log,
          impact
        };

        set((state) => ({
          wasteLogs: [...state.wasteLogs, newLog],
          totalImpact: {
            co2Saved: state.totalImpact.co2Saved + impact.co2Saved,
            waterSaved: state.totalImpact.waterSaved + impact.waterSaved,
            moneySaved: state.totalImpact.moneySaved + impact.moneySaved,
            mealsTracked: state.totalImpact.mealsTracked + 1,
            wasteReduced: state.totalImpact.wasteReduced + log.savedItems.length
          }
        }));

        get().updateAchievements();
      },

      updateAchievements: () => {
        set((state) => {
          const newAchievements = state.achievements.map(achievement => {
            let progress = 0;
            
            switch (achievement.id) {
              case '1': // Waste Warrior
                progress = getConsecutiveDays(state.wasteLogs);
                break;
              case '2': // Climate Champion
                progress = state.totalImpact.co2Saved;
                break;
              case '3': // Water Guardian
                progress = state.totalImpact.waterSaved;
                break;
              case '4': // Money Saver
                progress = state.totalImpact.moneySaved;
                break;
              case '5': // Consistency King
                progress = getConsecutiveDays(state.wasteLogs);
                break;
            }

            return {
              ...achievement,
              progress,
              completed: progress >= achievement.target,
              dateCompleted: progress >= achievement.target && !achievement.completed 
                ? new Date().toISOString() 
                : achievement.dateCompleted
            };
          });

          return { achievements: newAchievements };
        });
      },

      getWeeklyStats: () => {
        const state = get();
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weekLogs = state.wasteLogs.filter(log => 
          new Date(log.date) >= weekAgo && new Date(log.date) <= now
        );

        return {
          savedItems: weekLogs.reduce((sum, log) => sum + log.savedItems.length, 0),
          wastedItems: weekLogs.reduce((sum, log) => sum + log.wastedItems.length, 0),
          co2Saved: weekLogs.reduce((sum, log) => sum + log.impact.co2Saved, 0),
          waterSaved: weekLogs.reduce((sum, log) => sum + log.impact.waterSaved, 0),
          moneySaved: weekLogs.reduce((sum, log) => sum + log.impact.moneySaved, 0)
        };
      },

      getMonthlyProgress: () => {
        const state = get();
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const monthLogs = state.wasteLogs.filter(log => 
          new Date(log.date) >= monthAgo && new Date(log.date) <= now
        );

        const totalDays = 30;
        const daysLogged = new Set(monthLogs.map(log => 
          new Date(log.date).toISOString().split('T')[0]
        )).size;

        const previousMonthLogs = state.wasteLogs.filter(log => {
          const logDate = new Date(log.date);
          return logDate >= new Date(monthAgo.getTime() - 30 * 24 * 60 * 60 * 1000) 
            && logDate < monthAgo;
        });

        const currentWasteReduction = monthLogs.reduce((sum, log) => 
          sum + log.savedItems.length, 0);
        const previousWasteReduction = previousMonthLogs.reduce((sum, log) => 
          sum + log.savedItems.length, 0);

        const improvement = previousWasteReduction === 0 ? 100 :
          ((currentWasteReduction - previousWasteReduction) / previousWasteReduction) * 100;

        return {
          totalLogs: monthLogs.length,
          consistencyPercentage: (daysLogged / totalDays) * 100,
          improvement
        };
      }
    }),
    {
      name: 'waste-reduction-storage',
      storage: createJSONStorage(() => storage)
    }
  )
);