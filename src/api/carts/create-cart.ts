import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { setLocalStorageItem } from '../../utils/local-storage';
import { LocalStorageNames } from '../../constants/local-storage-names';

export const createCart = async (apiRoot: ByProjectKeyRequestBuilder) => {
  const body = {
    currency: 'KZT',
  };
  apiRoot
    .me()
    .carts()
    .post({ body: body })
    .execute()
    .then(({ body }) => {
      setLocalStorageItem(LocalStorageNames.cartId, body.id);
    });
};
