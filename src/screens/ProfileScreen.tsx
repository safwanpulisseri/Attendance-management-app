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
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
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
    Alert.alert('Sign Out', 'Conclude your authenticated session?', [
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
      'Reset Demo Baseline',
      'This will restore all employee profiles and attendance records to baseline test scenarios. Ideal for fresh walkthroughs.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Data',
          style: 'destructive',
          onPress: async () => {
            setResetting(true);
            await resetAllAttendanceData();
            setResetting(false);
            Alert.alert('Restored', 'Baseline demonstration records reloaded.');
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
          <Text style={styles.title}>Account Governance</Text>
          <Text style={styles.subtitle}>Session management and evaluator tools</Text>
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
              <Text style={styles.infoLabel}>SECURITY ID</Text>
              <Text style={styles.infoVal}>{currentUser.id}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>DEPARTMENT</Text>
              <Text style={styles.infoVal}>{currentUser.department}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>APPOINTED</Text>
              <Text style={styles.infoVal}>
                {currentUser.joinedDate ? formatDisplayDate(currentUser.joinedDate).slice(-4) : '2024'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Role Switcher for HR Assessment Reviewers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EVALUATOR ROLE SWITCHER</Text>
          <Text style={styles.sectionDesc}>
            Instantly shift security contexts without re-entering credentials:
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
                  activeOpacity={0.75}
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
          <Text style={styles.sectionTitle}>DATA & MAINTENANCE</Text>

          <TouchableOpacity
            style={[styles.menuItem, SHADOWS.subtle]}
            onPress={handleResetData}
            activeOpacity={0.75}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.pendingBg }]}>
                <Ionicons name="reload-outline" size={18} color={COLORS.accentGold} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Restore Initial Seed Records</Text>
                <Text style={styles.menuSub}>Reset check-ins and personnel records to baseline</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.slateMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out of Session"
          onPress={handleLogout}
          variant="danger"
          size="lg"
          icon="log-out-outline"
          fullWidth
          style={{ marginTop: SPACING.md }}
        />

        <Text style={styles.versionText}>
          Cadence HR Platform v1.2.0 • React Native & Expo Engine
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
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: SPACING.xxxl,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
  },
  name: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  email: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.sm,
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
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.slateMedium,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  infoVal: {
    fontSize: 12,
    fontFamily: FONTS.bold,
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
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.slateMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionDesc: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMedium,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  switchTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  switchName: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  switchEmail: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', userSelect: 'none' } as any) : {}),
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    marginTop: 2,
  },
  versionText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.slateMuted,
    textAlign: 'center',
    marginTop: SPACING.lg,
    letterSpacing: 0.5,
  },
});
