export const FONTS = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const COLORS = {
  // Bespoke Executive Charcoal & Titanium Palette
  obsidian: '#090D16',
  charcoal: '#111827',
  slateDark: '#1E293B',
  slateMedium: '#475569',
  slateLight: '#64748B',
  slateMuted: '#94A3B8',

  // Clean Minimal Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceHover: '#EAEEF4',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Primary Action Accent
  primary: '#0F172A', // Obsidian Black for primary actions
  primaryContrast: '#FFFFFF',
  primaryAccent: '#2563EB', // Precision Royal Blue
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
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
};
