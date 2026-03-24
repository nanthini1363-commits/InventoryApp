import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer     from './slices/cartSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart:     cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allow Date objects in state
    }),
});

export default store;
