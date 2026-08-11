import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { feedReducer } from './slices/feedSlice';
import { orderReducer } from './slices/orderSlice';
import { constructorReducer } from './slices/constructorSlice';
import { userReducer } from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: orderReducer,
  burgerConstructor: constructorReducer,
  user: userReducer
});
