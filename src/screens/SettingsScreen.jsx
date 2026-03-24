import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { selectAllProducts, setProducts } from '../store/slices/productsSlice';
import { clearCart } from '../store/slices/cartSlice';
import { clearAllData } from '../services/storageService';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';

const SettingsScreen = () => {
  const dispatch  = useDispatch();
  const insets    = useSafeAreaInsets();
  const products  = useSelector(selectAllProducts);
  const [haptics, setHaptics] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Reset All Data',
      `This will permanently delete all ${products.length} products and clear the cart. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            dispatch(setProducts([]));
            dispatch(clearCart());
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xl }}
    >
      {/* Header */}
      <View style={[styles.pageHeader, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageSubtitle}>App preferences & data management</Text>
      </View>

      {/* App info */}
      <Section title="About">
        <InfoRow icon="cube" label="App Name" value="Inventory Manager" />
        <InfoRow icon="code-slash" label="Version" value="1.0.0" />
        <InfoRow icon="business" label="Built for" value="Novaloid Assessment" />
        <InfoRow icon="layers" label="Products in DB" value={String(products.length)} />
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconWrap, { backgroundColor: COLORS.purple + '22' }]}>
              <Ionicons name="phone-portrait" size={16} color={COLORS.purple} />
            </View>
            <View>
              <Text style={styles.rowLabel}>Haptic Feedback</Text>
              <Text style={styles.rowSub}>Vibrate on scan events</Text>
            </View>
          </View>
          <Switch
            value={haptics}
            onValueChange={setHaptics}
            trackColor={{ false: COLORS.bgLight, true: COLORS.accent + '66' }}
            thumbColor={haptics ? COLORS.accent : COLORS.textMuted}
          />
        </View>
      </Section>

      {/* Tech Stack */}
      <Section title="Tech Stack">
        <TechRow name="React Native (Expo)" color={COLORS.accent} icon="logo-react" />
        <TechRow name="NativeWind (Tailwind CSS)" color="#06B6D4" icon="color-palette" />
        <TechRow name="Redux Toolkit" color={COLORS.purple} icon="layers" />
        <TechRow name="AsyncStorage" color={COLORS.success} icon="server" />
        <TechRow name="Expo Camera" color={COLORS.warning} icon="camera" />
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone">
        <TouchableOpacity style={styles.dangerBtn} onPress={handleClearData}>
          <Ionicons name="trash" size={18} color={COLORS.danger} />
          <Text style={styles.dangerText}>Reset All Data</Text>
        </TouchableOpacity>
      </Section>
    </ScrollView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <View style={[styles.iconWrap, { backgroundColor: COLORS.accent + '22' }]}>
        <Ionicons name={icon} size={16} color={COLORS.accent} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const TechRow = ({ name, color, icon }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.rowLabel}>{name}</Text>
    </View>
    <View style={[styles.dot, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  pageHeader: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  pageTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  sectionCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgLight,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  rowSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  rowValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.danger + '15',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.danger + '44',
  },
  dangerText: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.danger,
  },
});

export default SettingsScreen;
