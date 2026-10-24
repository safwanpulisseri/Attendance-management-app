import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatCard } from '../components/StatCard';
import { AttendanceCard } from '../components/AttendanceCard';
import { StatusBadge } from '../components/StatusBadge';
import { ThemeToggle } from '../components/ThemeToggle';
import { formatDisplayDate, getTodayDateString } from '../utils/dateUtils';

interface AdminDashboardScreenProps {
  navigation: any;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { getStats, getScopedRecords } = useAttendance();
  const { colors } = useTheme();

  if (!currentUser) return null;

  const stats = getStats(currentUser);
  const allRecords = getScopedRecords(currentUser);
  const today = getTodayDateString();
  const recentRecords = allRecords.slice(0, 5);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Executive Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeSubtitle, { color: colors.slateMuted }]}>ORGANIZATION GOVERNANCE</Text>
            <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>Executive Command</Text>
            <View style={styles.badgeRow}>
              <StatusBadge role="admin" size="sm" />
              <Text style={[styles.dateLabel, { color: colors.slateMedium }]}> • {formatDisplayDate(today)}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <ThemeToggle />
            <TouchableOpacity
              style={[styles.profileBtn, { backgroundColor: colors.roleAdminBg, borderColor: colors.roleAdminBorder }]}
              onPress={() => navigation.navigate('ProfileTab')}
            >
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.roleAdmin} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Self-Attendance Banner */}
        <TouchableOpacity
          style={[styles.selfActionBanner, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('MyAttendance')}
        >
          <View style={styles.selfActionLeft}>
            <View style={[styles.selfIconWrap, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="finger-print-outline" size={18} color={colors.textPrimary} />
            </View>
            <View>
              <Text style={[styles.selfActionTitle, { color: colors.textPrimary }]}>Personal Shift Attendance</Text>
              <Text style={[styles.selfActionSub, { color: colors.slateMuted }]}>Tap to record arrival or departure</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.slateMedium} />
        </TouchableOpacity>

        {/* Live Metrics Grid */}
        <Text style={[styles.sectionHeading, { color: colors.slateMuted }]}>ORGANIZATION TELEMETRY</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="TOTAL HEADCOUNT"
              value={stats.totalUsers}
              icon="people-outline"
              color={colors.textPrimary}
              subtitle="Registered active profiles"
              onPress={() => navigation.navigate('Users')}
            />
            <StatCard
              title="STAFF MEMBERS"
              value={stats.totalStaff}
              icon="person-outline"
              color={colors.roleStaff}
              subtitle="Operations & engineering"
              onPress={() => navigation.navigate('Records', { role: 'staff' })}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="SENIOR LEADS"
              value={stats.totalSeniorStaff}
              icon="ribbon-outline"
              color={colors.roleSenior}
              subtitle="Department coordinators"
              onPress={() => navigation.navigate('Records', { role: 'senior_staff' })}
            />
            <StatCard
              title="CHECKED IN TODAY"
              value={stats.checkedInToday}
              icon="checkmark-circle-outline"
              color={colors.success}
              subtitle="Currently active"
              onPress={() => navigation.navigate('Records', { date: today })}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="NOT CHECKED IN"
              value={stats.notCheckedInToday}
              icon="time-outline"
              color={colors.accentGold}
              subtitle="Awaiting shift arrival"
            />
            <StatCard
              title="COMPLETED SHIFTS"
              value={stats.checkedOutToday}
              icon="log-out-outline"
              color={colors.secondary}
              subtitle="Checked out today"
            />
          </View>
        </View>

        {/* Quick Navigation Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}
            onPress={() => navigation.navigate('Records')}
          >
            <Ionicons name="document-text-outline" size={16} color={colors.textPrimary} />
            <Text style={[styles.shortcutText, { color: colors.textPrimary }]}>Full Attendance Log</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}
            onPress={() => navigation.navigate('Users')}
          >
            <Ionicons name="people-outline" size={16} color={colors.textPrimary} />
            <Text style={[styles.shortcutText, { color: colors.textPrimary }]}>Staff Directory</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Attendance Activity Feed */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={[styles.sectionHeading, { color: colors.slateMuted }]}>RECENT ACTIVITY FEED</Text>
              <Text style={[styles.sectionSub, { color: colors.slateMedium }]}>Live shifts recorded across departments</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Records')}
              style={styles.seeAllBtn}
            >
              <Text style={[styles.seeAllText, { color: colors.primaryAccent }]}>View All</Text>
              <Ionicons name="arrow-forward" size={13} color={colors.primaryAccent} />
            </TouchableOpacity>
          </View>

          {recentRecords.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.slateMuted }]}>No attendance records recorded yet.</Text>
          ) : (
            recentRecords.map((record) => (
              <AttendanceCard key={record.id} record={record} showUserInfo={true} />
            ))
          )}
        </View>
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
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 28,
  },
  welcomeSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  selfActionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  selfActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selfIconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfActionTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  selfActionSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 0.9,
    marginBottom: SPACING.xs,
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  statsGrid: {
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  shortcutCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
  },
  shortcutText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  recentSection: {
    marginTop: SPACING.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});
