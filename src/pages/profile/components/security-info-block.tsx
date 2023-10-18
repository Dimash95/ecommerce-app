import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';

import style from './info-block.module.scss';
import { createErrorMessage } from '../../../utils/create-error-message';
import { message } from 'antd';
import { Customer } from '@commercetools/platform-sdk';
import { updatePassword } from '../../../api/user-profile/password-update';

const primaryData = {
  currentPassword: '',
  newPassword: '',
};

const SecurityInfoBlock = ({ user, setUser }: { user: Customer; setUser: Dispatch<SetStateAction<object>> }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState(primaryData);
  const [passwords, setPasswords] = useState(primaryData);
  const [previousPasswords, setPreviousPasswords] = useState(passwords);
  const [messageApi, contextHolder] = message.useMessage();

  const cancelEdit = () => {
    setPasswords({ ...previousPasswords });
    setErrors(primaryData);
    setIsEdit(false);
  };

  const startEditData = () => {
    setPreviousPasswords({ ...passwords });
    setIsEdit(true);
  };

  const changePasswords = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswords((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const error = createErrorMessage(name, value);
    setErrors((errors) => ({
      ...errors,
      [name]: error,
    }));
  };

  const savePasswords = async () => {
    const isErrorsEmpty = Object.values(errors).every((field) => field.trim() === '');
    const isAllFieldEmpty = Object.values(passwords).every((field) => field.trim() === '');
    if (!isErrorsEmpty) {
      return messageApi.error('Исправьте все ошибки перед отправкой!');
    }
    if (isAllFieldEmpty) {
      return messageApi.error('Заполните все поля перед отправкой!');
    }

    const body = {
      id: user.id,
      version: user.version,
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    };
    messageApi.loading('Загрузка');
    setIsEdit(false);
    const newUser = await updatePassword(body, messageApi);
    if (newUser instanceof Object) {
      setUser(newUser);
    }
  };

  return (
    <div className={isEdit ? style.edit : style.nonEdit}>
      <div className={style.titleBlock}>
        <h2 className={style.title}>Смена пароля</h2>
        <button
          className={classNames('button', style.editButton)}
          onClick={startEditData}
          style={isEdit ? { display: 'none' } : {}}
        >
          Изменить
        </button>
        <div className={style.buttons} style={isEdit ? {} : { display: 'none' }}>
          <button className={classNames('button', style.editButton, style.cancelButton)} onClick={cancelEdit}>
            Отмена
          </button>
          {contextHolder}
          <button className={classNames('button', style.editButton, style.saveButton)} onClick={savePasswords}>
            Сохранить
          </button>
        </div>
      </div>
      <hr className={style.hr} style={isEdit ? {} : { display: 'none' }} />
      <div className={style.mainBlock}>
        <div className={classNames(style.doubleInputBlock)}>
          <div className={style.inputBlock} style={isEdit ? {} : { display: 'none' }}>
            <label htmlFor="user-password">Текущий пароль</label>
            <input
              className={classNames('input', errors.currentPassword ? style.error : '')}
              type="text"
              id="user-password"
              disabled={!isEdit}
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={changePasswords}
            />
            {errors.currentPassword ? <span className={style.error}>{errors.currentPassword}</span> : ''}
          </div>
          <div className={style.inputBlock} style={isEdit ? {} : { display: 'none' }}>
            <label htmlFor="user-password">Новый пароль</label>
            <input
              className={classNames('input', errors.newPassword ? style.error : '')}
              type="text"
              id="user-password"
              disabled={!isEdit}
              name="newPassword"
              value={passwords.newPassword}
              onChange={changePasswords}
            />
            {errors.newPassword ? <span className={style.error}>{errors.newPassword}</span> : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfoBlock;
