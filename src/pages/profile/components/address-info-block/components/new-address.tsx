import { Drawer, Select, Space, Switch, message } from 'antd';
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { Customer } from '@commercetools/platform-sdk';
import { createAddressesArray } from '../create-addresses-array';
import { AddressAddition } from '../../../../../api/user-profile/address-addition';
import { createErrorMessage } from '../../../../../utils/create-error-message';
import InputAddressBlock from '../input-address-block';

import style from '../../info-block.module.scss';
import { ExtendedAddress } from '../../../../../constants/address-interface';
import { returnPrimaryAddressArray } from '../address-info-block';

interface NewAddressProps {
  open: boolean;
  isEdit: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAddresses: React.Dispatch<
    React.SetStateAction<
      {
        addressName: string;
        address: ExtendedAddress;
        defaultAddress: boolean;
      }[]
    >
  >;
  setErrorsFromParent: React.Dispatch<
    React.SetStateAction<{ addressName: string; city: string; streetName: string; postalCode: string }[]>
  >;
  user: Customer;
  setUser: Dispatch<SetStateAction<object>>;
  setPreviousAddresses: React.Dispatch<
    React.SetStateAction<
      {
        addressName: string;
        address: ExtendedAddress;
        defaultAddress: boolean;
      }[]
    >
  >;
}

const primaryAddress = {
  addressName: '',
  city: '',
  streetName: '',
  postalCode: '',
};

const primaryNewAddress = { ...primaryAddress, addressName: 'shipping', default: false };

const NewAddress = ({
  open,
  isEdit,
  user,
  setOpen,
  setUser,
  setAddresses,
  setErrorsFromParent,
  setPreviousAddresses,
}: NewAddressProps) => {
  const [errors, setErrors] = useState(primaryAddress);
  const [newAddress, setNewAddress] = useState(primaryNewAddress);
  const [messageApi, contextHolder] = message.useMessage();

  const onClose = () => {
    setOpen(false);
  };

  const changeNewAddressName = (value: string) => {
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      addressName: value,
    }));
  };

  const changeIsDefaultAddress = (checked: boolean) => {
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      default: checked,
    }));
  };

  const changeAddedAddressData = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAddress((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const error = createErrorMessage(name, value);
    setErrors((errors) => ({
      ...errors,
      [name]: error,
    }));
  };

  const submitNewAddress = async () => {
    const isErrorsEmpty = Object.values(errors).every((field) => field.trim() === '');
    const hasEmptyField = newAddress.city === '' || newAddress.streetName === '' || newAddress.postalCode === '';
    if (!isErrorsEmpty) {
      return messageApi.error('Исправьте все ошибки перед отправкой!');
    }
    if (hasEmptyField) {
      return messageApi.error('Заполните все поля перед отправкой!');
    }

    messageApi.loading('Пожалуйста, подождите...');

    const address = new AddressAddition(user, message);
    await address.addAddress(newAddress);

    if (!address.hasError()) {
      const newUser = address.getUser();
      const newAddresses = createAddressesArray(newUser);
      setAddresses(newAddresses);
      setUser(newUser);
      setOpen(false);
      setNewAddress(primaryNewAddress);
      setErrorsFromParent(returnPrimaryAddressArray(newAddresses.length));

      const newPreviousAddresses = newAddresses.map((newPrevousAddress) => ({
        ...newPrevousAddress,
        address: { ...newPrevousAddress.address },
      }));

      setPreviousAddresses(newPreviousAddresses);
    }
  };
  return (
    <Drawer
      title="Добавить новый адрес"
      width={720}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <button className={classNames('button', style.editButton, style.cancelButton)} onClick={onClose}>
            Отмена
          </button>
          {contextHolder}
          <button className={classNames('button', style.editButton, style.saveButton)} onClick={submitNewAddress}>
            Сохранить
          </button>
        </Space>
      }
    >
      <Select
        defaultValue="shipping"
        className={style.select}
        size={'large'}
        onChange={changeNewAddressName}
        options={[
          { value: 'shipping', label: 'Шиппинг' },
          { value: 'billing', label: 'Биллинг' },
        ]}
      />
      <InputAddressBlock
        value={newAddress.city}
        id="user-city"
        labelText="Город"
        isEdit={isEdit}
        name="city"
        onChange={changeAddedAddressData}
        errors={errors}
      />
      <InputAddressBlock
        value={newAddress.streetName}
        id="user-street"
        labelText="Улица"
        isEdit={isEdit}
        name="streetName"
        onChange={changeAddedAddressData}
        errors={errors}
      />
      <InputAddressBlock
        value={newAddress.postalCode}
        id="user-post"
        labelText="Индекс"
        isEdit={isEdit}
        name="postalCode"
        onChange={changeAddedAddressData}
        errors={errors}
      />
      <Space style={{ marginTop: '15px' }}>
        <label htmlFor="user-default">Установить по умолчанию?</label>
        <Switch id="user-default" checked={newAddress.default} onChange={changeIsDefaultAddress} />
      </Space>
    </Drawer>
  );
};

export default NewAddress;
