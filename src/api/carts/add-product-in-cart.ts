import { getLocalStorageItem } from '../../utils/local-storage';
import { LocalStorageNames } from '../../constants/local-storage-names';
import { createExistingFlow } from '../auth/existing-flow/api-root-existing-flow';

export const addProductInCart = async (productId: string) => {
  const cartId = getLocalStorageItem(LocalStorageNames.cartId);
  const cart = await createExistingFlow()
    .carts()
    .withId({ ID: cartId })
    .get()
    .execute()
    .then(({ body }) => body);

  return await createExistingFlow()
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cart.version,
        actions: [
          {
            action: 'setCountry',
            country: 'KZ',
          },
          {
            action: 'addLineItem',
            productId: productId,
            variantId: 1,
            quantity: 1,
          },
        ],
      },
    })
    .execute();
};
