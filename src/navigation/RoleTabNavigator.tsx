import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

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

  if (!currentUser) return null;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
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
              tabBarLabel: 'Dashboard',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="grid-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="MyAttendance"
            component={StaffDashboardScreen}
            options={{
              tabBarLabel: 'My Shift',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="finger-print-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Records"
            component={AttendanceRecordsScreen}
            options={{
              tabBarLabel: 'All Records',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Users"
            component={UserManagementScreen}
            options={{
              tabBarLabel: 'Users',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Account',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
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
              tabBarLabel: 'Dashboard',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="grid-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="MyAttendance"
            component={StaffDashboardScreen}
            options={{
              tabBarLabel: 'My Shift',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="finger-print-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Records"
            component={AttendanceRecordsScreen}
            options={{
              tabBarLabel: 'Staff Logs',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Account',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
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
              tabBarLabel: 'Today',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="time-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="History"
            component={AttendanceHistoryScreen}
            options={{
              tabBarLabel: 'History',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Account',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};
