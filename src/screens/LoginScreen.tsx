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
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
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

  const fillDemoAccount = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Executive Brand Header */}
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <View style={styles.brandDot} />
              <Text style={styles.brandBadgeText}>ENTERPRISE WORKFORCE</Text>
            </View>

            <Text style={styles.brandTitle}>CADENCE</Text>
            <Text style={styles.brandSubtitle}>
              Attendance & Shift Management System
            </Text>
          </View>

          {/* Login Card */}
          <View style={[styles.card, SHADOWS.card]}>
            <Text style={styles.cardTitle}>Identity Sign In</Text>
            <Text style={styles.cardSubtitle}>
              Authenticate using your organization credentials
            </Text>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
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
              <View style={styles.demoLine} />
              <Text style={styles.demoDividerText}>ONE-TAP EVALUATOR PROFILES</Text>
              <View style={styles.demoLine} />
            </View>

            <Text style={styles.demoHint}>
              Tap below to pre-fill test credentials directly:
            </Text>

            <View style={styles.demoCardsContainer}>
              {/* Admin Pill */}
              <TouchableOpacity
                style={styles.demoPill}
                activeOpacity={0.75}
                onPress={() => fillDemoAccount('admin@test.com', 'Admin@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="admin" size="sm" />
                  <Text style={styles.demoRoleMeta}>Full Privileges</Text>
                </View>
                <Text style={styles.demoEmail}>admin@test.com</Text>
                <Text style={styles.demoPass}>PW: Admin@123</Text>
              </TouchableOpacity>

              {/* Senior Staff Pill */}
              <TouchableOpacity
                style={styles.demoPill}
                activeOpacity={0.75}
                onPress={() => fillDemoAccount('senior@test.com', 'Senior@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="senior_staff" size="sm" />
                  <Text style={styles.demoRoleMeta}>Staff Monitor</Text>
                </View>
                <Text style={styles.demoEmail}>senior@test.com</Text>
                <Text style={styles.demoPass}>PW: Senior@123</Text>
              </TouchableOpacity>

              {/* Staff Pill */}
              <TouchableOpacity
                style={styles.demoPill}
                activeOpacity={0.75}
                onPress={() => fillDemoAccount('staff@test.com', 'Staff@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="staff" size="sm" />
                  <Text style={styles.demoRoleMeta}>Individual Access</Text>
                </View>
                <Text style={styles.demoEmail}>staff@test.com</Text>
                <Text style={styles.demoPass}>PW: Staff@123</Text>
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
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryAccent,
  },
  brandBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.slateMedium,
    letterSpacing: 0.9,
  },
  brandTitle: {
    fontSize: 26,
    fontFamily: FONTS.extraBold,
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.slateMedium,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMuted,
    marginBottom: SPACING.lg,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerBorder,
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
    color: COLORS.dangerText,
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
    backgroundColor: COLORS.border,
  },
  demoDividerText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.slateMuted,
    marginHorizontal: SPACING.md,
    letterSpacing: 1,
  },
  demoHint: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.slateMedium,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  demoCardsContainer: {
    gap: SPACING.sm,
  },
  demoPill: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.slateMuted,
  },
  demoEmail: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  demoPass: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: COLORS.slateMedium,
    marginTop: 2,
  },
});
