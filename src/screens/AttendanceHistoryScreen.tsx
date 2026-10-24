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
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { AttendanceCard } from '../components/AttendanceCard';
import { EmptyState } from '../components/EmptyState';
import { Input } from '../components/Input';
import { StatusBadge } from '../components/StatusBadge';

export const AttendanceHistoryScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserRecords } = useAttendance();

  const [searchDate, setSearchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_out' | 'checked_in'>('all');

  if (!currentUser) return null;

  // Chronological order, latest first
  const userRecords = getUserRecords(currentUser.id);

  // Filtered list
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

  // Compute personal summary metrics
  const totalDays = userRecords.length;
  const completedDays = userRecords.filter((r) => r.status === 'checked_out').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Attendance History</Text>
            <Text style={styles.subtitle}>
              Personal log for {currentUser.name}
            </Text>
          </View>
          <StatusBadge role={currentUser.role} size="sm" />
        </View>

        {/* Summary Card */}
        <View style={[styles.summaryCard, SHADOWS.card]}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalDays}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>{completedDays}</Text>
            <Text style={styles.statLabel}>Completed Shifts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              {totalDays > 0 ? `${Math.round((completedDays / totalDays) * 100)}%` : '0%'}
            </Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
        </View>

        {/* Filter Bar */}
        <View style={styles.filterRow}>
          <Input
            placeholder="Filter by date (YYYY-MM-DD)..."
            value={searchDate}
            onChangeText={setSearchDate}
            leftIcon="calendar-outline"
            rightIcon={searchDate ? 'close-circle-outline' : undefined}
            onRightIconPress={() => setSearchDate('')}
            containerStyle={styles.filterInput}
          />

          <View style={styles.filterPills}>
            <TouchableOpacity
              style={[styles.pill, statusFilter === 'all' && styles.pillActive]}
              onPress={() => setStatusFilter('all')}
            >
              <Text style={[styles.pillText, statusFilter === 'all' && styles.pillTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, statusFilter === 'checked_out' && styles.pillActive]}
              onPress={() => setStatusFilter('checked_out')}
            >
              <Text style={[styles.pillText, statusFilter === 'checked_out' && styles.pillTextActive]}>
                Completed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, statusFilter === 'checked_in' && styles.pillActive]}
              onPress={() => setStatusFilter('checked_in')}
            >
              <Text style={[styles.pillText, statusFilter === 'checked_in' && styles.pillTextActive]}>
                Incomplete
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
              title="No attendance records found"
              description="Your attendance logs will appear here once recorded."
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
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
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
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
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
    gap: 8,
    marginBottom: SPACING.sm,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: COLORS.textInverse,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
});
