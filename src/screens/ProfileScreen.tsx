import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { formatDisplayDate } from '../utils/dateUtils';
import { INITIAL_USERS } from '../data/dummyData';

export const ProfileScreen: React.FC = () => {
  const { currentUser, logout, quickLogin } = useAuth();
  const { resetAllAttendanceData } = useAttendance();

  const [resetting, setResetting] = useState(false);

  if (!currentUser) return null;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleResetData = async () => {
    Alert.alert(
      'Reset Demo Data',
      'This will reset all attendance records and users to their default test values. This is ideal for testing role workflows from scratch.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Data',
          style: 'destructive',
          onPress: async () => {
            setResetting(true);
            await resetAllAttendanceData();
            setResetting(false);
            Alert.alert('Success', 'Demo data has been restored to default state.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Account & Settings</Text>
          <Text style={styles.subtitle}>Session management and system tools</Text>
        </View>

        {/* User Card */}
        <View style={[styles.profileCard, SHADOWS.card]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>

          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>

          <View style={styles.badgeWrap}>
            <StatusBadge role={currentUser.role} size="md" />
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Role ID</Text>
              <Text style={styles.infoVal}>{currentUser.id}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoVal}>{currentUser.department}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Joined</Text>
              <Text style={styles.infoVal}>
                {currentUser.joinedDate ? formatDisplayDate(currentUser.joinedDate).slice(-4) : '2024'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Role Switcher for Assessment Reviewers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Switch Role (Evaluator Tool)</Text>
          <Text style={styles.sectionDesc}>
            Instantly switch accounts without re-entering credentials:
          </Text>

          <View style={styles.switchGrid}>
            {INITIAL_USERS.slice(0, 4).map((acc) => {
              const isCurrent = acc.id === currentUser.id;
              return (
                <TouchableOpacity
                  key={acc.id}
                  style={[
                    styles.switchCard,
                    isCurrent && styles.switchCardCurrent,
                    SHADOWS.subtle,
                  ]}
                  onPress={() => quickLogin(acc)}
                  activeOpacity={0.7}
                >
                  <View style={styles.switchTop}>
                    <StatusBadge role={acc.role} size="sm" />
                    {isCurrent && (
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                    )}
                  </View>
                  <Text style={styles.switchName} numberOfLines={1}>
                    {acc.name}
                  </Text>
                  <Text style={styles.switchEmail} numberOfLines={1}>
                    {acc.email}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* System Administration & Diagnostics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Administration</Text>

          <TouchableOpacity
            style={[styles.menuItem, SHADOWS.subtle]}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.warningBg }]}>
                <Ionicons name="refresh-circle" size={22} color={COLORS.warning} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Reset Demo Data</Text>
                <Text style={styles.menuSub}>Restore initial check-in records and users</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="danger"
          size="lg"
          icon="log-out-outline"
          fullWidth
          style={{ marginTop: SPACING.md }}
        />

        <Text style={styles.versionText}>
          Attendance Management System v1.0.0 • React Native & Expo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: SPACING.xxxl,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  email: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoCol: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  sectionDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  switchGrid: {
    gap: SPACING.xs,
  },
  switchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', userSelect: 'none' } as any) : {}),
  },
  switchCardCurrent: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAF5FF',
  },
  switchTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  switchName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  switchEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  menuSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  versionText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
