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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';

export const LoginScreen: React.FC = () => {
  const { login, quickLogin, users } = useAuth();
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
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
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
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <Ionicons name="time" size={38} color={COLORS.primary} />
            </View>
            <Text style={styles.brandTitle}>TimeSync</Text>
            <Text style={styles.brandSubtitle}>
              Enterprise Attendance Management System
            </Text>
          </View>

          {/* Login Card */}
          <View style={[styles.card, SHADOWS.card]}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>
              Enter your credentials to access your dashboard
            </Text>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
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
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              isPassword
              leftIcon="lock-closed-outline"
            />

            <Button
              title="Sign In"
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
              <Text style={styles.demoDividerText}>DEMO TEST ACCOUNTS</Text>
              <View style={styles.demoLine} />
            </View>

            <Text style={styles.demoHint}>
              Tap any role below to pre-fill credentials instantly:
            </Text>

            <View style={styles.demoCardsContainer}>
              {/* Admin Pill */}
              <TouchableOpacity
                style={styles.demoPill}
                activeOpacity={0.7}
                onPress={() => fillDemoAccount('admin@test.com', 'Admin@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="admin" size="sm" />
                  <Ionicons name="flash-outline" size={14} color={COLORS.roleAdmin} />
                </View>
                <Text style={styles.demoEmail}>admin@test.com</Text>
                <Text style={styles.demoPass}>PW: Admin@123</Text>
              </TouchableOpacity>

              {/* Senior Staff Pill */}
              <TouchableOpacity
                style={styles.demoPill}
                activeOpacity={0.7}
                onPress={() => fillDemoAccount('senior@test.com', 'Senior@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="senior_staff" size="sm" />
                  <Ionicons name="flash-outline" size={14} color={COLORS.roleSenior} />
                </View>
                <Text style={styles.demoEmail}>senior@test.com</Text>
                <Text style={styles.demoPass}>PW: Senior@123</Text>
              </TouchableOpacity>

              {/* Staff Pill */}
              <TouchableOpacity
                style={styles.demoPill}
                activeOpacity={0.7}
                onPress={() => fillDemoAccount('staff@test.com', 'Staff@123')}
              >
                <View style={styles.demoPillHeader}>
                  <StatusBadge role="staff" size="sm" />
                  <Ionicons name="flash-outline" size={14} color={COLORS.roleStaff} />
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
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerBorder,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.dangerText,
    fontWeight: '500',
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
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginHorizontal: SPACING.md,
    letterSpacing: 0.8,
  },
  demoHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
  demoEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  demoPass: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
});
