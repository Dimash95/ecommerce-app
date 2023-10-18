import { Customer } from '@commercetools/platform-sdk';
import { MessageInstance } from 'antd/es/message/interface';
import { apiRoot } from '../api-root';
import { DefaultAddressCalls } from './address-class';

interface Body {
  addressName: string;
  streetName: string;
  postalCode: string;
  city: string;
  default: boolean;
}

export class AddressAddition extends DefaultAddressCalls {
  error: string;

  constructor(user: Customer, messageApi: MessageInstance) {
    super(user, messageApi);
    this.error = '';
  }

  async addAddress(body: Body) {
    await apiRoot
      .customers()
      .withId({ ID: this.user.id })
      .post({
        body: {
          version: this.user.version,
          actions: [
            {
              action: 'addAddress',
              address: {
                country: 'KZ',
                streetName: body.streetName,
                postalCode: body.postalCode,
                city: body.city,
              },
            },
          ],
        },
      })
      .execute()
      .then(async (response) => {
        this.user = response.body;
        const addressId = this.user.addresses.at(-1)?.id;
        await this.addNameAddressId(body.addressName, addressId as string, body.default);
      })
      .catch((error) => {
        this.error = error.message;
        this.showMessage();
      });
  }
}
