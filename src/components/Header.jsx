import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../styles/theme';

/**
 * App header with optional back button and right action slot.
 *
 * Props:
 *  title         – screen title
 *  onBack        – show back button when provided
 *  rightElement  – optional JSX rendered on the right
 */
const Header = ({ title, onBack, rightElement }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <View style={styles.inner}>
        {/* Left: back button or spacer */}
        <View style={styles.side}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="chevron-back" size={22} color={COLORS.accent} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Center: title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Right slot */}
        <View style={[styles.side, styles.right]}>
          {rightElement || null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 40,
  },
  right: {
    alignItems: 'flex-end',
  },
  backBtn: {
    padding: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
});

export default Header;
