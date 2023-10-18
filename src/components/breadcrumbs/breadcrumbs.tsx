import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import { getProductById } from '../../api/id/get-data';

import styles from './breadcrumbs.module.scss';

import spriteSvg from '../../assets/icons/sprite.svg';

const translationMap: { [key: string]: string } = {
  catalog: 'Каталог',
  categories: 'Каталог',
  products: 'Продукты',
  about: 'О нас',
  contacts: 'Контакты',
  register: 'Регистрация',
  auth: 'Авторизация',
  cart: 'Корзина',
  profile: 'Профиль',
  '187176b4-3851-42b9-891d-86f1e92f1d23': 'Роман',
  'bd94dab9-314e-4a57-b241-3fedc8e5d397': 'Фантастика',
  '26d06794-cb9d-4bc9-ac25-a8a8a910d437': 'Детектив',
  '72b7d135-919e-45a9-9f5d-bd709834d00c': 'Приключение',
  '442d3b91-3217-4174-8b86-3581d55779b4': 'Научные',
  'dae917be-60f3-4c64-871b-cbd00148dca1': 'Философия',
  'b620432e-b087-4bbf-96fc-61cf61e7c6f5': 'Поэзия',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  const [bookName, setBookName] = useState<string | null>(null);
  const stabilizedPathnames = useMemo(() => pathnames, [JSON.stringify(pathnames)]);

  useEffect(() => {
    async function fetchBookName() {
      const lastPath = pathnames[pathnames.length - 1];

      setBookName('...');

      if (lastPath.length > 10) {
        const book = await getProductById(lastPath);

        if (book) {
          setBookName(book.name);
          return;
        }
      }

      setBookName(null);
    }

    fetchBookName();
  }, [stabilizedPathnames]);

  return (
    <nav className={styles.breadcrumbs}>
      <div className={classNames(styles.breadcrumbsContainer, 'container')}>
        <ul className={styles.breadcrumbsList}>
          <li className={styles.breadcrumbsItem}>
            <Link className={styles.breadcrumbsLink} to="/">
              Главная
            </Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            let translated = translationMap[value] || value;

            if (index === pathnames.length - 1 && bookName) {
              translated = bookName;
            }

            return (
              <li className={styles.breadcrumbsItem} key={to}>
                <svg className={styles.breadcrumbsSeparator}>
                  <use href={`${spriteSvg}#angleThick`}></use>
                </svg>
                <Link className={styles.breadcrumbsLink} to={to}>
                  {translated}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
