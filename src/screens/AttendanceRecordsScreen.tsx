import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { AttendanceCard } from '../components/AttendanceCard';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { getTodayDateString, getRecentDateStrings, formatDisplayDate } from '../utils/dateUtils';
import { AttendanceRecord, UserRole } from '../types';

interface AttendanceRecordsScreenProps {
  route?: any;
}

export const AttendanceRecordsScreen: React.FC<AttendanceRecordsScreenProps> = ({ route }) => {
  const { currentUser } = useAuth();
  const { getScopedRecords, filterRecords } = useAttendance();

  const initialRole = route?.params?.role || 'all';
  const initialDate = route?.params?.date || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);

  if (!currentUser) return null;

  // Enforce role scoping from AttendanceContext:
  // Admin gets all; Senior Staff gets only staff; Staff gets only own.
  const scopedRecords = getScopedRecords(currentUser);

  // Filtered records
  const filtered = useMemo(() => {
    return filterRecords(scopedRecords, searchQuery, selectedDate, selectedRole);
  }, [scopedRecords, searchQuery, selectedDate, selectedRole, filterRecords]);

  const recentDates = useMemo(() => {
    const dates = getRecentDateStrings(5);
    return ['all', ...dates];
  }, []);

  const rolesList: { label: string; value: string }[] = useMemo(() => {
    if (currentUser.role === 'admin') {
      return [
        { label: 'All Roles', value: 'all' },
        { label: 'Staff', value: 'staff' },
        { label: 'Senior Staff', value: 'senior_staff' },
        { label: 'Admin', value: 'admin' },
      ];
    }
    // Senior Staff can only view Staff
    return [{ label: 'Staff Only', value: 'staff' }];
  }, [currentUser.role]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDate('all');
    setSelectedRole('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedDate !== 'all' || (currentUser.role === 'admin' && selectedRole !== 'all');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Attendance Records</Text>
            <Text style={styles.subtitle}>
              {currentUser.role === 'admin'
                ? 'Showing records for all staff, senior staff & admin'
                : 'Showing records strictly for Staff members'}
            </Text>
          </View>
          <View style={styles.badgeWrap}>
            <StatusBadge role={currentUser.role} size="sm" />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <Input
            placeholder="Search by employee name or department..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
            rightIcon={searchQuery ? 'close-circle-outline' : undefined}
            onRightIconPress={() => setSearchQuery('')}
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Filter Pills - Dates */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Date Filter:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsRow}
          >
            {recentDates.map((dateVal) => {
              const isSelected = selectedDate === dateVal;
              let label = 'All Dates';
              if (dateVal === getTodayDateString()) {
                label = 'Today';
              } else if (dateVal !== 'all') {
                label = formatDisplayDate(dateVal).split(',')[0] + ', ' + dateVal.slice(5);
              }

              return (
                <TouchableOpacity
                  key={dateVal}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  onPress={() => setSelectedDate(dateVal)}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Filter Pills - Roles (Admin only) */}
        {currentUser.role === 'admin' && (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Role Filter:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterPillsRow}
            >
              {rolesList.map((r) => {
                const isSelected = selectedRole === r.value;
                return (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => setSelectedRole(r.value)}
                  >
                    <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Active Filters Summary Bar */}
        <View style={styles.summaryBar}>
          <Text style={styles.summaryCount}>
            Found <Text style={styles.countBold}>{filtered.length}</Text> record(s)
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
              <Ionicons name="refresh" size={14} color={COLORS.danger} />
              <Text style={styles.clearText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Attendance Records List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AttendanceCard record={item} showUserInfo={true} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No records match your criteria"
              description="Try adjusting your search query, date filter, or role filter."
              actionTitle={hasActiveFilters ? 'Clear All Filters' : undefined}
              onActionPress={clearFilters}
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
    maxWidth: 750,
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
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    maxWidth: 280,
  },
  badgeWrap: {
    alignSelf: 'flex-start',
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xs,
  },
  searchInput: {
    marginBottom: SPACING.xs,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginVertical: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginRight: 8,
    minWidth: 70,
  },
  filterPillsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pillTextSelected: {
    color: COLORS.textInverse,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginTop: 6,
  },
  summaryCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  countBold: {
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
});
