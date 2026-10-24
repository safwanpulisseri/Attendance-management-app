import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttendanceStatus, UserRole } from '../types';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

interface StatusBadgeProps {
  status?: AttendanceStatus;
  role?: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  role,
  size = 'md',
}) => {
  if (role) {
    let bg = COLORS.roleStaffBg;
    let text = COLORS.roleStaff;
    let border = COLORS.roleStaffBorder;
    let label = 'STAFF';

    if (role === 'admin') {
      bg = COLORS.roleAdminBg;
      text = COLORS.roleAdmin;
      border = COLORS.roleAdminBorder;
      label = 'ADMINISTRATOR';
    } else if (role === 'senior_staff') {
      bg = COLORS.roleSeniorBg;
      text = COLORS.roleSenior;
      border = COLORS.roleSeniorBorder;
      label = 'SENIOR LEAD';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg, borderColor: border }, styles[size]]}>
        <Text style={[styles.roleText, { color: text }, styles[`text_${size}`]]}>
          {label}
        </Text>
      </View>
    );
  }

  let bg = COLORS.pendingBg;
  let text = COLORS.pendingText;
  let border = COLORS.pendingBorder;
  let label = 'Not Checked In';
  let dotColor = COLORS.pendingDot;

  if (status === 'checked_in') {
    bg = COLORS.checkedInBg;
    text = COLORS.checkedInText;
    border = COLORS.checkedInBorder;
    label = 'Checked In';
    dotColor = COLORS.checkedInDot;
  } else if (status === 'checked_out') {
    bg = COLORS.checkedOutBg;
    text = COLORS.checkedOutText;
    border = COLORS.checkedOutBorder;
    label = 'Completed';
    dotColor = COLORS.checkedOutDot;
  }

  return (
    <View
      style={[
        styles.badge,
        styles.statusBadge,
        { backgroundColor: bg, borderColor: border },
        styles[size],
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.statusText, { color: text }, styles[`text_${size}`]]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  statusBadge: {},
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  roleText: {
    fontFamily: FONTS.bold,
    letterSpacing: 0.8,
  },
  statusText: {
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.2,
  },
  sm: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  md: {
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  lg: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  text_sm: {
    fontSize: 10,
  },
  text_md: {
    fontSize: 11,
  },
  text_lg: {
    fontSize: 12,
  },
});
