import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import {
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
} from '../store/slices/cartSlice';
import { formatCurrency, truncate } from '../utils/helpers';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';

/**
 * A single row in the billing cart.
 *
 * Props:
 *  item – cart item { productId, name, price, quantity, barcode }
 */
const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {truncate(item.name, 20)}
        </Text>
        <Text style={styles.price}>{formatCurrency(item.price)} each</Text>
      </View>

      {/* Quantity stepper */}
      <View style={styles.stepper}>
        <TouchableOpacity
          onPress={() => dispatch(decrementCartItem(item.productId))}
          style={styles.stepBtn}
        >
          <Ionicons name="remove" size={14} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => dispatch(incrementCartItem(item.productId))}
          style={styles.stepBtn}
        >
          <Ionicons name="add" size={14} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Sub-total */}
      <Text style={styles.subTotal}>
        {formatCurrency(item.price * item.quantity)}
      </Text>

      {/* Remove */}
      <TouchableOpacity
        onPress={() => dispatch(removeFromCart(item.productId))}
        style={styles.removeBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close-circle" size={18} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.xs,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  price: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgLight,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.sm,
  },
  stepBtn: {
    padding: 6,
  },
  qty: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  subTotal: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.accent,
    minWidth: 60,
    textAlign: 'right',
  },
  removeBtn: {
    marginLeft: SPACING.xs,
  },
});

export default CartItem;
