import React, { useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS } from '../constants/theme';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact' }) => {
  const { isDark, toggleTheme, setThemeMode, colors } = useTheme();
  const rotation = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  const handlePress = () => {
    Animated.spring(rotation, {
      toValue: isDark ? 0 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
    toggleTheme();
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  if (variant === 'segmented') {
    return (
      <View style={[styles.segmentedWrapper, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.segmentBtn, !isDark && [styles.segmentActive, { backgroundColor: colors.surface, borderColor: colors.border }]]}
          onPress={() => setThemeMode('light')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="sunny-outline"
            size={14}
            color={!isDark ? colors.textPrimary : colors.slateMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: !isDark ? colors.textPrimary : colors.slateMuted },
              !isDark && { fontFamily: FONTS.bold },
            ]}
          >
            Light
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, isDark && [styles.segmentActive, { backgroundColor: colors.surface, borderColor: colors.border }]]}
          onPress={() => setThemeMode('dark')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="moon-outline"
            size={14}
            color={isDark ? colors.primaryAccent : colors.slateMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: isDark ? colors.textPrimary : colors.slateMuted },
              isDark && { fontFamily: FONTS.bold },
            ]}
          >
            Dark
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.compactBtn,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons
          name={isDark ? 'moon' : 'sunny'}
          size={16}
          color={isDark ? colors.primaryAccent : colors.accentGold}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  compactBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', userSelect: 'none' } as any) : {}),
  },
  segmentedWrapper: {
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    padding: 3,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', userSelect: 'none' } as any) : {}),
  },
  segmentActive: {},
  segmentText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
});
