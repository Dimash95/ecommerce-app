import React from 'react';
import type { MessageInstance } from 'antd/es/message/interface';
import { loginCustomer } from './login';
import { createCustomer } from './registration';
import { UserDataInterface } from '../../constants/user-interface';

interface Checkboxes {
  isSimilarAddress: boolean;
  isDefaultShippingAddress: boolean;
  isDefaultBillingAddress: boolean;
}

export const submitCustomer = (
  e: React.MouseEvent<HTMLButtonElement>,
  formData: UserDataInterface | { email: string; password: string },
  errors: UserDataInterface | { email: string; password: string },
  messageApi: MessageInstance,
  checkboxes?: Checkboxes
) => {
  e.preventDefault();

  const isAllFieldsFull = Object.values(formData).every((field) => field.trim() !== '');
  const isErrorMessageEmpty = Object.values(errors).every((field) => field.trim() === '');

  if (!isAllFieldsFull) {
    messageApi.open({
      type: 'error',
      content: 'Необходимо заполнить все поля перед отправкой!',
    });
  }
  if (!isErrorMessageEmpty) {
    messageApi.open({
      type: 'error',
      content: 'Необходимо исправить все поля перед отправкой!',
    });
  }
  if (isAllFieldsFull && isErrorMessageEmpty) {
    messageApi.open({
      type: 'loading',
      content: 'Загрузка...',
      duration: 0,
    });

    if (checkboxes) {
      return createCustomer(formData as UserDataInterface, messageApi, checkboxes);
    } else {
      return loginCustomer(formData, messageApi);
    }
  }
};
