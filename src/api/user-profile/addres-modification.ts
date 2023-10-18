import { Address, Customer } from '@commercetools/platform-sdk';
import { MessageInstance } from 'antd/es/message/interface';
import { apiRoot } from '../api-root';
import { DefaultAddressCalls } from './address-class';

interface AddressObject {
  addressName: string;
  address: Address;
  defaultAddress: boolean;
}

export class AddressModification extends DefaultAddressCalls {
  addressArray: AddressObject[];

  constructor(user: Customer, messageApi: MessageInstance, addressArray: AddressObject[]) {
    super(user, messageApi);
    this.addressArray = addressArray;
  }

  async changeAddress() {
    for (const addressObject of this.addressArray) {
      await apiRoot
        .customers()
        .withId({ ID: this.user.id })
        .post({
          body: {
            version: this.user.version,
            actions: [
              {
                action: 'changeAddress',
                addressId: addressObject.address.id,
                address: {
                  country: 'KZ',
                  streetName: addressObject.address.streetName,
                  postalCode: addressObject.address.postalCode,
                  city: addressObject.address.city,
                },
              },
            ],
          },
        })
        .execute()
        .then(async (result) => {
          this.user = result.body;
          await this.addNameAddressId(
            addressObject.addressName,
            addressObject.address.id as string,
            addressObject.defaultAddress
          );
          await this.deleteDefaultAddress();
        })
        .catch((error) => {
          this.error = error.message;
          this.showMessage();
        });
    }
  }

  async deleteDefaultAddress() {
    const defaultAddressesCheck = this.checkHasDefaultAddress();
    if (!defaultAddressesCheck.billing) {
      await this.addDefaultAddress('billing', undefined);
    }
    if (!defaultAddressesCheck.shipping) {
      await this.addDefaultAddress('shipping', undefined);
    }
  }

  checkHasDefaultAddress() {
    return this.addressArray.reduce(
      (defaultAddressesCheck, address) => {
        if (address.defaultAddress) {
          if (address.addressName === 'shipping') {
            defaultAddressesCheck.shipping = true;
          }
          if (address.addressName === 'billing') {
            defaultAddressesCheck.billing = true;
          }
        }

        return defaultAddressesCheck;
      },
      {
        shipping: false,
        billing: false,
      }
    );
  }
}
