import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PRODUCTS: 'inv_app_products',
};

// ── Products ─────────────────────────────────

export const loadProducts = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('[StorageService] loadProducts error:', error);
    return [];
  }
};

export const saveProducts = async (products) => {
  try {
    await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error('[StorageService] saveProducts error:', error);
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (error) {
    console.error('[StorageService] clearAllData error:', error);
  }
};
