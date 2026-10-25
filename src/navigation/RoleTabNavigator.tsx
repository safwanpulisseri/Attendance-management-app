import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../constants/theme';

// Screens
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { SeniorStaffDashboardScreen } from '../screens/SeniorStaffDashboardScreen';
import { StaffDashboardScreen } from '../screens/StaffDashboardScreen';
import { AttendanceRecordsScreen } from '../screens/AttendanceRecordsScreen';
import { AttendanceHistoryScreen } from '../screens/AttendanceHistoryScreen';
import { UserManagementScreen } from '../screens/UserManagementScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const RoleTabNavigator: React.FC = () => {
  const { currentUser } = useAuth();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  if (!currentUser) return null;

  // Dynamic bottom padding to ensure complete visibility above hardware/software nav bars (3-button or gesture)
  const bottomPadding =
    Platform.OS === "web"
      ? 14
      : Platform.OS === "android"
      ? Math.max(insets.bottom, 12) + 6
      : Math.max(insets.bottom, 10);

  const tabHeight =
    Platform.OS === "web"
      ? 84
      : 56 + bottomPadding;

  const initialRoute =
    currentUser.role === 'admin'
      ? 'AdminDashboard'
      : currentUser.role === 'senior_staff'
      ? 'SeniorDashboard'
      : 'Today';

  return (
    <Tab.Navigator
      key={currentUser.role}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.slateMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarIconStyle: Platform.OS === 'web' ? { height: 24, marginTop: 4 } : undefined,
        tabBarItemStyle:
          Platform.OS === 'web'
            ? ({
                paddingVertical: 4,
                cursor: 'pointer',
                justifyContent: 'center',
                alignItems: 'center',
              } as any)
            : undefined,
        tabBarLabelStyle: {
          fontSize: Platform.OS === 'web' ? 11 : 10,
          fontFamily: FONTS.semiBold,
          letterSpacing: 0.3,
          lineHeight: Platform.OS === 'web' ? 14 : undefined,
          marginBottom: Platform.OS === 'web' ? 2 : 0,
        },
      }}
    >
      {/* ADMIN TABS */}
      {currentUser.role === 'admin' && (
        <>
          <Tab.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            options={{
              tabBarLabel: 'Command',
              tabBarIcon: ({ color }) => (
                <Ionicons name="grid-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="MyAttendance"
            component={StaffDashboardScreen}
            options={{
              tabBarLabel: 'My Shift',
              tabBarIcon: ({ color }) => (
                <Ionicons name="finger-print-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Records"
            component={AttendanceRecordsScreen}
            options={{
              tabBarLabel: 'Registry',
              tabBarIcon: ({ color }) => (
                <Ionicons name="document-text-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Users"
            component={UserManagementScreen}
            options={{
              tabBarLabel: 'Workforce',
              tabBarIcon: ({ color }) => (
                <Ionicons name="people-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Governance',
              tabBarIcon: ({ color }) => (
                <Ionicons name="shield-outline" size={20} color={color} />
              ),
            }}
          />
        </>
      )}

      {/* SENIOR STAFF TABS */}
      {currentUser.role === 'senior_staff' && (
        <>
          <Tab.Screen
            name="SeniorDashboard"
            component={SeniorStaffDashboardScreen}
            options={{
              tabBarLabel: 'Overview',
              tabBarIcon: ({ color }) => (
                <Ionicons name="grid-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="MyAttendance"
            component={StaffDashboardScreen}
            options={{
              tabBarLabel: 'My Shift',
              tabBarIcon: ({ color }) => (
                <Ionicons name="finger-print-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Records"
            component={AttendanceRecordsScreen}
            options={{
              tabBarLabel: 'Staff Logs',
              tabBarIcon: ({ color }) => (
                <Ionicons name="people-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Account',
              tabBarIcon: ({ color }) => (
                <Ionicons name="person-outline" size={20} color={color} />
              ),
            }}
          />
        </>
      )}

      {/* STAFF TABS */}
      {currentUser.role === 'staff' && (
        <>
          <Tab.Screen
            name="Today"
            component={StaffDashboardScreen}
            options={{
              tabBarLabel: 'Shift Clock',
              tabBarIcon: ({ color }) => (
                <Ionicons name="time-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="History"
            component={AttendanceHistoryScreen}
            options={{
              tabBarLabel: 'Ledger',
              tabBarIcon: ({ color }) => (
                <Ionicons name="calendar-outline" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Account',
              tabBarIcon: ({ color }) => (
                <Ionicons name="person-outline" size={20} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};
