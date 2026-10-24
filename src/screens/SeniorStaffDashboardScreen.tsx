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
  const scopedRecords = getScopedRecords(currentUser);
  const today = getTodayDateString();
  const todayStaffRecords = scopedRecords.filter((r) => r.date === today);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeSubtitle}>TEAM COORDINATION</Text>
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
            <Ionicons name="shield-outline" size={20} color={COLORS.roleSenior} />
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
              <Ionicons name="finger-print-outline" size={18} color={COLORS.textPrimary} />
            </View>
            <View>
              <Text style={styles.selfActionTitle}>Personal Shift Attendance</Text>
              <Text style={styles.selfActionSub}>
                Record your own arrival or departure for today
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.slateMedium} />
        </TouchableOpacity>

        {/* Staff-Only Summary Cards */}
        <Text style={styles.sectionHeading}>STAFF ATTENDANCE METRICS</Text>
        <Text style={styles.sectionSub}>Scoped exclusively to operational staff members</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="ASSIGNED STAFF"
              value={stats.totalStaff}
              icon="people-outline"
              color={COLORS.roleStaff}
              subtitle="Staff under supervision"
              onPress={() => navigation.navigate('Records')}
            />
            <StatCard
              title="STAFF CHECKED IN"
              value={stats.checkedInToday}
              icon="checkmark-circle-outline"
              color={COLORS.success}
              subtitle="Currently on shift"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="STAFF PENDING"
              value={stats.notCheckedInToday}
              icon="time-outline"
              color={COLORS.accentGold}
              subtitle="Not yet arrived"
            />
            <StatCard
              title="STAFF CHECKED OUT"
              value={stats.checkedOutToday}
              icon="log-out-outline"
              color={COLORS.secondary}
              subtitle="Shift completed today"
            />
          </View>
        </View>

        {/* Today's Staff Attendance Records */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>TODAY'S TEAM PRESENCE</Text>
              <Text style={styles.sectionSub}>Live check-ins for current shift</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Records')}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>Staff History</Text>
              <Ionicons name="arrow-forward" size={13} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {todayStaffRecords.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="No staff check-ins today yet"
              description="Team records will populate here in real-time as staff mark their shift."
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
    backgroundColor: COLORS.roleSeniorBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.roleSeniorBorder,
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
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMedium,
    marginBottom: SPACING.md,
    marginTop: 2,
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
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});
