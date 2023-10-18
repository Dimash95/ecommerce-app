import { ClientResponse, CustomerSignInResult } from '@commercetools/platform-sdk';
import type { MessageInstance } from 'antd/es/message/interface';
import { deleteLocalStorageItem, setLocalStorageItem } from '../../utils/local-storage';
import { LocalStorageNames } from '../../constants/local-storage-names';
import { createPasswordFlow } from './password-flow/api-root-password';

enum Errors {
  'invalidCredentials' = 400,
  'invalidToken' = 401,
}

export const processRequests = (
  customer: Promise<ClientResponse<CustomerSignInResult>>,
  messageApi: MessageInstance,
  data: { username: string; password: string },
  messageApiContent: string
) => {
  customer
    .then(({ body }) => {
      deleteLocalStorageItem(LocalStorageNames.tokenData);
      deleteLocalStorageItem(LocalStorageNames.flow);
      setLocalStorageItem(LocalStorageNames.customerId, body.customer.id);
      createPasswordFlow(data).get().execute();
    })
    .catch((error) => {
      messageApi.destroy();

      switch (error.status) {
        case Errors.invalidCredentials:
          messageApi.error(messageApiContent);
          break;
        case Errors.invalidToken:
          messageApi.error('Невалидный токен');
          break;
        default:
          messageApi.error(error.status);
          break;
      }
    });
};
