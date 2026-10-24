export const COLORS = {
  // Brand & Accents
  primary: '#4F46E5', // Indigo 600
  primaryDark: '#4338CA',
  primaryLight: '#EEF2FF',
  secondary: '#0EA5E9', // Sky 500
  secondaryLight: '#E0F2FE',
  accent: '#8B5CF6', // Purple 500

  // Neutral Backgrounds & Surfaces
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  card: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  border: '#E2E8F0', // Slate 200
  borderDark: '#CBD5E1',

  // Typography
  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8', // Slate 400
  textInverse: '#FFFFFF',

  // Status Indicators
  success: '#10B981', // Emerald 500
  successBg: '#ECFDF5',
  successBorder: '#A7F3D0',
  successText: '#065F46',

  warning: '#F59E0B', // Amber 500
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
  warningText: '#92400E',

  danger: '#EF4444', // Red 500
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerText: '#991B1B',

  info: '#3B82F6', // Blue 500
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',
  infoText: '#1E40AF',

  // Role Badge Colors
  roleAdmin: '#7C3AED',
  roleAdminBg: '#F3E8FF',
  roleSenior: '#2563EB',
  roleSeniorBg: '#DBEAFE',
  roleStaff: '#0D9488',
  roleStaffBg: '#CCFBF1',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
};
