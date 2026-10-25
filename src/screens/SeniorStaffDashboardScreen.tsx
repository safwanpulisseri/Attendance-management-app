import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatCard } from '../components/StatCard';
import { AttendanceCard } from '../components/AttendanceCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { ThemeToggle } from '../components/ThemeToggle';
import { formatDisplayDate, getTodayDateString, getTimeGreeting } from '../utils/dateUtils';

interface SeniorStaffDashboardScreenProps {
  navigation: any;
}

export const SeniorStaffDashboardScreen: React.FC<SeniorStaffDashboardScreenProps> = ({
  navigation,
}) => {
  const { currentUser } = useAuth();
  const { getStats, getScopedRecords } = useAttendance();
  const { colors } = useTheme();

  if (!currentUser) return null;

  const stats = getStats(currentUser);
  const scopedRecords = getScopedRecords(currentUser);
  const today = getTodayDateString();
  const todayStaffRecords = scopedRecords.filter((r) => r.date === today);
  const greeting = getTimeGreeting(currentUser.name);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.welcomeSubtitle, { color: colors.slateMuted }]}>SENIOR STAFF HUB</Text>
            <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
              {greeting.greeting} {greeting.emoji}
            </Text>
            <View style={styles.badgeRow}>
              <StatusBadge role="senior_staff" size="sm" />
              <Text style={[styles.dateLabel, { color: colors.slateMedium }]}> • {formatDisplayDate(today)}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <ThemeToggle />
            <TouchableOpacity
              style={[styles.profileBtn, { backgroundColor: colors.roleSeniorBg, borderColor: colors.roleSeniorBorder }]}
              onPress={() => navigation.navigate('ProfileTab')}
            >
              <Ionicons name="shield-outline" size={18} color={colors.roleSenior} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Self Attendance Action Card */}
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
              <Text style={[styles.selfActionSub, { color: colors.slateMuted }]}>
                Record your own arrival or departure for today
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.slateMedium} />
        </TouchableOpacity>

        {/* Staff-Only Summary Cards */}
        <Text style={[styles.sectionHeading, { color: colors.slateMuted }]}>STAFF ATTENDANCE METRICS</Text>
        <Text style={[styles.sectionSub, { color: colors.slateMedium }]}>Scoped exclusively to operational staff members</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="ASSIGNED STAFF"
              value={stats.totalStaff}
              icon="people-outline"
              color={colors.roleStaff}
              subtitle="Staff under supervision"
              onPress={() => navigation.navigate('Records')}
            />
            <StatCard
              title="STAFF CHECKED IN"
              value={stats.checkedInToday}
              icon="checkmark-circle-outline"
              color={colors.success}
              subtitle="Currently on shift"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="STAFF PENDING"
              value={stats.notCheckedInToday}
              icon="time-outline"
              color={colors.accentGold}
              subtitle="Not yet arrived"
            />
            <StatCard
              title="STAFF CHECKED OUT"
              value={stats.checkedOutToday}
              icon="log-out-outline"
              color={colors.secondary}
              subtitle="Shift completed today"
            />
          </View>
        </View>

        {/* Today's Staff Attendance Records */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={[styles.sectionHeading, { color: colors.slateMuted }]}>TODAY'S TEAM PRESENCE</Text>
              <Text style={[styles.sectionSub, { color: colors.slateMedium }]}>Live check-ins for current shift</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Records')}
              style={styles.seeAllBtn}
            >
              <Text style={[styles.seeAllText, { color: colors.primaryAccent }]}>Staff History</Text>
              <Ionicons name="arrow-forward" size={13} color={colors.primaryAccent} />
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
  },
  scrollContent: {
    padding: SPACING.lg,
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'web' ? 90 : SPACING.lg,
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
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
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
  },
});
