import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';

/**
 * Reusable Button component.
 *
 * Props:
 *  title      – button label
 *  onPress    – press handler
 *  variant    – 'primary' | 'secondary' | 'danger' | 'ghost'
 *  size       – 'sm' | 'md' | 'lg'
 *  loading    – show spinner
 *  disabled   – disable interaction
 *  icon       – optional icon element rendered left of the label
 *  style      – extra container style
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyle    = SIZES[size]    || SIZES.md;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.textColor} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.text, variantStyle.text, sizeStyle.text]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const VARIANTS = {
  primary: {
    container: { backgroundColor: COLORS.accent },
    text:      { color: COLORS.bgDark },
    textColor: COLORS.bgDark,
  },
  secondary: {
    container: { backgroundColor: COLORS.bgLight, borderWidth: 1, borderColor: COLORS.border },
    text:      { color: COLORS.textPrimary },
    textColor: COLORS.textPrimary,
  },
  danger: {
    container: { backgroundColor: COLORS.danger },
    text:      { color: COLORS.white },
    textColor: COLORS.white,
  },
  ghost: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.accent },
    text:      { color: COLORS.accent },
    textColor: COLORS.accent,
  },
};

const SIZES = {
  sm: {
    container: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm },
    text:      { fontSize: FONT_SIZE.sm },
  },
  md: {
    container: { paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.md },
    text:      { fontSize: FONT_SIZE.base },
  },
  lg: {
    container: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
    text:      { fontSize: FONT_SIZE.md },
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: 6,
  },
});

export default Button;
