import React, { ChangeEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import validator from 'validator';
import { message } from 'antd';

import { submitCustomer } from '../../api/auth/submit-customer';
import { loginUserFromStore } from '../../utils/store-user-login';

import styles from './auth-page.module.scss';
import '../../assets/styles/antd.scss';
import { RootState } from '../../constants/root-state-interface';

interface FormData {
  email: string;
  password: string;
  [key: string]: string;
}

const primaryData = {
  email: '',
  password: '',
};

const mainDataArray = [
  {
    title: 'Почта',
    key: 'email',
    inputProps: { placeholder: 'Почта', name: 'email', type: 'text' },
  },
  {
    title: 'Пароль',
    key: 'password',
    inputProps: { placeholder: 'Пароль', name: 'password', type: 'password' },
  },
];

function AuthPage() {
  const [formData, setFormData] = useState<FormData>(primaryData);
  const [errors, setErrors] = useState<FormData>(primaryData);
  const [messageApi, contextHolder] = message.useMessage();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [passwordType, setpasswordType] = useState('password');

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  const handleChangeFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateField(name, value);
  };

  const changePasswordType = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setpasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const validateField = (fieldName: string, value: string) => {
    let errorMessage = '';

    switch (fieldName) {
      case 'email':
        if (!validator.isEmail(value)) {
          errorMessage = 'Некорректный адрес электронной почты';
        }
        break;
      case 'password':
        if (!validator.isStrongPassword(value, { minSymbols: 0 })) {
          errorMessage = 'Минимум 8 символов, не менее 1 прописной буквы, 1 строчной буквы и 1 цифры';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  return (
    <div className={styles.authContainer}>
      <div className={'container'}>
        <div className={styles.authMain}>
          <div className={styles.loginRegistrationSection}>
            <h1 className={styles.title}>Вход</h1>
            <p className={classNames(styles.registrationText, styles.firstRegistrationText)}>
              Еще не зарегистрированы?{' '}
              <Link to="/register" className={styles.registrationTextLink}>
                Регистрация
              </Link>
            </p>
          </div>
          <form className={styles.loginForm}>
            {mainDataArray.map((block) => (
              <fieldset key={block.key}>
                <legend>{block.title}</legend>
                <div className={styles.passwordBlock}>
                  <input
                    className={classNames(
                      'input',
                      errors[block.inputProps.name] && formData[block.inputProps.name] ? styles.inputError : ''
                    )}
                    type={block.inputProps.type === 'password' ? passwordType : block.inputProps.type}
                    placeholder={block.inputProps.placeholder}
                    name={block.inputProps.name}
                    value={formData[block.inputProps.name]}
                    onChange={handleChangeFormData}
                  />
                  {block.inputProps.type === 'password' ? (
                    <button
                      className={classNames(styles.passwordButton, passwordType === 'password' ? '' : styles.active)}
                      onClick={changePasswordType}
                    ></button>
                  ) : null}
                </div>
                <p className={styles.error}>{formData[block.inputProps.name] && errors[block.inputProps.name]}</p>
              </fieldset>
            ))}
            {contextHolder}
            <button
              className={classNames('button', styles.loginButton)}
              onClick={(e) =>
                submitCustomer(e, formData, errors, messageApi)?.then(() => {
                  dispatch(loginUserFromStore());
                })
              }
            >
              Отправить
            </button>
          </form>
          <p className={classNames(styles.registrationText, styles.secondRegistrationText)}>
            Еще не зарегистрированы?{' '}
            <Link to="/register" className={styles.registrationTextLink}>
              Регистрация
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
