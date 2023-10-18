import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { message, DatePickerProps } from 'antd';

import { loginUserFromStore } from '../../../utils/store-user-login';
import { UserDataInterface } from '../../../constants/user-interface';
import { createErrorMessage } from '../../../utils/create-error-message';
import { submitCustomer } from '../../../api/auth/submit-customer';

import styles from './register-form.module.scss';
import '../../../assets/styles/antd.scss';
import { FieldsetForm } from './form-input';

interface FormData extends UserDataInterface {
  [key: string]: string;
}

const primaryData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  cityBilling: '',
  streetBilling: '',
  postCodeBilling: '',
  cityShipping: '',
  streetShipping: '',
  postCodeShipping: '',
};

const billingAndShippingArray = [
  {
    title: 'Шиппинг адрес',
    inputsArray: [
      { placeholder: 'Город', name: 'cityShipping' },
      { placeholder: 'Улица', name: 'streetShipping' },
      { placeholder: 'Индекс', name: 'postCodeShipping' },
    ],
    checkboxName: 'isDefaultShippingAddress',
  },
  {
    title: 'Биллинг адрес',
    inputsArray: [
      { placeholder: 'Город', name: 'cityBilling' },
      { placeholder: 'Улица', name: 'streetBilling' },
      { placeholder: 'Индекс', name: 'postCodeBilling' },
    ],
    checkboxName: 'isDefaultBillingAddress',
  },
];

const mainDataArray = [
  {
    title: 'Имя и фамилия',
    key: 'names',
    inputsArray: [
      { placeholder: 'Имя', name: 'firstName', type: 'text' },
      { placeholder: 'Фамилия', name: 'lastName', type: 'text' },
    ],
  },
  {
    title: 'Почта и пароль',
    key: 'email',
    inputsArray: [
      { placeholder: 'Почта', name: 'email', type: 'text' },
      { placeholder: 'Пароль', name: 'password', type: 'password' },
    ],
  },
  {
    title: 'Дата рождения',
    key: 'date',
    inputName: 'dateOfBirth',
  },
];

const primaryCheckboxes = {
  isSimilarAddress: false,
  isDefaultShippingAddress: false,
  isDefaultBillingAddress: false,
};

export const RegisterForm = () => {
  const [formData, setFormData] = useState<FormData>(primaryData);
  const [errors, setErrors] = useState<FormData>(primaryData);
  const [messageApi, contextHolder] = message.useMessage();
  const [checkboxes, setCheckboxes] = useState(primaryCheckboxes);
  const dispatch = useDispatch();
  const [isPasswordType, setIsPasswordType] = useState(true);

  const handleChangeFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (checkboxes.isSimilarAddress) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        cityBilling: formData.cityShipping,
        streetBilling: formData.streetShipping,
        postCodeBilling: formData.postCodeShipping,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    validateField(name, value);
  };

  const handleChangeIsSimilarAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof checkboxes;
    setCheckboxes({ ...checkboxes, [name]: !checkboxes[name] });

    if (name === 'isSimilarAddress' && e.target.checked) {
      setFormData((prevData) => ({
        ...prevData,
        cityBilling: formData.cityShipping,
        streetBilling: formData.streetShipping,
        postCodeBilling: formData.postCodeShipping,
      }));
    }
  };

  const changePasswordType = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsPasswordType(!isPasswordType);
  };

  const changeDate: DatePickerProps['onChange'] = (date, dateString) => {
    setFormData((prevData) => ({
      ...prevData,
      ['dateOfBirth']: dateString,
    }));
    validateField('dateOfBirth', dateString);
  };

  const validateField = (fieldName: string, value: string) => {
    const errorMessage = createErrorMessage(fieldName, value);
    if (formData[fieldName] === '') {
      return;
    }
    if (checkboxes.isSimilarAddress) {
      setErrors((prevData) => ({
        ...prevData,
        [fieldName]: errorMessage,
        ['cityBilling']: '',
        ['streetBilling']: '',
        ['postCodeBilling']: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMessage,
      }));
    }
  };

  return (
    <form className={styles.registrationForm}>
      {mainDataArray.map((element) => {
        return (
          <FieldsetForm
            key={element.key}
            element={element}
            formData={formData}
            errors={errors}
            callBack={handleChangeFormData}
            callBackForPasswords={changePasswordType}
            callBackForDate={changeDate}
            isPasswordType={isPasswordType}
          />
        );
      })}
      <fieldset>
        <legend>Адрес</legend>
        <div className={classNames(styles.registrationFormBlock, styles.registrationAddressBlock)}>
          <div className="wrapper-select">
            <select className={classNames(styles.registrationSelect, 'select')}>
              <option disabled value="">
                Выберите страну
              </option>
              <option value="KZ">Казахстан</option>
            </select>
          </div>
          <div className={styles.registrationCheckboxBlock}>
            <input
              type="checkbox"
              id="similarAddress"
              onChange={handleChangeIsSimilarAddress}
              name="isSimilarAddress"
            />
            <label htmlFor="similarAddress" style={{ cursor: 'pointer' }}>
              Установить один адрес?
            </label>
          </div>
          <div className={styles.registrationShippingAndBillingBlock}>
            {billingAndShippingArray.map((element) => {
              if (!checkboxes.isSimilarAddress || element.title !== 'Биллинг адрес') {
                return (
                  <div className={styles.registrationAddressUnit} key={element.title}>
                    <p>{element.title}</p>
                    {element.inputsArray.map((input) => (
                      <div key={input.name}>
                        <input
                          className={classNames(
                            'input',
                            errors[input.name] && formData[input.name] ? styles.inputError : ''
                          )}
                          type="text"
                          placeholder={input.placeholder}
                          name={input.name}
                          value={formData[input.name]}
                          onChange={handleChangeFormData}
                        />
                        <p className={styles.error}>{formData[input.name] && errors[input.name]}</p>
                      </div>
                    ))}
                    <div className={styles.registrationCheckboxBlock}>
                      <input
                        type="checkbox"
                        id={element.checkboxName}
                        onChange={handleChangeIsSimilarAddress}
                        name={element.checkboxName}
                      />
                      <label htmlFor={element.checkboxName} style={{ cursor: 'pointer' }}>
                        Установить адрес по умолчанию?
                      </label>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </fieldset>
      {contextHolder}
      <button
        className={classNames('button', styles.registrationButton)}
        onClick={(e) => {
          if (checkboxes.isSimilarAddress) {
            formData.cityBilling = formData.cityShipping;
            formData.streetBilling = formData.streetShipping;
            formData.postCodeBilling = formData.postCodeShipping;
          }
          submitCustomer(e, formData, errors, messageApi, checkboxes)?.then(() => {
            dispatch(loginUserFromStore());
          });
        }}
      >
        Отправить
      </button>
    </form>
  );
};
