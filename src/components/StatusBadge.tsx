import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttendanceStatus, UserRole } from '../types';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

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
    let label = 'Staff';

    if (role === 'admin') {
      bg = COLORS.roleAdminBg;
      text = COLORS.roleAdmin;
      label = 'Admin';
    } else if (role === 'senior_staff') {
      bg = COLORS.roleSeniorBg;
      text = COLORS.roleSenior;
      label = 'Senior Staff';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg }, styles[size]]}>
        <Text style={[styles.text, { color: text }, styles[`text_${size}`]]}>
          {label}
        </Text>
      </View>
    );
  }

  let bg = COLORS.warningBg;
  let text = COLORS.warningText;
  let border = COLORS.warningBorder;
  let label = 'Not Checked In';
  let dotColor = COLORS.warning;

  if (status === 'checked_in') {
    bg = COLORS.successBg;
    text = COLORS.successText;
    border = COLORS.successBorder;
    label = 'Checked In';
    dotColor = COLORS.success;
  } else if (status === 'checked_out') {
    bg = COLORS.infoBg;
    text = COLORS.infoText;
    border = COLORS.infoBorder;
    label = 'Checked Out';
    dotColor = COLORS.info;
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
      <Text style={[styles.text, { color: text }, styles[`text_${size}`]]}>
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
  },
  statusBadge: {
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  lg: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  text_sm: {
    fontSize: 11,
  },
  text_md: {
    fontSize: 12,
  },
  text_lg: {
    fontSize: 13,
  },
});
