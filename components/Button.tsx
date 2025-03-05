import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    // Add variant style
    if (variant === 'primary') buttonStyle.push(styles.primaryButton);
    if (variant === 'secondary') buttonStyle.push(styles.secondaryButton);
    if (variant === 'outline') buttonStyle.push(styles.outlineButton);
    
    // Add size style
    if (size === 'small') buttonStyle.push(styles.smallButton);
    if (size === 'medium') buttonStyle.push(styles.mediumButton);
    if (size === 'large') buttonStyle.push(styles.largeButton);
    
    // Add disabled style
    if (disabled) buttonStyle.push(styles.disabledButton);
    
    // Add custom style
    if (style) buttonStyle.push(style);
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleArray = [styles.buttonText];
    
    // Add variant text style
    if (variant === 'primary') textStyleArray.push(styles.primaryText);
    if (variant === 'secondary') textStyleArray.push(styles.secondaryText);
    if (variant === 'outline') textStyleArray.push(styles.outlineText);
    
    // Add size text style
    if (size === 'small') textStyleArray.push(styles.smallText);
    if (size === 'medium') textStyleArray.push(styles.mediumText);
    if (size === 'large') textStyleArray.push(styles.largeText);
    
    // Add disabled text style
    if (disabled) textStyleArray.push(styles.disabledText);
    
    // Add custom text style
    if (textStyle) textStyleArray.push(textStyle);
    
    return textStyleArray;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#22C55E' : '#FFFFFF'} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#22C55E',
  },
  secondaryButton: {
    backgroundColor: '#F8FAFC',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabledButton: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#1E293B',
  },
  outlineText: {
    color: '#22C55E',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#94A3B8',
  },
});