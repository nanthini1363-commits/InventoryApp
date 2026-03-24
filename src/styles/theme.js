import { StyleSheet } from 'react-native';

export const COLORS = {
  bgDark:      '#0F172A',
  bgSurface:   '#1E293B',
  bgLight:     '#334155',
  textPrimary: '#F1F5F9',
  textSecond:  '#94A3B8',
  textMuted:   '#64748B',
  accent:      '#38BDF8',
  accentDark:  '#0284C7',
  success:     '#22C55E',
  warning:     '#F59E0B',
  danger:      '#EF4444',
  purple:      '#A855F7',
  border:      '#334155',
  white:       '#FFFFFF',
};

export const FONT_SIZE = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  xxl:  30,
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const RADIUS = {
  sm:   6,
  md:   12,
  lg:   18,
  full: 9999,
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecond,
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.bgLight,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputFocused: {
    borderColor: COLORS.accent,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    fontSize: FONT_SIZE.base,
    marginTop: SPACING.xl,
  },
});
