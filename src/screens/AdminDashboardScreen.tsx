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
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
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

  // Recent attendance list (latest 5 records across all roles)
  const recentRecords = allRecords.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeSubtitle}>Organization Overview</Text>
            <Text style={styles.welcomeTitle}>Admin Command Center</Text>
            <View style={styles.badgeRow}>
              <StatusBadge role="admin" size="sm" />
              <Text style={styles.dateLabel}> • {formatDisplayDate(today)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <Ionicons name="shield-checkmark" size={24} color={COLORS.roleAdmin} />
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
              <Ionicons name="finger-print" size={22} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.selfActionTitle}>Mark Your Own Attendance</Text>
              <Text style={styles.selfActionSub}>Tap to check in or out for today</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Dynamic Summary Cards */}
        <Text style={styles.sectionHeading}>Today's Live Statistics</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon="people"
              color={COLORS.primary}
              bgColor={COLORS.primaryLight}
              subtitle="All registered accounts"
              onPress={() => navigation.navigate('Users')}
            />
            <StatCard
              title="Staff Members"
              value={stats.totalStaff}
              icon="person"
              color={COLORS.roleStaff}
              bgColor={COLORS.roleStaffBg}
              subtitle="Regular employees"
              onPress={() => navigation.navigate('Records', { role: 'staff' })}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="Senior Staff"
              value={stats.totalSeniorStaff}
              icon="ribbon"
              color={COLORS.roleSenior}
              bgColor={COLORS.roleSeniorBg}
              subtitle="Team leads"
              onPress={() => navigation.navigate('Records', { role: 'senior_staff' })}
            />
            <StatCard
              title="Checked In Today"
              value={stats.checkedInToday}
              icon="checkmark-circle"
              color={COLORS.success}
              bgColor={COLORS.successBg}
              subtitle="Active present"
              onPress={() => navigation.navigate('Records', { date: today })}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="Not Checked In"
              value={stats.notCheckedInToday}
              icon="time"
              color={COLORS.warning}
              bgColor={COLORS.warningBg}
              subtitle="Pending arrival"
            />
            <StatCard
              title="Checked Out"
              value={stats.checkedOutToday}
              icon="log-out"
              color={COLORS.secondary}
              bgColor={COLORS.secondaryLight}
              subtitle="Shift completed"
            />
          </View>
        </View>

        {/* Quick Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={[styles.shortcutCard, SHADOWS.card]}
            onPress={() => navigation.navigate('Records')}
          >
            <Ionicons name="list-outline" size={20} color={COLORS.primary} />
            <Text style={styles.shortcutText}>All Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutCard, SHADOWS.card]}
            onPress={() => navigation.navigate('Users')}
          >
            <Ionicons name="people-outline" size={20} color={COLORS.roleSenior} />
            <Text style={styles.shortcutText}>User Directory</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Attendance Records Across Organization */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>Recent Attendance Activity</Text>
              <Text style={styles.sectionSub}>All employees across departments</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Records')}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
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
    maxWidth: 700,
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
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.roleAdminBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
  },
  selfActionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  selfActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selfIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  selfActionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
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
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  shortcutCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shortcutText: {
    fontSize: 13,
    fontWeight: '700',
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
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});
