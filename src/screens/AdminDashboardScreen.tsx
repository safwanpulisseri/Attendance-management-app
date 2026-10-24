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
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatCard } from '../components/StatCard';
import { AttendanceCard } from '../components/AttendanceCard';
import { StatusBadge } from '../components/StatusBadge';
import { formatDisplayDate, getTodayDateString } from '../utils/dateUtils';

interface AdminDashboardScreenProps {
  navigation: any;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { getStats, getScopedRecords } = useAttendance();

  if (!currentUser) return null;

  const stats = getStats(currentUser);
  const allRecords = getScopedRecords(currentUser);
  const today = getTodayDateString();
  const recentRecords = allRecords.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Executive Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeSubtitle}>ORGANIZATION GOVERNANCE</Text>
            <Text style={styles.welcomeTitle}>Executive Command</Text>
            <View style={styles.badgeRow}>
              <StatusBadge role="admin" size="sm" />
              <Text style={styles.dateLabel}> • {formatDisplayDate(today)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.roleAdmin} />
          </TouchableOpacity>
        </View>

        {/* Quick Self-Attendance Banner */}
        <TouchableOpacity
          style={[styles.selfActionBanner, SHADOWS.card]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('MyAttendance')}
        >
          <View style={styles.selfActionLeft}>
            <View style={styles.selfIconWrap}>
              <Ionicons name="finger-print-outline" size={18} color={COLORS.textPrimary} />
            </View>
            <View>
              <Text style={styles.selfActionTitle}>Personal Shift Attendance</Text>
              <Text style={styles.selfActionSub}>Tap to record arrival or departure</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.slateMedium} />
        </TouchableOpacity>

        {/* Live Metrics Grid */}
        <Text style={styles.sectionHeading}>ORGANIZATION TELEMETRY</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="TOTAL HEADCOUNT"
              value={stats.totalUsers}
              icon="people-outline"
              color={COLORS.textPrimary}
              subtitle="Registered active profiles"
              onPress={() => navigation.navigate('Users')}
            />
            <StatCard
              title="STAFF MEMBERS"
              value={stats.totalStaff}
              icon="person-outline"
              color={COLORS.roleStaff}
              subtitle="Operations & engineering"
              onPress={() => navigation.navigate('Records', { role: 'staff' })}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="SENIOR LEADS"
              value={stats.totalSeniorStaff}
              icon="ribbon-outline"
              color={COLORS.roleSenior}
              subtitle="Department coordinators"
              onPress={() => navigation.navigate('Records', { role: 'senior_staff' })}
            />
            <StatCard
              title="CHECKED IN TODAY"
              value={stats.checkedInToday}
              icon="checkmark-circle-outline"
              color={COLORS.success}
              subtitle="Currently active"
              onPress={() => navigation.navigate('Records', { date: today })}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="NOT CHECKED IN"
              value={stats.notCheckedInToday}
              icon="time-outline"
              color={COLORS.accentGold}
              subtitle="Awaiting shift arrival"
            />
            <StatCard
              title="COMPLETED SHIFTS"
              value={stats.checkedOutToday}
              icon="log-out-outline"
              color={COLORS.secondary}
              subtitle="Checked out today"
            />
          </View>
        </View>

        {/* Quick Navigation Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={[styles.shortcutCard, SHADOWS.card]}
            onPress={() => navigation.navigate('Records')}
          >
            <Ionicons name="document-text-outline" size={16} color={COLORS.textPrimary} />
            <Text style={styles.shortcutText}>Full Attendance Log</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, SHADOWS.card]}
            onPress={() => navigation.navigate('Users')}
          >
            <Ionicons name="people-outline" size={16} color={COLORS.textPrimary} />
            <Text style={styles.shortcutText}>Staff Directory</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Attendance Activity Feed */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>RECENT ACTIVITY FEED</Text>
              <Text style={styles.sectionSub}>Live shifts recorded across departments</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Records')}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={13} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {recentRecords.length === 0 ? (
            <Text style={styles.emptyText}>No attendance records recorded yet.</Text>
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
    backgroundColor: COLORS.background,
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
  welcomeSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.slateMuted,
    letterSpacing: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
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
    color: COLORS.slateMedium,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.roleAdminBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.roleAdminBorder,
  },
  selfActionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfActionTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  selfActionSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.slateMuted,
    letterSpacing: 0.9,
    marginBottom: SPACING.xs,
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMedium,
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shortcutText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
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
    color: COLORS.primary,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});
