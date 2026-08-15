import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  closeOrderModal as closeOrderModalAction,
  createOrder
} from '../../services/slices/constructorSlice';
import { fetchFeed } from '../../services/slices/feedSlice';
import { fetchOrders } from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(
    (store) => store.burgerConstructor.constructorItems
  );

  const orderRequest = useSelector(
    (store) => store.burgerConstructor.orderRequest
  );

  const orderModalData = useSelector(
    (store) => store.burgerConstructor.orderModalData
  );

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const ingredientsIDs = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientsIDs))
      .unwrap()
      .then(() => {
        dispatch(fetchFeed());
        dispatch(fetchOrders());
      })
      .catch(() => undefined);
  };
  const closeOrderModal = () => {
    dispatch(closeOrderModalAction());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
