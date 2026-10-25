import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS, ThemeMode } from '../constants/theme';

type ColorPalette = typeof LIGHT_COLORS;

interface ThemeContextType {
  theme: ThemeMode;
  colors: ColorPalette;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = '@midland_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [animating, setAnimating] = useState(false);
  const [incomingColors, setIncomingColors] = useState<ColorPalette>(DARK_COLORS);

  // Smooth Circular Top-Side Reveal animation values
  const revealProgress = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Load saved preference
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'dark' || saved === 'light') {
          setTheme(saved);
        }
      })
      .catch((err) => console.log('Theme preference load error:', err));
  }, []);

  const triggerTopCircularTransition = (nextMode: ThemeMode) => {
    const targetColors = nextMode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    setIncomingColors(targetColors);
    setAnimating(true);

    // Reset animated values
    revealProgress.setValue(0);
    overlayOpacity.setValue(1);

    // Smooth circular reveal originating from the top side
    Animated.sequence([
      Animated.timing(revealProgress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimating(false);
    });

    // Seamlessly swap the active theme under the wave once it envelopes the screen
    setTimeout(() => {
      setTheme(nextMode);
      AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => {});
    }, 160);
  };

  const toggleTheme = () => {
    if (animating) return;
    const nextMode = theme === 'light' ? 'dark' : 'light';
    triggerTopCircularTransition(nextMode);
  };

  const setThemeMode = (mode: ThemeMode) => {
    if (animating || mode === theme) return;
    triggerTopCircularTransition(mode);
  };

  const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const isDark = theme === 'dark';

  const { width, height } = Dimensions.get('window');
  // Top circle dimensions
  const circleSize = Math.max(width, height) * 0.95;

  const circleScale = revealProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 3.8],
  });

  const circleTranslateY = revealProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.4],
  });

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        isDark,
        toggleTheme,
        setThemeMode,
      }}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {children}

        {/* Smooth Circular Top-Side Transition Wave */}
        {animating && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.overlayContainer,
              { opacity: overlayOpacity },
            ]}
          >
            <Animated.View
              style={[
                styles.circularWave,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  top: -circleSize * 0.45,
                  left: (width - circleSize) / 2,
                  backgroundColor: incomingColors.background,
                  borderColor: incomingColors.primaryAccentBorder,
                  transform: [
                    { translateY: circleTranslateY },
                    { scale: circleScale },
                  ],
                  shadowColor: incomingColors.mode === 'dark' ? '#000000' : '#0F172A',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.25,
                  shadowRadius: 20,
                  elevation: 8,
                },
              ]}
            />
          </Animated.View>
        )}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  overlayContainer: {
    zIndex: 99999,
    overflow: 'hidden',
  },
  circularWave: {
    position: 'absolute',
    borderBottomWidth: 1.5,
  },
});
