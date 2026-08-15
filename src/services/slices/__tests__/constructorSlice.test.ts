import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import {
  addBun,
  addIngredient,
  clearConstructor,
  closeOrderModal,
  constructorReducer,
  createOrder,
  moveIngredient,
  removeIngredient,
  TOrderBurgerState
} from '../constructorSlice';

const mockBun: TIngredient = {
  _id: 'bun-id',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const mockMain: TIngredient = {
  _id: 'main-id',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 11,
  fat: 21,
  carbohydrates: 31,
  calories: 41,
  price: 200,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const firstIngredient: TConstructorIngredient = {
  ...mockMain,
  id: 'first-ingredient'
};

const secondIngredient: TConstructorIngredient = {
  ...mockMain,
  _id: 'second-main-id',
  name: 'Вторая начинка',
  id: 'second-ingredient'
};

const constructorBun: TConstructorIngredient = {
  ...mockBun,
  id: 'constructor-bun'
};

const mockOrder: TOrder = {
  _id: 'order-id',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2026-08-15T00:00:00.000Z',
  updatedAt: '2026-08-15T00:00:00.000Z',
  number: 12345,
  ingredients: [mockBun._id, mockMain._id, mockBun._id]
};

const filledState = (): TOrderBurgerState => ({
  constructorItems: {
    bun: constructorBun,
    ingredients: [firstIngredient, secondIngredient]
  },
  orderRequest: false,
  orderModalData: null
});

describe('constructorReducer', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null
    });
  });

  test('добавляет булку', () => {
    const state = constructorReducer(undefined, addBun(mockBun));

    expect(state.constructorItems.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
  });

  test('добавляет начинку', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));

    expect(state.constructorItems.ingredients).toEqual([
      {
        ...mockMain,
        id: expect.any(String)
      }
    ]);
  });

  test('удаляет начинку', () => {
    const state = constructorReducer(
      filledState(),
      removeIngredient(firstIngredient.id)
    );

    expect(state.constructorItems.ingredients).toEqual([secondIngredient]);
  });

  test('меняет порядок начинок', () => {
    const state = constructorReducer(
      filledState(),
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.constructorItems.ingredients).toEqual([
      secondIngredient,
      firstIngredient
    ]);
  });

  test('очищает конструктор', () => {
    const state = constructorReducer(filledState(), clearConstructor());

    expect(state.constructorItems).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('закрывает модальное окно заказа', () => {
    const initialState = filledState();
    initialState.orderModalData = mockOrder;

    const state = constructorReducer(initialState, closeOrderModal());

    expect(state.orderModalData).toBeNull();
  });

  test('обрабатывает createOrder.pending', () => {
    const state = constructorReducer(
      filledState(),
      createOrder.pending('request-id', mockOrder.ingredients)
    );

    expect(state.orderRequest).toBe(true);
  });

  test('обрабатывает createOrder.fulfilled', () => {
    const state = constructorReducer(
      filledState(),
      createOrder.fulfilled(mockOrder, 'request-id', mockOrder.ingredients)
    );

    expect(state).toEqual({
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: mockOrder
    });
  });

  test('обрабатывает createOrder.rejected', () => {
    const initialState = filledState();
    initialState.orderRequest = true;

    const state = constructorReducer(
      initialState,
      createOrder.rejected(
        new Error('Ошибка создания заказа'),
        'request-id',
        mockOrder.ingredients
      )
    );

    expect(state.orderRequest).toBe(false);
  });
});
