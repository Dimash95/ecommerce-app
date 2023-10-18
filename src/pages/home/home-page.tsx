import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { createCart } from '../../api/carts/create-cart';
import { apiRootGuest } from '../../api/auth/guest-flow/api-root-guest';

import styles from './home-page.module.scss';

import imgBooks from '../../assets/images/books.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../constants/root-state-interface';
import { getLocalStorageItem } from '../../utils/local-storage';
import { LocalStorageNames } from '../../constants/local-storage-names';
import { createExistingFlow } from '../../api/auth/existing-flow/api-root-existing-flow';

function HomePage() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    const flow = getLocalStorageItem(LocalStorageNames.flow);
    if (!isLoggedIn && flow !== 'anonymous') {
      apiRootGuest.get().execute();
      createCart(apiRootGuest);
    }
    if (flow) {
      const apiRoot = createExistingFlow();
      apiRoot.get().execute();
    }
  }, []);

  return (
    <main>
      <section className={styles.intro}>
        <div className={classNames(styles.introContainer, 'container')}>
          <div className={styles.introWrapper}>
            <div className={styles.introFrame}>
              <div className={styles.introDescription}>
                <img src={imgBooks} alt="Книги" className={styles.introImg} />
                <h1 className={styles.introTitle}>Легенды на&nbsp;полках</h1>
                <div className={styles.introText}>
                  Каждая книга — это портал в другую эпоху, сохраненный для вас годами и десятилетиями
                </div>
              </div>
              <Link to="/catalog" className={classNames(styles.introLink, 'button')}>
                Откройте наш каталог
              </Link>
              <div className="temp text-common">
                <div className="tempTitle">Обратите внимание!</div>
                <ul className="tempList">
                  <li className="tempItem">Корзина работает с задержкой из-за долгих ответов API</li>
                  <li className="tempItem">Промокоды: DISCOUNT10, DISCOUNT20, DISCOUNT30</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
