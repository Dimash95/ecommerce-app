import { MessageInstance } from 'antd/es/message/interface';
import { apiRoot } from '../api-root';

interface RemoveAddressArguments {
  userId: string;
  version: number;
  messageApi: MessageInstance;
  addressId: string;
}

export const deleteAddressWithId = async ({ userId, version, messageApi, addressId }: RemoveAddressArguments) => {
  return apiRoot
    .customers()
    .withId({ ID: userId })
    .post({
      body: {
        version: version,
        actions: [
          {
            action: 'removeAddress',
            addressId: addressId,
          },
        ],
      },
    })
    .execute()
    .then((body) => {
      messageApi.destroy();
      messageApi.success('Успешно!');
      return body.body;
    })
    .catch((error) => {
      messageApi.destroy();
      messageApi.error(error.message);
    });
};
