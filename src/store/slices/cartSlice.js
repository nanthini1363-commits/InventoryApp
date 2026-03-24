import { createSlice } from '@reduxjs/toolkit';

/**
 * Cart item shape:
 * {
 *   productId: string,
 *   name: string,
 *   price: number,
 *   quantity: number,   // quantity in cart
 *   barcode: string,
 * }
 */

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, name, price, barcode } = action.payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ productId, name, price, barcode, quantity: 1 });
      }
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },

    incrementCartItem(state, action) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) item.quantity += 1;
    },

    decrementCartItem(state, action) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload);
        }
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementCartItem,
  decrementCartItem,
  clearCart,
} = cartSlice.actions;

// ── Selectors ────────────────────────────────
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
