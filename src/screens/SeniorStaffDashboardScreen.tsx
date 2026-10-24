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
import { EmptyState } from '../components/EmptyState';
import { formatDisplayDate, getTodayDateString } from '../utils/dateUtils';

interface SeniorStaffDashboardScreenProps {
  navigation: any;
}

export const SeniorStaffDashboardScreen: React.FC<SeniorStaffDashboardScreenProps> = ({
  navigation,
}) => {
  const { currentUser } = useAuth();
  const { getStats, getScopedRecords } = useAttendance();

  if (!currentUser) return null;

  const stats = getStats(currentUser);
  // getScopedRecords for Senior Staff strictly returns Staff records only!
  const scopedRecords = getScopedRecords(currentUser);
  const today = getTodayDateString();

  // Current day's Staff attendance records only
  const todayStaffRecords = scopedRecords.filter((r) => r.date === today);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeSubtitle}>Team Operations</Text>
            <Text style={styles.welcomeTitle}>Senior Staff Hub</Text>
            <View style={styles.badgeRow}>
              <StatusBadge role="senior_staff" size="sm" />
              <Text style={styles.dateLabel}> • {formatDisplayDate(today)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <Ionicons name="shield" size={24} color={COLORS.roleSenior} />
          </TouchableOpacity>
        </View>

        {/* Self Attendance Action Card */}
        <TouchableOpacity
          style={[styles.selfActionBanner, SHADOWS.card]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('MyAttendance')}
        >
          <View style={styles.selfActionLeft}>
            <View style={styles.selfIconWrap}>
              <Ionicons name="finger-print" size={22} color={COLORS.roleSenior} />
            </View>
            <View>
              <Text style={styles.selfActionTitle}>Mark Your Own Attendance</Text>
              <Text style={styles.selfActionSub}>
                Check in or check out for today's shift
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.roleSenior} />
        </TouchableOpacity>

        {/* Staff-Only Summary Cards */}
        <Text style={styles.sectionHeading}>Staff Attendance Overview</Text>
        <Text style={styles.sectionSub}>Metrics exclusively for Staff role</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Staff"
              value={stats.totalStaff}
              icon="people-outline"
              color={COLORS.roleStaff}
              bgColor={COLORS.roleStaffBg}
              subtitle="Staff under supervision"
              onPress={() => navigation.navigate('Records')}
            />
            <StatCard
              title="Staff Checked In"
              value={stats.checkedInToday}
              icon="checkmark-circle-outline"
              color={COLORS.success}
              bgColor={COLORS.successBg}
              subtitle="Present today"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="Staff Not Checked In"
              value={stats.notCheckedInToday}
              icon="alert-circle-outline"
              color={COLORS.warning}
              bgColor={COLORS.warningBg}
              subtitle="Absent / Not yet arrived"
            />
            <StatCard
              title="Staff Checked Out"
              value={stats.checkedOutToday}
              icon="log-out-outline"
              color={COLORS.info}
              bgColor={COLORS.infoBg}
              subtitle="Shift completed today"
            />
          </View>
        </View>

        {/* Today's Staff Attendance Records */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>Today's Staff Check-ins</Text>
              <Text style={styles.sectionSub}>Live check-in & check-out records</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Records')}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>All Staff History</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {todayStaffRecords.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="No Staff checked in today yet"
              description="Staff members will appear here immediately once they record their attendance."
            />
          ) : (
            todayStaffRecords.map((record) => (
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
    backgroundColor: COLORS.roleSeniorBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
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
    borderColor: '#BFDBFE',
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
    backgroundColor: COLORS.roleSeniorBg,
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
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  recentSection: {
    marginTop: SPACING.sm,
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
});
