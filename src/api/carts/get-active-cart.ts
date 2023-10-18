import { LocalStorageNames } from '../../constants/local-storage-names';
import { setLocalStorageItem } from '../../utils/local-storage';
import { createExistingFlow } from '../auth/existing-flow/api-root-existing-flow';

export const getActiveCart = async () => {
  return createExistingFlow()
    .me()
    .activeCart()
    .get()
    .execute()
    .then(({ body }) => {
      setLocalStorageItem(LocalStorageNames.cartId, body.id);
      return body;
    });
};

export const getTotalQuantityFromCart = async () => {
  const cart = await getActiveCart();
  return cart.totalLineItemQuantity;
};
