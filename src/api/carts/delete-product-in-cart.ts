import { getLocalStorageItem } from '../../utils/local-storage';
import { LocalStorageNames } from '../../constants/local-storage-names';
import { createExistingFlow } from '../auth/existing-flow/api-root-existing-flow';

export const deleteProductInCart = async (lineItemId: string, quantity?: number) => {
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
            action: 'removeLineItem',
            lineItemId: lineItemId,
            quantity: quantity,
          },
        ],
      },
    })
    .execute();
};
