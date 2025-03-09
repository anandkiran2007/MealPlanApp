import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
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
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const getButtonStyle = () => {
    const buttonStyles: ViewStyle[] = [styles.button];
    
    // Add variant style
    if (variant === 'primary') buttonStyles.push(styles.primaryButton);
    if (variant === 'secondary') buttonStyles.push(styles.secondaryButton);
    if (variant === 'outline') buttonStyles.push(styles.outlineButton);
    
    // Add size style
    if (size === 'small') buttonStyles.push(styles.smallButton);
    if (size === 'medium') buttonStyles.push(styles.mediumButton);
    if (size === 'large') buttonStyles.push(styles.largeButton);
    
    // Add disabled style
    if (disabled) buttonStyles.push(styles.disabledButton);
    
    // Add custom style
    if (style) buttonStyles.push(style);
    
    return buttonStyles;
  };
  
  const getTextStyle = () => {
    const textStyles: TextStyle[] = [styles.buttonText];
    
    // Add variant text style
    if (variant === 'primary') textStyles.push(styles.primaryText);
    if (variant === 'secondary') textStyles.push(styles.secondaryText);
    if (variant === 'outline') textStyles.push(styles.outlineText);
    
    // Add size text style
    if (size === 'small') textStyles.push(styles.smallText);
    if (size === 'medium') textStyles.push(styles.mediumText);
    if (size === 'large') textStyles.push(styles.largeText);
    
    // Add disabled text style
    if (disabled) textStyles.push(styles.disabledText);
    
    // Add custom text style
    if (textStyle) textStyles.push(textStyle);
    
    return textStyles;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          color={variant === 'outline' ? '#22C55E' : '#FFFFFF'} 
          size="small" 
        />
      );
    }

    const content = [
      icon && iconPosition === 'left' && <View key="leftIcon" style={styles.iconLeft}>{icon}</View>,
      <Text key="text" style={getTextStyle()}>{title}</Text>,
      icon && iconPosition === 'right' && <View key="rightIcon" style={styles.iconRight}>{icon}</View>
    ];

    return (
      <View style={styles.contentContainer}>
        {content}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  primaryButton: {
    backgroundColor: '#22C55E',
  } as ViewStyle,
  secondaryButton: {
    backgroundColor: '#F3F4F6',
  } as ViewStyle,
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#22C55E',
  } as ViewStyle,
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  } as ViewStyle,
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  } as ViewStyle,
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  } as ViewStyle,
  disabledButton: {
    opacity: 0.5,
  } as ViewStyle,
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  iconLeft: {
    marginRight: 8,
  } as ViewStyle,
  iconRight: {
    marginLeft: 8,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  } as TextStyle,
  primaryText: {
    color: '#FFFFFF',
  } as TextStyle,
  secondaryText: {
    color: '#1F2937',
  } as TextStyle,
  outlineText: {
    color: '#22C55E',
  } as TextStyle,
  smallText: {
    fontSize: 14,
  } as TextStyle,
  mediumText: {
    fontSize: 16,
  } as TextStyle,
  largeText: {
    fontSize: 18,
  } as TextStyle,
  disabledText: {
    opacity: 0.7,
  } as TextStyle,
});