import { MessageInstance } from 'antd/es/message/interface';
import { processRequests } from './process-requests';
import { UserDataInterface } from '../../constants/user-interface';
import { createExistingFlow } from './existing-flow/api-root-existing-flow';

interface Checkboxes {
  isSimilarAddress: boolean;
  isDefaultShippingAddress: boolean;
  isDefaultBillingAddress: boolean;
}

interface Address {
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
}

interface CustomerDraft {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  addresses: Address[];
  shippingAddresses: number[];
  billingAddresses: number[];
  dateOfBirth: string;
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
}

const messageError = 'Аккаунт с данной почтой уже существует!';

export const createCustomer = (data: UserDataInterface, messageApi: MessageInstance, checkboxes: Checkboxes) => {
  const addresses = [
    {
      streetName: data.streetShipping,
      postalCode: data.postCodeShipping,
      city: data.cityShipping,
      country: 'KZ',
    },
  ];

  if (!checkboxes.isSimilarAddress) {
    addresses.push({
      streetName: data.streetBilling,
      postalCode: data.postCodeBilling,
      city: data.cityBilling,
      country: 'KZ',
    });
  }

  const shippingAddressIndex = 0;

  const customerData: CustomerDraft = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    addresses: addresses,
    shippingAddresses: [shippingAddressIndex],
    billingAddresses: checkboxes.isSimilarAddress ? [0] : [1],
    dateOfBirth: data.dateOfBirth,
  };

  if (checkboxes.isDefaultShippingAddress) {
    customerData.defaultShippingAddress = shippingAddressIndex;
  }

  if (checkboxes.isDefaultBillingAddress) {
    customerData.defaultBillingAddress = checkboxes.isSimilarAddress ? 0 : 1;
  }

  const customer = createExistingFlow()
    .me()
    .signup()
    .post({
      body: { ...customerData },
    })
    .execute();
  processRequests(customer, messageApi, { username: data.email, password: data.password }, messageError);

  return customer;
};
