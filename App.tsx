import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { AttendanceProvider } from './src/context/AttendanceContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { COLORS } from './src/constants/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AttendanceProvider>
          <View style={styles.appContainer}>
            <StatusBar style="dark" />
            <RootNavigator />
          </View>
        </AttendanceProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 600,
          width: '100%',
          marginHorizontal: 'auto',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
          minHeight: '100vh',
        }
      : {}),
  },
});
