import { Customer } from '@commercetools/platform-sdk';
import { ExtendedAddress } from '../../../../constants/address-interface';

export const createAddressesArray = (user: Customer) => {
  if (Object.keys(user).length === 0) {
    return [];
  }
  const { addresses, shippingAddressIds, billingAddressIds, defaultShippingAddressId, defaultBillingAddressId } = user;

  const addressesWithShippingBillingIds = addresses.map((address) => {
    const addressItem = {
      addressName: '',
      address: address as ExtendedAddress,
      defaultAddress: false,
    };

    switch (address.id) {
      case shippingAddressIds?.find((element) => element === address.id):
        addressItem['addressName'] = 'shipping';
        break;
      case billingAddressIds?.find((element) => element === address.id):
        addressItem['addressName'] = 'billing';
        break;
      default:
        break;
    }

    switch (address.id) {
      case defaultShippingAddressId:
      case defaultBillingAddressId:
        addressItem['defaultAddress'] = true;
        break;
      default:
        break;
    }

    return addressItem;
  });

  return addressesWithShippingBillingIds;
};
