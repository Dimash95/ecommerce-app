import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { RegisterForm } from './components/register-form';
import styles from './register-page.module.scss';
import { RootState } from '../../constants/root-state-interface';

function RegisterPage() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.registrationContainer}>
      <div className={'container'}>
        <div className={styles.registrationMain}>
          <div className={styles.loginRegistrationSection}>
            <h1 className={styles.title}>Регистрация</h1>
            <p className={classNames(styles.loginText, styles.firstloginText)}>
              Уже есть аккаунт?{' '}
              <Link to="/auth" className={styles.loginTextLink}>
                Вход
              </Link>
            </p>
          </div>
          <RegisterForm />
          <p className={classNames(styles.loginText, styles.secondloginText)}>
            Уже есть аккаунт?{' '}
            <Link to="/auth" className={styles.loginTextLink}>
              Вход
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
