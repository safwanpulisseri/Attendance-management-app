import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { ThemeToggle } from '../components/ThemeToggle';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const fillDemoAccount = async (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMessage('');
    setLoading(true);
    await login(roleEmail, rolePass);
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with Theme Toggle */}
          <View style={styles.topUtilityRow}>
            <ThemeToggle />
            <View style={{ flex: 1 }} />
          </View>

          {/* Executive Brand Header */}
          <View style={styles.header}>
            <View style={[styles.brandBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.brandDot, { backgroundColor: colors.primaryAccent }]} />
              <Text style={[styles.brandBadgeText, { color: colors.slateMedium }]}>ENTERPRISE WORKFORCE</Text>
            </View>

            <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>CADENCE</Text>
            <Text style={[styles.brandSubtitle, { color: colors.slateMedium }]}>
              Attendance & Shift Management System
            </Text>
          </View>

          {/* Login Card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.card]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Identity Sign In</Text>
            <Text style={[styles.cardSubtitle, { color: colors.slateMuted }]}>
              Authenticate using your organization credentials
            </Text>

            {errorMessage ? (
              <View style={[styles.errorBox, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={[styles.errorBannerText, { color: colors.dangerText }]}>{errorMessage}</Text>
              </View>
            ) : null}

            <Input
              label="Work Email"
              placeholder="e.g. admin@test.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail-outline"
            />

            <Input
              label="Password"
              placeholder="Enter your security password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              isPassword
              leftIcon="lock-closed-outline"
            />

            <Button
              title="Sign In to Workspace"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              size="lg"
              style={styles.loginBtn}
            />
          </View>

          {/* Quick Demo Login Section for Assessors */}
          <View style={styles.demoSection}>
            <View style={styles.demoDividerRow}>
              <View style={[styles.demoLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.demoDividerText, { color: colors.slateMuted }]}>ONE-TAP EVALUATOR PROFILES</Text>
              <View style={[styles.demoLine, { backgroundColor: colors.border }]} />
            </View>

            <Text style={[styles.demoHint, { color: colors.slateMedium }]}>
              Tap below to pre-fill test credentials directly:
            </Text>

            <View style={styles.demoCardsContainer}>
              {/* Admin Pill */}
              <TouchableOpacity
                style={[styles.demoPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.75}
                onPress={() => fillDemoAccount('admin@test.com', 'Admin@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="admin" size="sm" />
                  <Text style={[styles.demoRoleMeta, { color: colors.slateMuted }]}>Full Privileges</Text>
                </View>
                <Text style={[styles.demoEmail, { color: colors.textPrimary }]}>admin@test.com</Text>
                <Text style={[styles.demoPass, { color: colors.slateMedium }]}>PW: Admin@123</Text>
              </TouchableOpacity>

              {/* Senior Staff Pill */}
              <TouchableOpacity
                style={[styles.demoPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.75}
                onPress={() => fillDemoAccount('senior@test.com', 'Senior@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="senior_staff" size="sm" />
                  <Text style={[styles.demoRoleMeta, { color: colors.slateMuted }]}>Staff Monitor</Text>
                </View>
                <Text style={[styles.demoEmail, { color: colors.textPrimary }]}>senior@test.com</Text>
                <Text style={[styles.demoPass, { color: colors.slateMedium }]}>PW: Senior@123</Text>
              </TouchableOpacity>

              {/* Staff Pill */}
              <TouchableOpacity
                style={[styles.demoPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.75}
                onPress={() => fillDemoAccount('staff@test.com', 'Staff@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="staff" size="sm" />
                  <Text style={[styles.demoRoleMeta, { color: colors.slateMuted }]}>Individual Access</Text>
                </View>
                <Text style={[styles.demoEmail, { color: colors.textPrimary }]}>staff@test.com</Text>
                <Text style={[styles.demoPass, { color: colors.slateMedium }]}>PW: Staff@123</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  topUtilityRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.xs,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.xs,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  brandBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 0.9,
  },
  brandTitle: {
    fontSize: 26,
    fontFamily: FONTS.extraBold,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.lg,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  loginBtn: {
    marginTop: SPACING.sm,
  },
  demoSection: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  demoDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  demoLine: {
    flex: 1,
    height: 1,
  },
  demoDividerText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    marginHorizontal: SPACING.md,
    letterSpacing: 1,
  },
  demoHint: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  demoCardsContainer: {
    gap: SPACING.sm,
  },
  demoPill: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', userSelect: 'none' } as any) : {}),
  },
  demoPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  demoRoleMeta: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  demoEmail: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  demoPass: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
});
