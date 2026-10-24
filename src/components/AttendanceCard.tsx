import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AttendanceRecord } from '../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
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
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.dateText}>{formatDisplayDate(record.date)}</Text>
          </View>
        )}

        <StatusBadge status={record.status} size="sm" />
      </View>

      {/* Date Row if showUserInfo is true */}
      {showUserInfo ? (
        <View style={styles.dateSubRow}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.dateSubText}>{formatDisplayDate(record.date)}</Text>
        </View>
      ) : null}

      {/* Times Grid */}
      <View style={styles.grid}>
        <View style={styles.gridCol}>
          <View style={styles.timeLabelRow}>
            <Ionicons name="log-in-outline" size={15} color={COLORS.success} />
            <Text style={styles.timeLabel}>Check In</Text>
          </View>
          <Text style={styles.timeValue}>{record.checkInTime || '--:--'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.gridCol}>
          <View style={styles.timeLabelRow}>
            <Ionicons name="log-out-outline" size={15} color={COLORS.secondary} />
            <Text style={styles.timeLabel}>Check Out</Text>
          </View>
          <Text style={styles.timeValue}>{record.checkOutTime || '--:--'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.gridCol}>
          <View style={styles.timeLabelRow}>
            <Ionicons name="time-outline" size={15} color={COLORS.primary} />
            <Text style={styles.timeLabel}>Duration</Text>
          </View>
          <Text style={styles.timeValue}>{duration}</Text>
        </View>
      </View>

      {record.note ? (
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.noteText}>{record.note}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  userColumn: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  roleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  deptText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  dateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dateSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  dateSubText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.xs,
  },
  gridCol: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  timeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.sm,
  },
  noteText: {
    fontSize: 12,
    color: COLORS.primaryDark,
  },
});
