import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, selectAllProducts } from '../store/slices/productsSlice';
import { saveProducts } from '../services/storageService';
import { formatCurrency, truncate } from '../utils/helpers';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';

/**
 * Card representing a single product in the inventory list.
 *
 * Props:
 *  product  – product object
 *  onEdit   – callback(product) to open edit form
 */
const ProductCard = ({ product, onEdit }) => {
  const dispatch  = useDispatch();
  const allItems  = useSelector(selectAllProducts);

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Remove "${product.name}" from inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            dispatch(deleteProduct(product.id));
            const updated = allItems.filter((p) => p.id !== product.id);
            await saveProducts(updated);
          },
        },
      ]
    );
  };

  const stockColor =
    product.quantity === 0
      ? COLORS.danger
      : product.quantity < 5
      ? COLORS.warning
      : COLORS.success;

  return (
    <View style={styles.card}>
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: stockColor }]} />

      <View style={styles.body}>
        {/* Name & barcode */}
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {truncate(product.name, 22)}
          </Text>
          <View style={styles.badge}>
            <Ionicons name="barcode-outline" size={11} color={COLORS.textMuted} />
            <Text style={styles.badgeText}>{product.barcode}</Text>
          </View>
        </View>

        {/* Price & qty */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>PRICE</Text>
            <Text style={styles.statValue}>{formatCurrency(product.price)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>IN STOCK</Text>
            <Text style={[styles.statValue, { color: stockColor }]}>
              {product.quantity}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(product)}
          style={[styles.iconBtn, { backgroundColor: COLORS.bgLight }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="pencil-outline" size={16} color={COLORS.accent} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.iconBtn, { backgroundColor: COLORS.bgLight, marginTop: 6 }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 3,
    fontFamily: 'monospace',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  stat: {},
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  actions: {
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
    justifyContent: 'center',
  },
  iconBtn: {
    borderRadius: RADIUS.sm,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductCard;
