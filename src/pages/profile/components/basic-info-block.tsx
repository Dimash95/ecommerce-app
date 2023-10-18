import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { Customer } from '@commercetools/platform-sdk';
import { DatePicker, DatePickerProps, message } from 'antd';
import dayjs from 'dayjs';
import { createErrorMessage } from '../../../utils/create-error-message';
import { updateUserBasicData } from '../../../api/user-profile/user-basic-data-update';

import style from './info-block.module.scss';
import '../../../assets/styles/antd.scss';

const primaryData = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
};

type BasicInfoBody = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
};

export const BasicInfoBlock = ({ user, setUser }: { user: Customer; setUser: Dispatch<SetStateAction<object>> }) => {
  const userPrimaryBasicInfo = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
  };

  const [isEdit, setIsEdit] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState(userPrimaryBasicInfo);
  const [previousUserData, setPreviousUserData] = useState(userPrimaryBasicInfo);
  const [errors, setErrors] = useState(primaryData);
  const [messageApi, contextHolder] = message.useMessage();

  const cancelEdit = () => {
    setUserBasicInfo({ ...previousUserData });
    setErrors(primaryData);
    setIsEdit(false);
  };

  const startEditData = () => {
    setPreviousUserData({ ...userBasicInfo });
    setIsEdit(true);
  };

  const changeUserData = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserBasicInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const error = createErrorMessage(name, value);
    setErrors((errors) => ({
      ...errors,
      [name]: error,
    }));
  };

  const changeDateOfBirth: DatePickerProps['onChange'] = (date, dateString) => {
    setUserBasicInfo((prevData) => ({
      ...prevData,
      dateOfBirth: dateString,
    }));
    const error = createErrorMessage('dateOfBirth', dateString);
    setErrors((errors) => ({
      ...errors,
      dateOfBirth: error,
    }));
  };

  const saveUserData = async () => {
    const isErrorsEmpty = Object.values(errors).every((field) => field.trim() === '');
    if (!isErrorsEmpty) {
      return messageApi.error('Исправьте все ошибки перед отправкой!');
    }
    const userId = user.id;
    const userVersion = user.version;
    messageApi.loading('Загрузка');
    setIsEdit(false);

    const newUser = await updateUserBasicData(userId, userVersion, userBasicInfo as BasicInfoBody, messageApi);
    if (newUser instanceof Object) {
      setUser(newUser);
    }
  };

  return (
    <div className={isEdit ? style.edit : style.nonEdit}>
      <div className={style.titleBlock}>
        <h2 className={style.title}>Базовая информация</h2>
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
          <button className={classNames('button', style.editButton, style.saveButton)} onClick={saveUserData}>
            Сохранить
          </button>
        </div>
      </div>
      <hr className={style.hr} />
      <div className={style.mainBlock}>
        <div className={classNames(style.doubleInputBlock)}>
          <div className={style.inputBlock}>
            <label htmlFor="user-name">Имя</label>
            <input
              className={classNames('input', errors.firstName ? style.error : '')}
              type="text"
              id="user-name"
              name="firstName"
              value={userBasicInfo.firstName}
              onChange={changeUserData}
              disabled={!isEdit}
            />
            {errors.firstName ? <span className={style.error}>{errors.firstName}</span> : ''}
          </div>
          <div className={style.inputBlock}>
            <label htmlFor="user-lastname">Фамилия</label>
            <input
              className={classNames('input', errors.lastName ? style.error : '')}
              type="text"
              id="user-lastname"
              name="lastName"
              value={userBasicInfo.lastName}
              onChange={changeUserData}
              disabled={!isEdit}
            />
            {errors.lastName ? <span className={style.error}>{errors.lastName}</span> : ''}
          </div>
        </div>
        <div className={classNames(style.doubleInputBlock)}>
          <div className={style.inputBlock}>
            <label htmlFor="user-email">Почта</label>
            <input
              className={classNames('input', errors.email ? style.error : '')}
              type="text"
              id="user-email"
              name="email"
              value={userBasicInfo.email}
              onChange={changeUserData}
              disabled={!isEdit}
            />
            {errors.email ? <span className={style.error}>{errors.email}</span> : ''}
          </div>
          <div className={style.inputBlock}>
            <label htmlFor="dateOfBirth">Дата рождения</label>
            <DatePicker
              id="dateOfBirth"
              className={errors.dateOfBirth ? style.error : ''}
              name="dateOfBirth"
              defaultValue={dayjs(userBasicInfo.dateOfBirth)}
              disabled={!isEdit}
              onChange={changeDateOfBirth}
            />
            {errors.dateOfBirth ? <span className={style.error}>{errors.dateOfBirth}</span> : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
