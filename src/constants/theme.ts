export type ThemeMode = 'light' | 'dark';

export const FONTS = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const LIGHT_COLORS = {
  mode: 'light' as ThemeMode,
  // Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceHover: '#EAEEF4',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Primary Action Accent
  primary: '#0F172A',
  primaryContrast: '#FFFFFF',
  primaryAccent: '#2563EB',
  primaryAccentLight: '#EFF6FF',
  primaryAccentBorder: '#BFDBFE',

  // Secondary Accents
  accentGold: '#D97706',
  accentGoldLight: '#FEF3C7',

  // Status Indicators
  checkedInBg: '#ECFDF5',
  checkedInText: '#065F46',
  checkedInBorder: '#A7F3D0',
  checkedInDot: '#10B981',

  checkedOutBg: '#F8FAFC',
  checkedOutText: '#334155',
  checkedOutBorder: '#E2E8F0',
  checkedOutDot: '#64748B',

  pendingBg: '#FFFBEB',
  pendingText: '#92400E',
  pendingBorder: '#FDE68A',
  pendingDot: '#F59E0B',

  dangerBg: '#FEF2F2',
  dangerText: '#991B1B',
  dangerBorder: '#FECACA',
  danger: '#DC2626',

  // Role Pill Styling
  roleAdmin: '#6D28D9',
  roleAdminBg: '#F5F3FF',
  roleAdminBorder: '#DDD6FE',

  roleSenior: '#1D4ED8',
  roleSeniorBg: '#EFF6FF',
  roleSeniorBorder: '#BFDBFE',

  roleStaff: '#047857',
  roleStaffBg: '#ECFDF5',
  roleStaffBorder: '#A7F3D0',

  // Semantic Typography
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Slate Scale
  slateNavy: '#0F172A',
  slateDark: '#1E293B',
  slateMedium: '#64748B',
  slateMuted: '#94A3B8',

  // Component Helpers
  success: '#059669',
  secondary: '#2563EB',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
  warningText: '#92400E',
  primaryLight: '#F1F5F9',
  primaryDark: '#090D16',
};

export const DARK_COLORS: typeof LIGHT_COLORS = {
  mode: 'dark' as ThemeMode,
  // Surfaces - Obsidian OLED Depth
  background: '#090D16',
  surface: '#111827',
  surfaceSubtle: '#182234',
  surfaceHover: '#1F2937',
  border: '#1F2937',
  borderStrong: '#374151',

  // Primary Action Accent (Contrast White for Dark Mode)
  primary: '#F9FAFB',
  primaryContrast: '#090D16',
  primaryAccent: '#3B82F6',
  primaryAccentLight: 'rgba(59, 130, 246, 0.15)',
  primaryAccentBorder: 'rgba(59, 130, 246, 0.35)',

  // Secondary Accents
  accentGold: '#F59E0B',
  accentGoldLight: 'rgba(245, 158, 11, 0.15)',

  // Status Indicators
  checkedInBg: 'rgba(6, 95, 70, 0.35)',
  checkedInText: '#34D399',
  checkedInBorder: 'rgba(52, 211, 153, 0.4)',
  checkedInDot: '#10B981',

  checkedOutBg: 'rgba(30, 41, 59, 0.7)',
  checkedOutText: '#94A3B8',
  checkedOutBorder: 'rgba(71, 85, 105, 0.4)',
  checkedOutDot: '#94A3B8',

  pendingBg: 'rgba(180, 83, 9, 0.3)',
  pendingText: '#FBBF24',
  pendingBorder: 'rgba(245, 158, 11, 0.4)',
  pendingDot: '#F59E0B',

  dangerBg: 'rgba(153, 27, 27, 0.35)',
  dangerText: '#F87171',
  dangerBorder: 'rgba(248, 113, 113, 0.4)',
  danger: '#EF4444',

  // Role Pill Styling
  roleAdmin: '#C084FC',
  roleAdminBg: 'rgba(109, 40, 217, 0.3)',
  roleAdminBorder: 'rgba(192, 132, 252, 0.4)',

  roleSenior: '#60A5FA',
  roleSeniorBg: 'rgba(29, 78, 216, 0.3)',
  roleSeniorBorder: 'rgba(96, 165, 250, 0.4)',

  roleStaff: '#34D399',
  roleStaffBg: 'rgba(4, 120, 87, 0.3)',
  roleStaffBorder: 'rgba(52, 211, 153, 0.4)',

  // Semantic Typography
  textPrimary: '#F9FAFB',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#090D16',

  // Slate Scale (Dark Mode)
  slateNavy: '#F9FAFB',
  slateDark: '#E2E8F0',
  slateMedium: '#94A3B8',
  slateMuted: '#64748B',

  // Component Helpers
  success: '#10B981',
  secondary: '#3B82F6',
  warning: '#F59E0B',
  warningBg: 'rgba(180, 83, 9, 0.3)',
  warningBorder: 'rgba(245, 158, 11, 0.4)',
  warningText: '#FBBF24',
  primaryLight: '#182234',
  primaryDark: '#F9FAFB',
};

// Default export fallback
export const COLORS = LIGHT_COLORS;

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
};
