import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { AttendanceCard } from '../components/AttendanceCard';
import { formatDisplayDate, getCurrentTimeString, getTodayDateString } from '../utils/dateUtils';
import { AttendanceStatus } from '../types';

interface StaffDashboardScreenProps {
  navigation: any;
}

export const StaffDashboardScreen: React.FC<StaffDashboardScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { checkIn, checkOut, getTodayRecord, getUserRecords } = useAttendance();

  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const todayStr = getTodayDateString();
  const todayRecord = getTodayRecord(currentUser.id);
  const userRecentHistory = getUserRecords(currentUser.id).slice(0, 3);

  const status: AttendanceStatus = todayRecord
    ? todayRecord.status
    : 'not_checked_in';

  const handleCheckIn = async () => {
    setActionLoading(true);
    setFeedbackMessage(null);
    const res = await checkIn(currentUser.id);
    setActionLoading(false);

    if (res.success) {
      setFeedbackMessage({ text: res.message, type: 'success' });
    } else {
      setFeedbackMessage({ text: res.message, type: 'error' });
      Alert.alert('Action Restricted', res.message);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setFeedbackMessage(null);
    const res = await checkOut(currentUser.id);
    setActionLoading(false);

    if (res.success) {
      setFeedbackMessage({ text: res.message, type: 'success' });
    } else {
      setFeedbackMessage({ text: res.message, type: 'error' });
      Alert.alert('Action Restricted', res.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome & Profile Row */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{currentUser.name}</Text>
            <View style={styles.metaRow}>
              <StatusBadge role={currentUser.role} size="sm" />
              <Text style={styles.department}> • {currentUser.department}</Text>
            </View>
          </View>

          <View style={styles.avatarPill}>
            <Text style={styles.avatarText}>
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>
        </View>

        {/* Live Clock Card */}
        <View style={[styles.clockCard, SHADOWS.card]}>
          <View style={styles.clockHeader}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.dateLabel}>{formatDisplayDate(todayStr)}</Text>
          </View>

          <Text style={styles.liveClock}>{currentTime}</Text>
          <Text style={styles.clockSubtext}>Current Device System Time</Text>
        </View>

        {/* Today's Status Card */}
        <View style={[styles.statusCard, SHADOWS.card]}>
          <View style={styles.statusHeaderRow}>
            <Text style={styles.sectionTitle}>Today's Attendance</Text>
            <StatusBadge status={status} size="md" />
          </View>

          {feedbackMessage ? (
            <View
              style={[
                styles.feedbackBox,
                feedbackMessage.type === 'success'
                  ? styles.feedbackSuccess
                  : styles.feedbackError,
              ]}
            >
              <Ionicons
                name={
                  feedbackMessage.type === 'success'
                    ? 'checkmark-circle-outline'
                    : 'alert-circle-outline'
                }
                size={18}
                color={
                  feedbackMessage.type === 'success' ? COLORS.successText : COLORS.dangerText
                }
              />
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color:
                      feedbackMessage.type === 'success'
                        ? COLORS.successText
                        : COLORS.dangerText,
                  },
                ]}
              >
                {feedbackMessage.text}
              </Text>
            </View>
          ) : null}

          {/* Time Highlights */}
          <View style={styles.timeHighlightRow}>
            <View style={styles.timeBox}>
              <View style={styles.timeBoxHeader}>
                <Ionicons name="log-in" size={16} color={COLORS.success} />
                <Text style={styles.timeBoxTitle}>Check-In Time</Text>
              </View>
              <Text style={styles.timeBoxValue}>
                {todayRecord?.checkInTime || '--:--:--'}
              </Text>
            </View>

            <View style={styles.timeBox}>
              <View style={styles.timeBoxHeader}>
                <Ionicons name="log-out" size={16} color={COLORS.secondary} />
                <Text style={styles.timeBoxTitle}>Check-Out Time</Text>
              </View>
              <Text style={styles.timeBoxValue}>
                {todayRecord?.checkOutTime || '--:--:--'}
              </Text>
            </View>
          </View>

          {/* Primary Action Button (Check-In or Check-Out or Completed) */}
          <View style={styles.actionContainer}>
            {status === 'not_checked_in' && (
              <Button
                title="Check In Now"
                onPress={handleCheckIn}
                variant="success"
                size="lg"
                icon="finger-print-outline"
                loading={actionLoading}
                fullWidth
              />
            )}

            {status === 'checked_in' && (
              <Button
                title="Check Out Now"
                onPress={handleCheckOut}
                variant="primary"
                size="lg"
                icon="log-out-outline"
                loading={actionLoading}
                fullWidth
              />
            )}

            {status === 'checked_out' && (
              <View style={styles.completedNotice}>
                <Ionicons name="checkmark-done-circle" size={24} color={COLORS.success} />
                <View style={styles.completedTextWrap}>
                  <Text style={styles.completedTitle}>Attendance Completed Today</Text>
                  <Text style={styles.completedSub}>
                    You have successfully checked in and checked out for today.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Attendance History Quick Link & Recent Preview */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Recent Attendance</Text>
            <TouchableOpacity
              onPress={() => {
                // Navigate to History tab or screen
                navigation.navigate('History');
              }}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>View All History</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {userRecentHistory.length === 0 ? (
            <Text style={styles.noHistoryText}>No attendance records found yet.</Text>
          ) : (
            userRecentHistory.map((rec) => (
              <AttendanceCard key={rec.id} record={rec} showUserInfo={false} />
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  greeting: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  department: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  avatarPill: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  clockCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  liveClock: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    marginVertical: 4,
  },
  clockSubtext: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    gap: 8,
  },
  feedbackSuccess: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
    borderWidth: 1,
  },
  feedbackError: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerBorder,
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  timeHighlightRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  timeBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  timeBoxTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  timeBoxValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  actionContainer: {
    marginTop: SPACING.xs,
  },
  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    gap: 12,
  },
  completedTextWrap: {
    flex: 1,
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.successText,
  },
  completedSub: {
    fontSize: 12,
    color: COLORS.successText,
    opacity: 0.85,
    marginTop: 2,
  },
  historySection: {
    marginTop: SPACING.xs,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noHistoryText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
});
