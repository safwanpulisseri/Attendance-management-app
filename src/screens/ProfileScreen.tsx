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
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { formatDisplayDate } from '../utils/dateUtils';
import { INITIAL_USERS } from '../data/dummyData';

export const ProfileScreen: React.FC = () => {
  const { currentUser, logout, quickLogin } = useAuth();
  const { resetAllAttendanceData } = useAttendance();
  const { colors, isDark } = useTheme();

  const [resetting, setResetting] = useState(false);

  if (!currentUser) return null;

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Sign Out: Conclude your authenticated session?');
      if (confirmed) {
        logout();
      }
      return;
    }

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
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Reset Demo Baseline\n\nThis will restore all employee profiles and attendance records to baseline test scenarios. Ideal for fresh walkthroughs.\n\nProceed with reset?'
      );
      if (confirmed) {
        setResetting(true);
        await resetAllAttendanceData();
        setResetting(false);
        window.alert('Restored: Baseline demonstration records reloaded.');
      }
      return;
    }

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Account Governance</Text>
            <Text style={[styles.subtitle, { color: colors.slateMuted }]}>Session management and evaluator tools</Text>
          </View>
          <ThemeToggle />
        </View>

        {/* User Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
          <View style={[styles.avatar, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderStrong }]}>
            <Text style={[styles.avatarText, { color: colors.textPrimary }]}>
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>

          <Text style={[styles.name, { color: colors.textPrimary }]}>{currentUser.name}</Text>
          <Text style={[styles.email, { color: colors.slateMuted }]}>{currentUser.email}</Text>

          <View style={styles.badgeWrap}>
            <StatusBadge role={currentUser.role} size="md" />
          </View>

          <View style={[styles.infoGrid, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: colors.slateMedium }]}>SECURITY ID</Text>
              <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{currentUser.id}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: colors.slateMedium }]}>DEPARTMENT</Text>
              <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{currentUser.department}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: colors.slateMedium }]}>APPOINTED</Text>
              <Text style={[styles.infoVal, { color: colors.textPrimary }]}>
                {currentUser.joinedDate ? formatDisplayDate(currentUser.joinedDate).slice(-4) : '2024'}
              </Text>
            </View>
          </View>
        </View>

        {/* APPEARANCE & THEME CHANGER SECTION */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.slateMuted }]}>INTERFACE APPEARANCE</Text>
          <Text style={[styles.sectionDesc, { color: colors.slateMedium }]}>
            Seamless circular top reveal transition between Obsidian and Light:
          </Text>

          <View style={[styles.appearanceBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.appearanceTextWrap}>
              <View style={styles.appearanceLabelRow}>
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={16}
                  color={isDark ? colors.primaryAccent : colors.accentGold}
                />
                <Text style={[styles.appearanceTitle, { color: colors.textPrimary }]}>
                  {isDark ? 'Obsidian OLED Dark' : 'Titanium Clean Light'}
                </Text>
              </View>
              <Text style={[styles.appearanceSub, { color: colors.slateMuted }]}>
                Smooth top-side circular reveal
              </Text>
            </View>
            <View style={{ width: 140 }}>
              <ThemeToggle variant="segmented" />
            </View>
          </View>
        </View>

        {/* Quick Role Switcher for HR Assessment Reviewers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.slateMuted }]}>EVALUATOR ROLE SWITCHER</Text>
          <Text style={[styles.sectionDesc, { color: colors.slateMedium }]}>
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
                    { backgroundColor: colors.surface, borderColor: isCurrent ? colors.primaryAccent : colors.border },
                    isCurrent && { borderWidth: 1.5 },
                    SHADOWS.subtle,
                  ]}
                  onPress={() => quickLogin(acc)}
                  activeOpacity={0.75}
                >
                  <View style={styles.switchTop}>
                    <StatusBadge role={acc.role} size="sm" />
                    {isCurrent && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.primaryAccent} />
                    )}
                  </View>
                  <Text style={[styles.switchName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {acc.name}
                  </Text>
                  <Text style={[styles.switchEmail, { color: colors.slateMuted }]} numberOfLines={1}>
                    {acc.email}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* System Administration & Diagnostics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.slateMuted }]}>DATA & MAINTENANCE</Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.subtle]}
            onPress={handleResetData}
            activeOpacity={0.75}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.pendingBg }]}>
                <Ionicons name="reload-outline" size={18} color={colors.accentGold} />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Restore Initial Seed Records</Text>
                <Text style={[styles.menuSub, { color: colors.slateMuted }]}>Reset check-ins and personnel records to baseline</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.slateMuted} />
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

        <Text style={[styles.versionText, { color: colors.slateMuted }]}>
          Midland Marketing HR Portal v1.2.0 • React Native & Expo Engine
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'web' ? 100 : SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  profileCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
  },
  name: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  email: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  infoGrid: {
    flexDirection: 'row',
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    width: '100%',
    borderWidth: 1,
  },
  infoCol: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  infoVal: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  divider: {
    width: 1,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionDesc: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.sm,
  },
  appearanceBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  appearanceTextWrap: {
    flex: 1,
    marginRight: SPACING.md,
  },
  appearanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  appearanceTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  appearanceSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  switchGrid: {
    gap: SPACING.xs,
  },
  switchCard: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', userSelect: 'none' } as any) : {}),
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
  },
  switchEmail: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
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
  },
  menuSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  versionText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginTop: SPACING.lg,
    letterSpacing: 0.5,
  },
});
