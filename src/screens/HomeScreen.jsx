import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  selectAllProducts,
  setProducts,
} from '../store/slices/productsSlice';
import { selectCartItemCount } from '../store/slices/cartSlice';
import { loadProducts } from '../services/storageService';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';
import { formatCurrency } from '../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const dispatch   = useDispatch();
  const insets     = useSafeAreaInsets();
  const products   = useSelector(selectAllProducts);
  const cartCount  = useSelector(selectCartItemCount);

  const [search, setSearch]       = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  // Load products from storage on mount
  useEffect(() => {
    (async () => {
      const stored = await loadProducts();
      dispatch(setProducts(stored));
    })();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search)
  );

  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const lowStock = products.filter((p) => p.quantity < 5).length;

  const onRefresh = async () => {
    setRefreshing(true);
    const stored = await loadProducts();
    dispatch(setProducts(stored));
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View>
      {/* ── Stats row ── */}
      <View style={styles.statsRow}>
        <StatCard
          icon="cube"
          iconColor={COLORS.accent}
          label="Products"
          value={products.length}
        />
        <StatCard
          icon="wallet"
          iconColor={COLORS.success}
          label="Total Value"
          value={formatCurrency(totalValue)}
        />
        <StatCard
          icon="warning"
          iconColor={COLORS.warning}
          label="Low Stock"
          value={lowStock}
        />
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or barcode…"
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.listHeading}>
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Inventory</Text>
          <Text style={styles.subGreeting}>Manager</Text>
        </View>
        <View style={styles.topActions}>
          {/* Cart button */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Billing')}
          >
            <Ionicons name="cart-outline" size={22} color={COLORS.textPrimary} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEdit={(p) => navigation.navigate('AddProduct', { product: p })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="cube-outline"
            title="No products yet"
            message="Tap the + button below to add your first product to the inventory."
          />
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      />

      {/* ── FAB ── */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 80 }]}
        onPress={() => navigation.navigate('AddProduct', {})}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={COLORS.bgDark} />
      </TouchableOpacity>
    </View>
  );
};

const StatCard = ({ icon, iconColor, label, value }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={20} color={iconColor} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: -0.5,
    marginTop: -6,
  },
  topActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconBtn: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
  },
  listHeading: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  fab: {
    position: 'absolute',
    right: SPACING.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});

export default HomeScreen;
