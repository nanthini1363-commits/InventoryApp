import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  clearCart,
} from '../store/slices/cartSlice';
import {
  selectAllProducts,
  decreaseProductQuantity,
  setProducts,
} from '../store/slices/productsSlice';
import { saveProducts, loadProducts } from '../services/storageService';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';
import { formatCurrency } from '../utils/helpers';

const BillingScreen = ({ navigation }) => {
  const dispatch   = useDispatch();
  const cartItems  = useSelector(selectCartItems);
  const cartTotal  = useSelector(selectCartTotal);
  const itemCount  = useSelector(selectCartItemCount);
  const products   = useSelector(selectAllProducts);
  const [processing, setProcessing] = useState(false);

  // Validate that cart quantities don't exceed stock
  const validateStock = () => {
    for (const cartItem of cartItems) {
      const product = products.find((p) => p.id === cartItem.productId);
      if (!product) {
        return { valid: false, message: `Product "${cartItem.name}" no longer exists.` };
      }
      if (cartItem.quantity > product.quantity) {
        return {
          valid: false,
          message: `Insufficient stock for "${product.name}".\nAvailable: ${product.quantity}, In cart: ${cartItem.quantity}`,
        };
      }
    }
    return { valid: true };
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const stockCheck = validateStock();
    if (!stockCheck.valid) {
      Alert.alert('Stock Error', stockCheck.message);
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Total: ${formatCurrency(cartTotal)}\n${itemCount} item(s)`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay',
          onPress: async () => {
            setProcessing(true);
            try {
              // Reduce stock for each cart item
              for (const cartItem of cartItems) {
                dispatch(
                  decreaseProductQuantity({
                    productId: cartItem.productId,
                    amount:    cartItem.quantity,
                  })
                );
              }

              // Persist updated quantities
              const stored = await loadProducts();
              const updatedProducts = stored.map((p) => {
                const cartItem = cartItems.find((c) => c.productId === p.id);
                if (cartItem) {
                  return { ...p, quantity: Math.max(0, p.quantity - cartItem.quantity) };
                }
                return p;
              });
              await saveProducts(updatedProducts);
              dispatch(setProducts(updatedProducts));

              dispatch(clearCart());

              Alert.alert(
                '✓ Purchase Complete',
                `Payment of ${formatCurrency(cartTotal)} received.\nInventory updated.`,
                [{ text: 'Done', onPress: () => navigation.navigate('Home') }]
              );
            } catch (err) {
              Alert.alert('Error', 'Checkout failed. Please try again.');
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from the cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearCart()) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Billing"
        onBack={() => navigation.goBack()}
        rightElement={
          cartItems.length > 0 ? (
            <TouchableOpacity onPress={handleClearCart}>
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          ) : null
        }
      />

      {cartItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="cart-outline"
            title="Cart is empty"
            message="Scan products or go to the scanner to add items to your cart."
          />
          <Button
            title="Open Scanner"
            onPress={() => navigation.navigate('Scan')}
            variant="ghost"
            style={styles.scanBtn}
            icon={<Ionicons name="scan-outline" size={18} color={COLORS.accent} />}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId}
            renderItem={({ item }) => <CartItem item={item} />}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <Text style={styles.listHeading}>
                {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
              </Text>
            }
          />

          {/* ── Summary panel ── */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(cartTotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (0%)</Text>
              <Text style={styles.summaryValue}>₹0.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(cartTotal)}</Text>
            </View>

            <Button
              title="Confirm Purchase"
              onPress={handleCheckout}
              loading={processing}
              size="lg"
              style={styles.checkoutBtn}
              icon={<Ionicons name="checkmark-circle-outline" size={20} color={COLORS.bgDark} />}
            />

            <TouchableOpacity
              style={styles.continueScan}
              onPress={() => navigation.navigate('Scan')}
            >
              <Ionicons name="scan-outline" size={16} color={COLORS.accent} />
              <Text style={styles.continueScanText}>Scan More Products</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  scanBtn: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  listHeading: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  summary: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  summaryValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecond,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.accent,
  },
  checkoutBtn: {
    marginBottom: SPACING.sm,
  },
  continueScan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
  },
  continueScanText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.accent,
    fontWeight: '600',
  },
});

export default BillingScreen;
