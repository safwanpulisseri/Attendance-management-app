import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AttendanceRecord } from '../types';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
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
  const duration = calculateWorkDuration(record.checkInTime, record.checkOutTime);

  return (
    <View style={[styles.card, SHADOWS.card]}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        {showUserInfo ? (
          <View style={styles.userColumn}>
            <Text style={styles.userName} numberOfLines={1}>
              {record.userName || 'Employee'}
            </Text>
            {record.userRole ? (
              <View style={styles.roleWrap}>
                <StatusBadge role={record.userRole} size="sm" />
                {record.userDepartment ? (
                  <Text style={styles.deptText}> • {record.userDepartment}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.dateWrap}>
            <Ionicons name="calendar-outline" size={15} color={COLORS.slateMedium} />
            <Text style={styles.dateText}>{formatDisplayDate(record.date)}</Text>
          </View>
        )}

        <StatusBadge status={record.status} size="sm" />
      </View>

      {/* Date Row if showUserInfo is true */}
      {showUserInfo ? (
        <View style={styles.dateSubRow}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.slateMuted} />
          <Text style={styles.dateSubText}>{formatDisplayDate(record.date)}</Text>
        </View>
      ) : null}

      {/* Times Grid */}
      <View style={styles.grid}>
        <View style={styles.gridCol}>
          <Text style={styles.timeLabel}>CHECK IN</Text>
          <Text style={styles.timeValue}>{record.checkInTime || '--:--'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.gridCol}>
          <Text style={styles.timeLabel}>CHECK OUT</Text>
          <Text style={styles.timeValue}>{record.checkOutTime || '--:--'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.gridCol}>
          <Text style={styles.timeLabel}>DURATION</Text>
          <Text style={styles.timeValue}>{duration}</Text>
        </View>
      </View>

      {record.note ? (
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={13} color={COLORS.slateMedium} />
          <Text style={styles.noteText}>{record.note}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textPrimary,
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
    color: COLORS.slateMuted,
  },
  dateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
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
    color: COLORS.slateMuted,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
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
    backgroundColor: COLORS.border,
  },
  timeLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.slateMedium,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.sm,
  },
  noteText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.slateDark,
  },
});
