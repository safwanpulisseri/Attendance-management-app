import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AttendanceRecord } from '../types';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatusBadge } from './StatusBadge';
import { formatDisplayDate, calculateWorkDuration } from '../utils/dateUtils';

interface AttendanceCardProps {
  record: AttendanceRecord;
  showUserInfo?: boolean;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  record,
  showUserInfo = true,
}) => {
  const { colors } = useTheme();
  const duration = calculateWorkDuration(record.checkInTime, record.checkOutTime);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        SHADOWS.card,
      ]}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        {showUserInfo ? (
          <View style={styles.userColumn}>
            <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
              {record.userName || 'Employee'}
            </Text>
            {record.userRole ? (
              <View style={styles.roleWrap}>
                <StatusBadge role={record.userRole} size="sm" />
                {record.userDepartment ? (
                  <Text style={[styles.deptText, { color: colors.slateMuted }]}>
                    {' '}• {record.userDepartment}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.dateWrap}>
            <Ionicons name="calendar-outline" size={15} color={colors.slateMedium} />
            <Text style={[styles.dateText, { color: colors.textPrimary }]}>
              {formatDisplayDate(record.date)}
            </Text>
          </View>
        )}

        <StatusBadge status={record.status} size="sm" />
      </View>

      {/* Date Row if showUserInfo is true */}
      {showUserInfo ? (
        <View style={styles.dateSubRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.slateMuted} />
          <Text style={[styles.dateSubText, { color: colors.slateMuted }]}>
            {formatDisplayDate(record.date)}
          </Text>
        </View>
      ) : null}

      {/* Times Grid */}
      <View style={[styles.grid, { backgroundColor: colors.surfaceSubtle }]}>
        <View style={styles.gridCol}>
          <Text style={[styles.timeLabel, { color: colors.slateMedium }]}>CHECK IN</Text>
          <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
            {record.checkInTime || '--:--'}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.gridCol}>
          <Text style={[styles.timeLabel, { color: colors.slateMedium }]}>CHECK OUT</Text>
          <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
            {record.checkOutTime || '--:--'}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.gridCol}>
          <Text style={[styles.timeLabel, { color: colors.slateMedium }]}>DURATION</Text>
          <Text style={[styles.timeValue, { color: colors.textPrimary }]}>{duration}</Text>
        </View>
      </View>

      {record.note ? (
        <View style={[styles.noteBox, { backgroundColor: colors.surfaceSubtle }]}>
          <Ionicons name="information-circle-outline" size={13} color={colors.slateMedium} />
          <Text style={[styles.noteText, { color: colors.slateDark }]}>{record.note}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userColumn: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  userName: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  roleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  deptText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  dateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  dateSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: SPACING.sm,
  },
  dateSubText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    marginTop: 4,
  },
  gridCol: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
  },
  timeLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.sm,
  },
  noteText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
});
