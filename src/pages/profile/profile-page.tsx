import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import styles from './profile-page.module.scss';
import { getUserById } from '../../api/user-profile/get-user-by-id';
import { Customer } from '@commercetools/platform-sdk';

import { BasicInfoBlock } from './components/basic-info-block';
import AddressInfoBlock from './components/address-info-block';
import SecurityInfoBlock from './components/security-info-block';
import { useFetching } from '../../hooks/use-fetching';
import Loader from '../../components/loader';
import { RootState } from '../../constants/root-state-interface';

function ProfilePage() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [user, setUser] = useState({});

  const loadUser = async () => {
    const userData = await getUserById();
    if (userData) {
      setUser(userData);
    }
  };

  const { fetching, isLoading } = useFetching(loadUser);

  useEffect(() => {
    fetching();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <main>
      <div className="container">
        {isLoading ? (
          <Loader />
        ) : (
          <div className={styles.userBlock}>
            <BasicInfoBlock user={user as Customer} setUser={setUser} />
            <AddressInfoBlock user={user as Customer} setUser={setUser} />
            <SecurityInfoBlock user={user as Customer} setUser={setUser} />
          </div>
        )}
      </div>
    </main>
  );
}

export default ProfilePage;
