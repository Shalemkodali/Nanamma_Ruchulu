import { configureStore } from '@reduxjs/toolkit';
import productListReducer from './slices/productListSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    productList: productListReducer,
    cart: cartReducer,
    user: userReducer,
  },
});

export default store;

