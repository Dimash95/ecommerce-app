import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { Customer } from '@commercetools/platform-sdk';
import { Switch, Tooltip, message } from 'antd';
import InputAddressBlock from './input-address-block';
import NewAddress from './components/new-address';
import { createAddressesArray } from './create-addresses-array';
import { deleteAddressWithId } from '../../../../api/user-profile/delete-address';
import { createErrorMessage } from '../../../../utils/create-error-message';

import style from '../info-block.module.scss';
import { AddressModification } from '../../../../api/user-profile/addres-modification';

const primaryAddress = {
  addressName: '',
  city: '',
  streetName: '',
  postalCode: '',
};

export const returnPrimaryAddressArray = (length: number) => {
  return Array.from({ length: length }, () => ({ ...primaryAddress }));
};

const AddressInfoBlock = ({ user, setUser }: { user: Customer; setUser: Dispatch<SetStateAction<object>> }) => {
  const [addresses, setAddresses] = useState(createAddressesArray(user));
  const [previousAddresses, setPreviousAddresses] = useState(createAddressesArray(user));
  const [errors, setErrors] = useState(returnPrimaryAddressArray(addresses.length));
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const showDrawer = () => {
    setOpen(true);
  };

  const cancelEdit = () => {
    const returnedPreviousAddresses = previousAddresses.map((prevousAddress) => ({
      ...prevousAddress,
      address: { ...prevousAddress.address },
    }));

    setAddresses(returnedPreviousAddresses);
    setErrors(returnPrimaryAddressArray(addresses.length));
    setIsEdit(false);
  };

  const startEdit = () => {
    const newPreviousAddresses = addresses.map((newPrevousAddress) => ({
      ...newPrevousAddress,
      address: { ...newPrevousAddress.address },
    }));

    setPreviousAddresses(newPreviousAddresses);
    setIsEdit(true);
  };

  const changeCheckbox = (checked: boolean, index: number, addressName: string) => {
    const updatedAddresses = [...addresses].map((address) => {
      if (address.addressName === addressName) {
        address.defaultAddress = false;
      }
      return address;
    });

    updatedAddresses[index] = { ...updatedAddresses[index], defaultAddress: checked };
    setAddresses(updatedAddresses);
  };

  const changeAddresses = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const indexAttribute = event.target.getAttribute('data-address-index');
    const index = indexAttribute ? +indexAttribute : 0;

    const updatedAddresses = [...addresses];
    const updatedAddressItem = { ...updatedAddresses[index] };
    updatedAddressItem.address[name] = value;
    updatedAddresses[index] = updatedAddressItem;
    setAddresses(updatedAddresses);

    const errorMessage = createErrorMessage(name, value);
    const updatedErrorArray = [...errors];
    updatedErrorArray[index] = { ...updatedErrorArray[index], [name]: errorMessage };
    setErrors(updatedErrorArray);
  };

  const sumbitAddresses = async () => {
    const isAllErrorsFieldsEmpty = errors.every((address) => Object.values(address).every((value) => value === ''));
    if (!isAllErrorsFieldsEmpty) {
      return messageApi.error('Испрвьте все поля перед отправкой!');
    }

    setIsEdit(false);
    messageApi.open({ type: 'loading', content: 'Загрузка, ожидайте...', duration: 0 });
    const address = new AddressModification(user, messageApi, addresses);
    await address.changeAddress();

    if (!address.hasError()) {
      messageApi.destroy();
      const newUser = address.getUser();
      setAddresses(createAddressesArray(newUser));
      setUser(newUser);
      messageApi.success('Успешно');
    }
  };

  const deleteAddress = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    const addressData = {
      userId: user.id,
      version: user.version,
      messageApi: messageApi,
      addressId: id,
    };
    messageApi.loading('Загрузка...');

    const newUser = await deleteAddressWithId(addressData);
    if (newUser instanceof Object) {
      const indexPreviousAddress = previousAddresses.findIndex((element) => element.address.id === id);
      previousAddresses.splice(indexPreviousAddress, 1);

      const newAddress = createAddressesArray(newUser);
      setUser(newUser);
      setAddresses(newAddress);
      setErrors(returnPrimaryAddressArray(newAddress.length));
    }
  };

  return (
    <div className={isEdit ? style.edit : style.nonEdit}>
      <div className={style.titleBlock}>
        <h2 className={style.title}>Адресная информация</h2>
        <button
          className={classNames('button', style.editButton)}
          onClick={startEdit}
          style={isEdit ? { display: 'none' } : {}}
        >
          Изменить
        </button>
        <div className={style.buttons} style={isEdit ? {} : { display: 'none' }}>
          <button className={classNames('button', style.editButton, style.cancelButton)} onClick={cancelEdit}>
            Отмена
          </button>
          <button className={classNames('button', style.editButton, style.saveButton)} onClick={sumbitAddresses}>
            Сохранить
          </button>
        </div>
      </div>
      <hr className={style.hr} />
      <div className={classNames(style.mainBlock, style.mainAddressBlock)}>
        {addresses.map((address, addressIndex) => {
          const title = address.addressName === 'shipping' ? 'Шиппинг адрес' : 'Биллинг адрес';
          const id = address.address.id;
          const mainAddress = address.address;
          return (
            <div className={classNames(style.addressBlock)} key={id}>
              <h3>{title}</h3>
              <InputAddressBlock
                value={mainAddress.city}
                name="city"
                id="user-city"
                labelText="Город"
                isEdit={isEdit}
                errors={errors[addressIndex]}
                addressIndex={addressIndex}
                onChange={changeAddresses}
              />
              <InputAddressBlock
                value={mainAddress.streetName}
                name="streetName"
                id="user-street"
                labelText="Улица"
                isEdit={isEdit}
                errors={errors[addressIndex]}
                addressIndex={addressIndex}
                onChange={changeAddresses}
              />
              <InputAddressBlock
                value={mainAddress.postalCode}
                name="postalCode"
                id="user-post"
                labelText="Индекс"
                isEdit={isEdit}
                errors={errors[addressIndex]}
                addressIndex={addressIndex}
                onChange={changeAddresses}
              />
              <div className={style.switchBlock}>
                <label htmlFor="user-default">Установлен по умолчанию?</label>
                <Switch
                  id="user-default"
                  disabled={!isEdit}
                  checked={address.defaultAddress}
                  onChange={(checked) => changeCheckbox(checked, addressIndex, address.addressName)}
                />
              </div>
              <div style={isEdit ? {} : { display: 'none' }}>
                <Tooltip title="Удаление без возможности отмены" color={'red'}>
                  <button
                    className={classNames('button', style.editButton, style.deleteButton)}
                    id={id}
                    onClick={deleteAddress}
                  >
                    {contextHolder}
                    Удалить
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
      {isEdit ? (
        <button className={classNames('button', style.editButton, style.addButton)} onClick={showDrawer}>
          Добавить адрес
        </button>
      ) : (
        ''
      )}
      <NewAddress
        open={open}
        isEdit={isEdit}
        setOpen={setOpen}
        setAddresses={setAddresses}
        setUser={setUser}
        user={user}
        setErrorsFromParent={setErrors}
        setPreviousAddresses={setPreviousAddresses}
      />
    </div>
  );
};

export default AddressInfoBlock;
