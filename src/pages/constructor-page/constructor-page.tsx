import { FC } from 'react';
import { ConstructorPageUI } from '@ui-pages';
import { useSelector } from '../../services/store';

export const ConstructorPage: FC = () => {
  const { isLoading, error } = useSelector((state) => state.ingredients);

  if (error) {
    return <p className='text text_type_main-medium mt-10'>{error}</p>;
  }

  return <ConstructorPageUI isIngredientsLoading={isLoading} />;
};
