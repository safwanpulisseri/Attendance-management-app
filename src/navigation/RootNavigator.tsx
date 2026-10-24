import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS } from '../constants/theme';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RoleTabNavigator } from './RoleTabNavigator';
import { AttendanceHistoryScreen } from '../screens/AttendanceHistoryScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!currentUser ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={RoleTabNavigator} />
            <Stack.Screen
              name="History"
              component={AttendanceHistoryScreen}
              options={{
                headerShown: true,
                title: 'Attendance History',
                headerBackTitle: 'Back',
                headerTintColor: COLORS.textPrimary,
                headerTitleStyle: {
                  fontFamily: FONTS.bold,
                  fontSize: 16,
                  color: COLORS.textPrimary,
                },
                headerStyle: {
                  backgroundColor: COLORS.surface,
                },
                headerShadowVisible: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
