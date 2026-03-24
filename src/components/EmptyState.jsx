import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, FONT_SIZE, SPACING } from '../styles/theme';

/**
 * Centered empty-state placeholder.
 *
 * Props:
 *  icon    – Ionicons name
 *  title   – heading
 *  message – subtext
 */
const EmptyState = ({ icon = 'cube-outline', title = 'Nothing here', message }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={64} color={COLORS.textMuted} />
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textSecond,
    marginTop: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
    lineHeight: 20,
  },
});

export default EmptyState;
