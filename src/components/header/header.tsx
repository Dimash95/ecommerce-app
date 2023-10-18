import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logout } from '../../api/auth/logout';
import { logoutUserFromStore } from '../../utils/store-user-login';

import styles from './header.module.scss';

import logo from '../../assets/images/logo.svg';
import spriteSvg from '../../assets/icons/sprite.svg';
import { RootState } from '../../constants/root-state-interface';
import { useCart } from '../../components/cart-context';

import { getTotalQuantityFromCart } from '../../api/carts/get-active-cart';

function Header() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const { totalQuantity } = useCart();
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const handleHamburgerClick = () => {
    setIsMenuOpened(!isMenuOpened);
  };
  const closeMenu = () => {
    setIsMenuOpened(false);
  };

  useEffect(() => {
    const fetchTotalQuantity = async () => {
      const quantity = await getTotalQuantityFromCart();
      if (typeof quantity === 'number') {
        {
          totalQuantity;
        }
      } else {
        {
          totalQuantity;
        }
      }
    };

    fetchTotalQuantity();
  }, []);

  return (
    <header className={styles.header}>
      <div className={classNames(styles.headerContainer, 'container')}>
        <div className={styles.headerWrapper}>
          <Link to="/" className={styles.headerLogo} aria-label="На главную">
            <svg>
              <use href={`${logo}#logo`} />
            </svg>
          </Link>

          <button
            type="button"
            className={classNames(styles.headerHamburger, { [styles.opened]: isMenuOpened })}
            aria-label="Меню"
            data-menu-button
            onClick={handleHamburgerClick}
          >
            <div></div>
            <div></div>
            <div></div>
          </button>

          <div
            className={classNames(styles.headerOverlay, { [styles.opened]: isMenuOpened })}
            data-menu-overlay
            onClick={handleHamburgerClick}
          ></div>
          <nav className={classNames(styles.headerNavLinks, isMenuOpened ? styles.opened : '')} data-menu-modal>
            <ul>
              <li>
                <Link to="/" onClick={closeMenu}>
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" onClick={closeMenu}>
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMenu}>
                  О нас
                </Link>
              </li>
            </ul>
          </nav>
          <nav className={styles.headerNavButtons}>
            <ul>
              <li>
                <div aria-label="Личный кабинет">
                  <svg>
                    <use href={`${spriteSvg}#account`} />
                  </svg>
                </div>
                <div className={styles.headerDropdown}>
                  <ul>
                    {isLoggedIn ? (
                      <>
                        <li>
                          <Link to="/profile">Профиль</Link>
                        </li>
                        <li
                          onClick={() => {
                            logout();
                            dispatch(logoutUserFromStore());
                          }}
                        >
                          <a onClick={(e) => e.preventDefault()} style={{ cursor: 'pointer' }}>
                            Выйти
                          </a>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/register">Регистрация</Link>
                        </li>
                        <li>
                          <Link to="/auth">Вход</Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </li>
              <li>
                <Link to="/cart" aria-label="Корзина">
                  <svg>
                    <use href={`${spriteSvg}#cart`} />
                  </svg>
                </Link>
                {totalQuantity > 0 && <div className={styles.headerCartQuantity}>{totalQuantity}</div>}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
