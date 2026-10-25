import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { AttendanceCard } from '../components/AttendanceCard';
import { EmptyState } from '../components/EmptyState';
import { Input } from '../components/Input';
import { StatusBadge } from '../components/StatusBadge';

export const AttendanceHistoryScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserRecords } = useAttendance();
  const { colors } = useTheme();

  const [searchDate, setSearchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_out' | 'checked_in'>('all');

  if (!currentUser) return null;

  const userRecords = getUserRecords(currentUser.id);

  const filtered = useMemo(() => {
    return userRecords.filter((rec) => {
      if (searchDate.trim()) {
        const q = searchDate.toLowerCase();
        if (!rec.date.includes(q)) return false;
      }
      if (statusFilter !== 'all' && rec.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [userRecords, searchDate, statusFilter]);

  const totalDays = userRecords.length;
  const completedDays = userRecords.filter((r) => r.status === 'checked_out').length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Personal Shift Log</Text>
            <Text style={[styles.subtitle, { color: colors.slateMuted }]}>
              Historical ledger for {currentUser.name}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <StatusBadge role={currentUser.role} size="sm" />
          </View>
        </View>

        {/* Telemetry Summary Card */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            SHADOWS.card,
          ]}
        >
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{totalDays}</Text>
            <Text style={[styles.statLabel, { color: colors.slateMedium }]}>TOTAL SHIFTS</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.checkedInText }]}>{completedDays}</Text>
            <Text style={[styles.statLabel, { color: colors.slateMedium }]}>COMPLETED</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.primaryAccent }]}>
              {totalDays > 0 ? `${Math.round((completedDays / totalDays) * 100)}%` : '0%'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.slateMedium }]}>RELIABILITY</Text>
          </View>
        </View>

        {/* Filter Bar */}
        <View style={styles.filterRow}>
          <Input
            placeholder="Search by date (YYYY-MM-DD)..."
            value={searchDate}
            onChangeText={setSearchDate}
            leftIcon="calendar-outline"
            rightIcon={searchDate ? 'close-circle-outline' : undefined}
            onRightIconPress={() => setSearchDate('')}
            containerStyle={styles.filterInput}
          />

          <View style={styles.filterPills}>
            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: colors.surface, borderColor: colors.border },
                statusFilter === 'all' && [styles.pillActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
              ]}
              onPress={() => setStatusFilter('all')}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: colors.slateMedium },
                  statusFilter === 'all' && [styles.pillTextActive, { color: colors.textInverse }],
                ]}
              >
                All Logs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: colors.surface, borderColor: colors.border },
                statusFilter === 'checked_out' && [styles.pillActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
              ]}
              onPress={() => setStatusFilter('checked_out')}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: colors.slateMedium },
                  statusFilter === 'checked_out' && [styles.pillTextActive, { color: colors.textInverse }],
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: colors.surface, borderColor: colors.border },
                statusFilter === 'checked_in' && [styles.pillActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
              ]}
              onPress={() => setStatusFilter('checked_in')}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: colors.slateMedium },
                  statusFilter === 'checked_in' && [styles.pillTextActive, { color: colors.textInverse }],
                ]}
              >
                In Progress
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Records List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AttendanceCard record={item} showUserInfo={false} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No shift records found"
              description="Historical logs will appear here once recorded on your account."
              actionTitle={searchDate || statusFilter !== 'all' ? 'Reset Filters' : undefined}
              onActionPress={() => {
                setSearchDate('');
                setStatusFilter('all');
              }}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 28,
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
  summaryCard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    letterSpacing: 0.8,
    marginTop: 3,
  },
  statDivider: {
    width: 1,
  },
  filterRow: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xs,
  },
  filterInput: {
    marginBottom: SPACING.xs,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  pillActive: {},
  pillText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  pillTextActive: {
    fontFamily: FONTS.bold,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
});
