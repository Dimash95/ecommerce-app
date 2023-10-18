import React, { ChangeEvent } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

import styles from './register-form.module.scss';
import { UserDataInterface } from '../../../constants/user-interface';

interface FormData extends UserDataInterface {
  [key: string]: string;
}

interface MainData {
  title: string;
  key: string;
  inputsArray?: {
    placeholder: string;
    name: string;
    type: string;
  }[];
  inputName?: string;
}

export const InputBlock = ({
  name,
  type,
  placeholder,
  formData,
  errors,
  callBack,
  callBackForPasswords,
  isPasswordType,
}: {
  name: string;
  type: string;
  placeholder: string;
  formData: FormData;
  errors: FormData;
  callBack: (e: ChangeEvent<HTMLInputElement>) => void;
  callBackForPasswords: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isPasswordType: boolean;
}) => {
  if (type === 'password')
    return (
      <div>
        <div className={styles.passwordBlock}>
          <input
            className={classNames('input', errors[name] && formData[name] ? styles.inputError : '')}
            type={isPasswordType ? 'password' : 'text'}
            placeholder={placeholder}
            name={name}
            value={formData[name]}
            onChange={callBack}
          />
          <button
            className={classNames(styles.passwordButton, isPasswordType ? '' : styles.active)}
            onClick={callBackForPasswords}
          ></button>
        </div>
        <p className={styles.error}>{formData[name] && errors[name]}</p>
      </div>
    );
  return (
    <div key={name}>
      <input
        className={classNames('input', errors[name] && formData[name] ? styles.inputError : '')}
        type={type}
        placeholder={placeholder}
        name={name}
        value={formData[name]}
        onChange={callBack}
      />
      <p className={styles.error}>{formData[name] && errors[name]}</p>
    </div>
  );
};

export const FieldsetForm = ({
  element,
  formData,
  errors,
  callBack,
  callBackForPasswords,
  callBackForDate,
  isPasswordType,
}: {
  element: MainData;
  formData: FormData;
  errors: FormData;
  callBack: (e: ChangeEvent<HTMLInputElement>) => void;
  callBackForPasswords: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  callBackForDate: (value: dayjs.Dayjs | null, dateString: string) => void;
  isPasswordType: boolean;
}) => {
  if (element.key === 'date' && element.inputName) {
    return (
      <fieldset>
        <legend>{element.title}</legend>
        <div className={classNames(styles.registrationFormBlock, styles.dateBlock)}>
          <DatePicker onChange={callBackForDate} name={element.inputName} />
          <p className={styles.error}>{formData[element.inputName] && errors[element.inputName]}</p>
        </div>
      </fieldset>
    );
  }
  return (
    <fieldset>
      <legend>{element.title}</legend>
      <div className={classNames(styles.registrationFormBlock)}>
        {element.inputsArray?.map((input) => {
          return (
            <InputBlock
              key={input.name}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder}
              formData={formData}
              errors={errors}
              callBack={callBack}
              callBackForPasswords={callBackForPasswords}
              isPasswordType={isPasswordType}
            />
          );
        })}
      </div>
    </fieldset>
  );
};
