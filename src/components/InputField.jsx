import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';

/**
 * Reusable labelled input field.
 *
 * Props:
 *  label        – field label
 *  value        – controlled value
 *  onChangeText – change handler
 *  error        – error string
 *  placeholder  – placeholder text
 *  keyboardType – TextInput keyboardType
 *  ...rest      – any other TextInput props
 */
const InputField = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType = 'default',
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType}
        style={[
          styles.input,
          focused && styles.focused,
          error  && styles.errored,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecond,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.bgLight,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  focused: {
    borderColor: COLORS.accent,
  },
  errored: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
});

export default InputField;
