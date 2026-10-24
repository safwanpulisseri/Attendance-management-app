import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'success':
        return styles.btnSuccess;
      case 'danger':
        return styles.btnDanger;
      case 'outline':
        return styles.btnOutline;
      case 'ghost':
        return styles.btnGhost;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      case 'ghost':
        return styles.textGhost;
      case 'secondary':
        return styles.textSecondary;
      default:
        return styles.textSolid;
    }
  };

  const getIconColor = () => {
    if (variant === 'outline') return COLORS.primary;
    if (variant === 'ghost') return COLORS.textSecondary;
    if (variant === 'secondary') return COLORS.textPrimary;
    return COLORS.textInverse;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[size],
        getContainerStyle(),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.textInverse}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' ? (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17}
              color={getIconColor()}
              style={styles.iconLeft}
            />
          ) : null}

          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              getTextStyle(),
              textStyle,
            ]}
          >
            {title}
          </Text>

          {icon && iconPosition === 'right' ? (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17}
              color={getIconColor()}
              style={styles.iconRight}
            />
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', userSelect: 'none' } as any) : {}),
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  // Sizes
  sm: {
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  lg: {
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  // Variants
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: '#000000',
  },
  btnSecondary: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnSuccess: {
    backgroundColor: COLORS.success,
  },
  btnDanger: {
    backgroundColor: COLORS.danger,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  // Text
  text: {
    fontFamily: FONTS.bold,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 15,
  },
  textSolid: {
    color: COLORS.textInverse,
  },
  textOutline: {
    color: COLORS.textPrimary,
  },
  textGhost: {
    color: COLORS.textSecondary,
  },
  textSecondary: {
    color: COLORS.textPrimary,
  },
});
