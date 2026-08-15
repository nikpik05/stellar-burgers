import { TOrderBurgerState } from '../../../services/slices/constructorSlice';
import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TOrderBurgerState['constructorItems'];
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
