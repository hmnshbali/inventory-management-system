import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
});

// Save to localStorage on state changes
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('inventory-state', JSON.stringify(state.products));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;