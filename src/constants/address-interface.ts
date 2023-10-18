import { Address, CustomFields } from '@commercetools/platform-sdk';

export interface ExtendedAddress extends Address {
  [key: string]: string | undefined | CustomFields;
}
