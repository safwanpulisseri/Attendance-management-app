import React, { useState, useMemo, useEffect } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { AttendanceCard } from '../components/AttendanceCard';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { getTodayDateString, getRecentDateStrings, formatDisplayDate } from '../utils/dateUtils';

interface AttendanceRecordsScreenProps {
  route?: any;
}

export const AttendanceRecordsScreen: React.FC<AttendanceRecordsScreenProps> = ({ route }) => {
  const { currentUser } = useAuth();
  const { getScopedRecords, filterRecords } = useAttendance();
  const { colors } = useTheme();

  const initialRole = route?.params?.role || 'all';
  const initialDate = route?.params?.date || 'all';

  const [searchQuery, setSearchQuery] = useState(route?.params?.search || '');

  useEffect(() => {
    if (route?.params?.search !== undefined) {
      setSearchQuery(route.params.search);
    }
    if (route?.params?.role !== undefined) {
      setSelectedRole(route.params.role);
    }
  }, [route?.params]);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);

  if (!currentUser) return null;

  const scopedRecords = getScopedRecords(currentUser);

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
        { label: 'Senior Lead', value: 'senior_staff' },
        { label: 'Admin', value: 'admin' },
      ];
    }
    return [{ label: 'Staff Only', value: 'staff' }];
  }, [currentUser.role]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDate('all');
    setSelectedRole('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedDate !== 'all' || (currentUser.role === 'admin' && selectedRole !== 'all');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Attendance Records</Text>
            <Text style={[styles.subtitle, { color: colors.slateMuted }]}>
              {currentUser.role === 'admin'
                ? 'Comprehensive enterprise attendance registry'
                : 'Operational staff attendance registry'}
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
          <Text style={[styles.filterLabel, { color: colors.slateMedium }]}>TIMEFRAME</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsRow}
          >
            {recentDates.map((dateVal) => {
              const isSelected = selectedDate === dateVal;
              let label = 'All History';
              if (dateVal === getTodayDateString()) {
                label = 'Today';
              } else if (dateVal !== 'all') {
                label = formatDisplayDate(dateVal).split(',')[0] + ', ' + dateVal.slice(5);
              }

              return (
                <TouchableOpacity
                  key={dateVal}
                  style={[
                    styles.pill,
                    { backgroundColor: isSelected ? colors.primary : colors.surface, borderColor: isSelected ? colors.primary : colors.border },
                  ]}
                  onPress={() => setSelectedDate(dateVal)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: isSelected ? colors.textInverse : colors.slateMedium },
                      isSelected && { fontFamily: FONTS.bold },
                    ]}
                  >
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
            <Text style={[styles.filterLabel, { color: colors.slateMedium }]}>ROLE SCOPE</Text>
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
                    style={[
                      styles.pill,
                      { backgroundColor: isSelected ? colors.primary : colors.surface, borderColor: isSelected ? colors.primary : colors.border },
                    ]}
                    onPress={() => setSelectedRole(r.value)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: isSelected ? colors.textInverse : colors.slateMedium },
                        isSelected && { fontFamily: FONTS.bold },
                      ]}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Active Filters Summary Bar */}
        <View style={[styles.summaryBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.summaryCount, { color: colors.slateMedium }]}>
            Found <Text style={[styles.countBold, { color: colors.textPrimary }]}>{filtered.length}</Text> shift record(s)
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
              <Ionicons name="refresh" size={13} color={colors.danger} />
              <Text style={[styles.clearText, { color: colors.danger }]}>Clear Filters</Text>
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
              title="No records match filter criteria"
              description="Refine your search term or select an alternate date timeframe."
              actionTitle={hasActiveFilters ? 'Reset Filters' : undefined}
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
  },
  container: {
    flex: 1,
    maxWidth: 650,
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
  title: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 2,
    maxWidth: 290,
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
    marginVertical: 3,
  },
  filterLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    letterSpacing: 0.8,
    marginRight: 8,
    minWidth: 70,
  },
  filterPillsRow: {
    gap: 6,
    paddingVertical: 2,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    marginTop: 6,
  },
  summaryCount: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  countBold: {
    fontFamily: FONTS.bold,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
});
