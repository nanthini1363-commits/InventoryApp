import { createSlice } from '@reduxjs/toolkit';

/**
 * Product shape:
 * {
 *   id: string,
 *   name: string,
 *   price: number,
 *   quantity: number,
 *   barcode: string,   // unique barcode / QR value
 *   createdAt: string, // ISO date string
 * }
 */

const initialState = {
  items: [],       // Product[]
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Replace the entire list (used when loading from AsyncStorage)
    setProducts(state, action) {
      state.items = action.payload;
    },

    addProduct(state, action) {
      state.items.push(action.payload);
    },

    updateProduct(state, action) {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },

    deleteProduct(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },

    // Decrease quantity after a successful billing purchase
    decreaseProductQuantity(state, action) {
      const { productId, amount } = action.payload;
      const product = state.items.find((p) => p.id === productId);
      if (product) {
        product.quantity = Math.max(0, product.quantity - amount);
      }
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  decreaseProductQuantity,
  setLoading,
  setError,
} = productsSlice.actions;

// ── Selectors ────────────────────────────────
export const selectAllProducts     = (state) => state.products.items;
export const selectProductById     = (id) => (state) =>
  state.products.items.find((p) => p.id === id);
export const selectProductByBarcode = (barcode) => (state) =>
  state.products.items.find((p) => p.barcode === barcode);
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError   = (state) => state.products.error;

export default productsSlice.reducer;
