import { getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TOrdersState = {
  isLoading: boolean;
  orders: TOrder[];
  orderDetails: TOrder | null;
  error: string | null;
};

const initialState: TOrdersState = {
  isLoading: false,
  orders: [],
  orderDetails: null,
  error: null
};

export const fetchOrders = createAsyncThunk(
  'ordersSlice/fetchOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (orderNumber: number) => await getOrderByNumberApi(orderNumber)
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });

    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderDetails = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.orders[0] || null;
        if (!state.orderDetails) {
          state.error = 'Заказ не найден';
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось получить заказ';
      });
  }
});

export const orderReducer = ordersSlice.reducer;
