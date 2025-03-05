declare module '@env' {
  export const EXPO_PUBLIC_API_URL: string;
  export const EXPO_PUBLIC_API_KEY: string;
  export const EXPO_PUBLIC_OPENAI_API_KEY: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_API_KEY: string;
      EXPO_PUBLIC_OPENAI_API_KEY: string;
    }
  }
}

export {};