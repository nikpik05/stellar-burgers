import { TIngredient } from '@utils-types';
import { fetchIngredients, ingredientsReducer } from '../ingredientsSlice';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-id',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'image.png',
    image_large: 'image-large.png',
    image_mobile: 'image-mobile.png'
  }
];

describe('ingredientsReducer', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: false, error: 'Предыдущая ошибка' },
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: true, error: null },
      fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
    );

    expect(state).toEqual({
      items: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: true, error: null },
      fetchIngredients.rejected(
        new Error('Ошибка загрузки ингредиентов'),
        'request-id',
        undefined
      )
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
