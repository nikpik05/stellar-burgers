import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientState = {
  items: [],
  isLoading: true,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })

      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Что-то пошло не так';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
