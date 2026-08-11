import { orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export type TOrderBurgerState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderBurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'constructorSlice/createOrder',
  async (ingredients) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

export const constructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    addBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.bun = action.payload;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },

    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const ingredients = [...state.constructorItems.ingredients];
      const [movedItem] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, movedItem);
      state.constructorItems.ingredients = ingredients;
    },

    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },

    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
