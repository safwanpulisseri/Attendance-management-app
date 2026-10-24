import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
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

const THEME_STORAGE_KEY = '@cadence_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [animating, setAnimating] = useState(false);
  const [incomingColors, setIncomingColors] = useState<ColorPalette>(DARK_COLORS);

  // Animation values for iPhone Duo Screen Open transition
  const curtainLeft = useRef(new Animated.Value(0)).current;
  const curtainRight = useRef(new Animated.Value(0)).current;
  const apertureScale = useRef(new Animated.Value(0.2)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const irisRotate = useRef(new Animated.Value(0)).current;

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

  const triggerDuoScreenTransition = (nextMode: ThemeMode) => {
    const targetColors = nextMode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    setIncomingColors(targetColors);
    setAnimating(true);

    // Reset animated values
    curtainLeft.setValue(0);
    curtainRight.setValue(0);
    apertureScale.setValue(0.15);
    overlayOpacity.setValue(1);
    irisRotate.setValue(0);

    // Duo screen expansion: Left & Right wings smoothly part from center,
    // while central circular iris smoothly scales up to envelope the viewport
    Animated.sequence([
      Animated.parallel([
        Animated.timing(curtainLeft, {
          toValue: -Dimensions.get('window').width / 2,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(curtainRight, {
          toValue: Dimensions.get('window').width / 2,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.spring(apertureScale, {
          toValue: 2.8,
          friction: 8,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(irisRotate, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
      // Smooth fade out of transition shield
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimating(false);
    });

    // Swap active theme right as the aperture reaches peak expansion
    setTimeout(() => {
      setTheme(nextMode);
      AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => {});
    }, 180);
  };

  const toggleTheme = () => {
    if (animating) return;
    const nextMode = theme === 'light' ? 'dark' : 'light';
    triggerDuoScreenTransition(nextMode);
  };

  const setThemeMode = (mode: ThemeMode) => {
    if (animating || mode === theme) return;
    triggerDuoScreenTransition(mode);
  };

  const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const isDark = theme === 'dark';

  const { width, height } = Dimensions.get('window');
  const spin = irisRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
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

        {/* Dynamic iPhone Duo Screen Open Transition Overlay */}
        {animating && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.overlayContainer,
              { opacity: overlayOpacity },
            ]}
          >
            {/* Left Duo Curtain */}
            <Animated.View
              style={[
                styles.curtainHalf,
                {
                  left: 0,
                  width: width / 2,
                  backgroundColor: incomingColors.background,
                  transform: [{ translateX: curtainLeft }],
                  borderRightWidth: 1,
                  borderColor: incomingColors.primaryAccentBorder,
                },
              ]}
            />

            {/* Right Duo Curtain */}
            <Animated.View
              style={[
                styles.curtainHalf,
                {
                  right: 0,
                  width: width / 2,
                  backgroundColor: incomingColors.background,
                  transform: [{ translateX: curtainRight }],
                  borderLeftWidth: 1,
                  borderColor: incomingColors.primaryAccentBorder,
                },
              ]}
            />

            {/* Central Iris Expansion Disc */}
            <Animated.View
              style={[
                styles.irisDisc,
                {
                  width: width * 0.8,
                  height: width * 0.8,
                  borderRadius: (width * 0.8) / 2,
                  backgroundColor: incomingColors.surface,
                  borderColor: incomingColors.primaryAccentBorder,
                  transform: [{ scale: apertureScale }, { rotate: spin }],
                  boxShadow: incomingColors.mode === 'dark'
                    ? '0 0 60px rgba(59, 130, 246, 0.4)'
                    : '0 0 60px rgba(15, 23, 42, 0.15)',
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
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  curtainHalf: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  irisDisc: {
    position: 'absolute',
    borderWidth: 1.5,
  },
});
