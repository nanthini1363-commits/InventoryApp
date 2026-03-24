import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { selectAllProducts } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../styles/theme';

const ScanScreen = ({ navigation }) => {
  const insets    = useSafeAreaInsets();
  const dispatch  = useDispatch();
  const products  = useSelector(selectAllProducts);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned]           = useState(false);
  const [lastCode, setLastCode]         = useState(null);
  const [mode, setMode]                 = useState('info'); // 'info' | 'billing'

  // Animated scan line
  const scanAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scanLineTranslate = scanAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [-90, 90],
  });

  if (!permission) return <View style={styles.screen} />;

  if (!permission.granted) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Ionicons name="camera-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permMsg}>
          Please grant camera permission to scan barcodes and QR codes.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setLastCode(data);

    const product = products.find((p) => p.barcode === data);

    if (!product) {
      Alert.alert(
        'Unknown Barcode',
        `No product found for barcode:\n"${data}"\n\nWould you like to add a new product with this barcode?`,
        [
          {
            text: 'Add Product',
            onPress: () =>
              navigation.navigate('AddProduct', {
                product: { barcode: data },
              }),
          },
          {
            text: 'Scan Again',
            style: 'cancel',
            onPress: () => setScanned(false),
          },
        ]
      );
      return;
    }

    if (mode === 'billing') {
      if (product.quantity <= 0) {
        Alert.alert(
          'Out of Stock',
          `"${product.name}" has no stock remaining.`,
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
        return;
      }
      dispatch(addToCart({
        productId: product.id,
        name:      product.name,
        price:     product.price,
        barcode:   product.barcode,
      }));
      Alert.alert(
        '✓ Added to Cart',
        `${product.name}\n₹${product.price}`,
        [
          { text: 'Continue Scanning', onPress: () => setScanned(false) },
          {
            text: 'View Cart',
            onPress: () => navigation.navigate('Billing'),
          },
        ]
      );
    } else {
      // Info mode: show product details
      Alert.alert(
        product.name,
        `Price:    ₹${product.price}\nIn Stock: ${product.quantity}\nBarcode:  ${product.barcode}`,
        [
          { text: 'Scan Again', onPress: () => setScanned(false) },
          {
            text: 'Edit Product',
            onPress: () =>
              navigation.navigate('AddProduct', { product }),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
        }}
      />

      {/* Dark overlay with cutout effect */}
      <View style={styles.overlay}>
        {/* Top dark panel */}
        <View style={styles.overlayPanel} />

        {/* Middle row: side panels + viewfinder */}
        <View style={styles.middleRow}>
          <View style={styles.overlayPanel} />
          <View style={styles.viewfinder}>
            {/* Corner marks */}
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            {/* Animated scan line */}
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: scanLineTranslate }] },
              ]}
            />
          </View>
          <View style={styles.overlayPanel} />
        </View>

        {/* Bottom dark panel */}
        <View style={[styles.overlayPanel, styles.bottomPanel]}>
          <Text style={styles.scanHint}>
            {scanned ? 'Processing…' : 'Align barcode or QR code within the frame'}
          </Text>

          {/* Mode toggle */}
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'info' && styles.modeBtnActive]}
              onPress={() => { setMode('info'); setScanned(false); }}
            >
              <Ionicons name="information-circle-outline" size={16} color={mode === 'info' ? COLORS.bgDark : COLORS.textPrimary} />
              <Text style={[styles.modeBtnText, mode === 'info' && styles.modeBtnTextActive]}>
                Product Info
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'billing' && styles.modeBtnActive]}
              onPress={() => { setMode('billing'); setScanned(false); }}
            >
              <Ionicons name="cart-outline" size={16} color={mode === 'billing' ? COLORS.bgDark : COLORS.textPrimary} />
              <Text style={[styles.modeBtnText, mode === 'billing' && styles.modeBtnTextActive]}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>

          {scanned && (
            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={() => setScanned(false)}
            >
              <Ionicons name="refresh" size={16} color={COLORS.bgDark} />
              <Text style={styles.rescanText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Top nav bar */}
      <View style={[styles.topNav, { top: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.navBtn}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Scanner</Text>
        <View style={{ width: 40 }} />
      </View>
    </View>
  );
};

const VIEWFINDER = 220;
const CORNER     = 20;
const CORNER_W   = 3;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.bgDark,
  },
  permTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  permMsg: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecond,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  permBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    marginTop: SPACING.lg,
  },
  permBtnText: {
    color: COLORS.bgDark,
    fontWeight: '700',
    fontSize: FONT_SIZE.base,
  },
  overlay: {
    flex: 1,
  },
  overlayPanel: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: VIEWFINDER,
  },
  viewfinder: {
    width: VIEWFINDER,
    height: VIEWFINDER,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: COLORS.accent,
  },
  tl: { top: 0, left: 0, borderTopWidth: CORNER_W, borderLeftWidth: CORNER_W },
  tr: { top: 0, right: 0, borderTopWidth: CORNER_W, borderRightWidth: CORNER_W },
  bl: { bottom: 0, left: 0, borderBottomWidth: CORNER_W, borderLeftWidth: CORNER_W },
  br: { bottom: 0, right: 0, borderBottomWidth: CORNER_W, borderRightWidth: CORNER_W },
  scanLine: {
    width: '90%',
    height: 2,
    backgroundColor: COLORS.accent,
    alignSelf: 'center',
    opacity: 0.8,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  bottomPanel: {
    flex: 0,
    height: 200,
    alignItems: 'center',
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  scanHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.full,
    padding: 3,
    gap: 3,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
  },
  modeBtnActive: {
    backgroundColor: COLORS.accent,
  },
  modeBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modeBtnTextActive: {
    color: COLORS.bgDark,
  },
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
  },
  rescanText: {
    color: COLORS.bgDark,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  topNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  navBtn: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RADIUS.full,
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  navTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ScanScreen;
