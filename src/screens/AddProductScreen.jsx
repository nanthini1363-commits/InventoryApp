import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  addProduct,
  updateProduct,
  selectAllProducts,
} from '../store/slices/productsSlice';
import { saveProducts, loadProducts } from '../services/storageService';
import {
  generateId,
  generateBarcode,
  validateProduct,
} from '../utils/helpers';
import Header from '../components/Header';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';

const AddProductScreen = ({ navigation, route }) => {
  const dispatch  = useDispatch();
  const products  = useSelector(selectAllProducts);

  // If a product is passed via route params, we are in edit mode
  const editingProduct = route?.params?.product || null;
  const isEditing      = !!editingProduct;

  const [name,     setName]     = useState('');
  const [price,    setPrice]    = useState('');
  const [quantity, setQuantity] = useState('');
  const [barcode,  setBarcode]  = useState('');
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(String(editingProduct.price));
      setQuantity(String(editingProduct.quantity));
      setBarcode(editingProduct.barcode);
    }
  }, [editingProduct]);

  const handleGenerateBarcode = () => {
    setBarcode(generateBarcode());
  };

  const handleSave = async () => {
    const formData = { name, price, quantity, barcode };
    const { valid, errors: validationErrors } = validateProduct(
      formData,
      products,
      isEditing ? editingProduct.id : null
    );

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        const updated = {
          ...editingProduct,
          name:     name.trim(),
          price:    parseFloat(price),
          quantity: parseInt(quantity, 10),
          barcode:  barcode.trim(),
        };
        dispatch(updateProduct(updated));

        // Persist: reload current list, replace the item, save back
        const stored = await loadProducts();
        const newList = stored.map((p) =>
          p.id === updated.id ? updated : p
        );
        await saveProducts(newList);
      } else {
        const newProduct = {
          id:        generateId(),
          name:      name.trim(),
          price:     parseFloat(price),
          quantity:  parseInt(quantity, 10),
          barcode:   barcode.trim(),
          createdAt: new Date().toISOString(),
        };
        dispatch(addProduct(newProduct));

        const stored = await loadProducts();
        await saveProducts([...stored, newProduct]);
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title={isEditing ? 'Edit Product' : 'Add Product'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form card */}
        <View style={styles.card}>
          <InputField
            label="Product Name"
            value={name}
            onChangeText={(v) => { setName(v); setErrors((e) => ({ ...e, name: null })); }}
            placeholder="e.g. Samsung Galaxy S24"
            error={errors.name}
            autoCapitalize="words"
          />

          <InputField
            label="Price (₹)"
            value={price}
            onChangeText={(v) => { setPrice(v); setErrors((e) => ({ ...e, price: null })); }}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.price}
          />

          <InputField
            label="Quantity"
            value={quantity}
            onChangeText={(v) => { setQuantity(v); setErrors((e) => ({ ...e, quantity: null })); }}
            placeholder="0"
            keyboardType="number-pad"
            error={errors.quantity}
          />

          {/* Barcode row */}
          <Text style={styles.label}>BARCODE / QR VALUE</Text>
          <View style={styles.barcodeRow}>
            <InputField
              value={barcode}
              onChangeText={(v) => { setBarcode(v); setErrors((e) => ({ ...e, barcode: null })); }}
              placeholder="Enter or generate a code"
              error={errors.barcode}
              style={{ flex: 1, marginBottom: 0 }}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.genBtn}
              onPress={handleGenerateBarcode}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh" size={18} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
          {errors.barcode ? (
            <Text style={styles.errorText}>{errors.barcode}</Text>
          ) : (
            <Text style={styles.hint}>
              Tap the refresh icon to auto-generate a unique barcode.
            </Text>
          )}
        </View>

        {/* Save button */}
        <Button
          title={isEditing ? 'Save Changes' : 'Add to Inventory'}
          onPress={handleSave}
          loading={saving}
          style={styles.saveBtn}
          size="lg"
          icon={<Ionicons name={isEditing ? 'checkmark' : 'add'} size={18} color={COLORS.bgDark} />}
        />

        {isEditing && (
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="ghost"
            size="lg"
            style={{ marginTop: SPACING.sm }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecond,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  genBtn: {
    backgroundColor: COLORS.bgLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 4,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginTop: 0,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.danger,
    marginTop: 4,
  },
  saveBtn: {
    marginTop: SPACING.xs,
  },
});

export default AddProductScreen;
