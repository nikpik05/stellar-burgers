import path from 'path';
import { expect, Page, test } from '@playwright/test';

const BUN_ID = '643d69a5c3f7b9001cfa093c';
const MAIN_ID = '643d69a5c3f7b9001cfa0941';
const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = 12345;
const API_HAR = path.join(__dirname, 'hars', 'api.har');

const addIngredient = async (page: Page, ingredientId: string) => {
  await page
    .getByTestId(`ingredient-${ingredientId}`)
    .getByRole('button', { name: 'Добавить' })
    .click();
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(API_HAR, {
      url: 'https://norma.education-services.ru/api/**',
      notFound: 'abort'
    });
  });

  test('добавляет булку и начинку в конструктор', async ({ page }) => {
    await page.goto('/');

    await addIngredient(page, BUN_ID);
    await addIngredient(page, MAIN_ID);

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
    await expect(constructor.getByText(MAIN_NAME)).toBeVisible();
  });

  test('открывает модальное окно выбранного ингредиента и закрывает его', async ({
    page
  }) => {
    await page.goto('/');

    const ingredient = page.getByTestId(`ingredient-${BUN_ID}`);
    await ingredient.getByRole('link').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByText(BUN_NAME, { exact: true })).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();

    await ingredient.getByRole('link').click();
    await expect(modal).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(modal).not.toBeVisible();
  });

  test('создаёт заказ, показывает его номер, очищает конструктор и закрывает модальное окно', async ({
    page
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token; path=/';
    });
    await page.goto('/');

    await addIngredient(page, BUN_ID);
    await addIngredient(page, MAIN_ID);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toContainText(ORDER_NUMBER.toString());

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });
});
