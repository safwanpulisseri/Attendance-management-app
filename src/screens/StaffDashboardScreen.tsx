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
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
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
        {/* Executive Profile Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>WORKSPACE SESSION</Text>
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

        {/* Live Precision Clock Telemetry Card */}
        <View style={[styles.clockCard, SHADOWS.card]}>
          <View style={styles.clockHeader}>
            <Ionicons name="time-outline" size={14} color={COLORS.slateMedium} />
            <Text style={styles.dateLabel}>{formatDisplayDate(todayStr).toUpperCase()}</Text>
          </View>

          <Text style={styles.liveClock}>{currentTime}</Text>
          <Text style={styles.clockSubtext}>Precision Device Timestamp</Text>
        </View>

        {/* Today's Shift Status Card */}
        <View style={[styles.statusCard, SHADOWS.card]}>
          <View style={styles.statusHeaderRow}>
            <View>
              <Text style={styles.sectionOverline}>CURRENT CYCLE</Text>
              <Text style={styles.sectionTitle}>Today's Attendance</Text>
            </View>
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
                size={16}
                color={
                  feedbackMessage.type === 'success' ? COLORS.checkedInText : COLORS.dangerText
                }
              />
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color:
                      feedbackMessage.type === 'success'
                        ? COLORS.checkedInText
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
              <Text style={styles.timeBoxLabel}>ARRIVAL TIME</Text>
              <Text style={styles.timeBoxValue}>
                {todayRecord?.checkInTime || '--:--:--'}
              </Text>
            </View>

            <View style={styles.timeBox}>
              <Text style={styles.timeBoxLabel}>DEPARTURE TIME</Text>
              <Text style={styles.timeBoxValue}>
                {todayRecord?.checkOutTime || '--:--:--'}
              </Text>
            </View>
          </View>

          {/* Primary Action Button */}
          <View style={styles.actionContainer}>
            {status === 'not_checked_in' && (
              <Button
                title="Record Arrival (Check In)"
                onPress={handleCheckIn}
                variant="primary"
                size="lg"
                icon="log-in-outline"
                loading={actionLoading}
                fullWidth
              />
            )}

            {status === 'checked_in' && (
              <Button
                title="Record Departure (Check Out)"
                onPress={handleCheckOut}
                variant="secondary"
                size="lg"
                icon="log-out-outline"
                loading={actionLoading}
                fullWidth
              />
            )}

            {status === 'checked_out' && (
              <View style={styles.completedNotice}>
                <Ionicons name="checkmark-done" size={20} color={COLORS.checkedInText} />
                <View style={styles.completedTextWrap}>
                  <Text style={styles.completedTitle}>Shift Completed</Text>
                  <Text style={styles.completedSub}>
                    Attendance logged for today. No further actions required.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Recent Attendance Preview */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Recent Logs</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('History');
              }}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>Full History</Text>
              <Ionicons name="chevron-forward" size={13} color={COLORS.primary} />
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
    maxWidth: 580,
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
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.slateMuted,
    letterSpacing: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  department: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMedium,
  },
  avatarPill: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  clockCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
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
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.slateMedium,
    letterSpacing: 0.8,
  },
  liveClock: {
    fontSize: 30,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
    letterSpacing: 1,
    marginVertical: 4,
  },
  clockSubtext: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
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
  sectionOverline: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.slateMuted,
    letterSpacing: 0.9,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    gap: 8,
  },
  feedbackSuccess: {
    backgroundColor: COLORS.checkedInBg,
    borderColor: COLORS.checkedInBorder,
    borderWidth: 1,
  },
  feedbackError: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerBorder,
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    flex: 1,
  },
  timeHighlightRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  timeBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeBoxLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.slateMedium,
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  timeBoxValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  actionContainer: {
    marginTop: SPACING.xs,
  },
  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.checkedInBg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.checkedInBorder,
    gap: 12,
  },
  completedTextWrap: {
    flex: 1,
  },
  completedTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.checkedInText,
  },
  completedSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.checkedInText,
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
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  noHistoryText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
});
