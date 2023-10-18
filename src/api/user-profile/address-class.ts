import { Customer } from '@commercetools/platform-sdk';
import { MessageInstance } from 'antd/es/message/interface';
import { apiRoot } from '../api-root';

export class DefaultAddressCalls {
  user: Customer;
  messageApi: MessageInstance;
  error: string;

  constructor(user: Customer, messageApi: MessageInstance) {
    this.user = user;
    this.messageApi = messageApi;
    this.error = '';
  }

  async addNameAddressId(name: string, addressId: string, defaultAddress: boolean) {
    const action = name === 'shippiing' ? 'addShippingAddressId' : 'addBillingAddressId';

    await apiRoot
      .customers()
      .withId({ ID: this.user.id })
      .post({
        body: {
          version: this.user.version,
          actions: [
            {
              action: action,
              addressId: addressId,
            },
          ],
        },
      })
      .execute()
      .then(async (response) => {
        this.user = response.body;
        if (defaultAddress) {
          await this.addDefaultAddress(name, addressId);
        }
      })
      .catch((error) => {
        this.error = error.message;
        this.showMessage();
      });
  }

  async addDefaultAddress(name: string, addressId: string | undefined) {
    const action = name === 'shipping' ? 'setDefaultShippingAddress' : 'setDefaultBillingAddress';
    await apiRoot
      .customers()
      .withId({ ID: this.user.id })
      .post({
        body: {
          version: this.user.version,
          actions: [
            {
              action: action,
              addressId: addressId,
            },
          ],
        },
      })
      .execute()
      .then((response) => {
        this.user = response.body;
      })
      .catch((error) => {
        this.error = error.message;
        this.showMessage();
      });
  }

  getUser() {
    return this.user;
  }

  hasError() {
    return !!this.error;
  }

  showMessage() {
    this.messageApi.destroy();
    if (this.error) {
      this.messageApi.error(this.error);
    } else {
      this.messageApi.success('Успешно!');
    }
  }
}
