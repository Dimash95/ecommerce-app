import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import styles from './footer.module.scss';
import logo from '../../assets/images/logo.svg';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={classNames(styles.footerContainer, 'container')}>
        <div className={styles.footerRow}>
          <div className={styles.footerColLeft}>
            <Link to="/" className={styles.footerLogo} aria-label="На главную">
              <svg>
                <use href={`${logo}#logo`} />
              </svg>
            </Link>
            <div className={classNames(styles.footerSlogan, 'text-common')}>
              Your natural candle made for <br />
              your home and for your wellness.
            </div>
          </div>
          <div className={styles.footerColRight}>
            <nav className={styles.footerNav}>
              <div className={classNames(styles.footerNavTitle, 'text-common')}>Наша команда</div>
              <ul className={classNames(styles.footerNavList, 'text-common')}>
                <li>
                  <Link to="https://github.com/Crepiks" target="_blank">
                    Саяжан
                  </Link>
                </li>
                <li>
                  <Link to="https://github.com/dayanych" target="_blank">
                    Даяна
                  </Link>
                </li>
                <li>
                  <Link to="https://github.com/Dimash95" target="_blank">
                    Димаш
                  </Link>
                </li>
                <li>
                  <Link to="https://github.com/Horvar" target="_blank">
                    Семен
                  </Link>
                </li>
              </ul>
            </nav>
            <nav className={styles.footerNav}>
              <div className={classNames(styles.footerNavTitle, 'text-common')}>Карта сайта</div>
              <ul className={classNames(styles.footerNavList, 'text-common')}>
                <li>
                  <Link to="/">Главная</Link>
                </li>
                <li>
                  <Link to="/catalog">Каталог</Link>
                </li>
                <li>
                  <Link to="/about">О нас</Link>
                </li>
              </ul>
            </nav>
            <nav className={styles.footerNav}>
              <div className={classNames(styles.footerNavTitle, 'text-common')}>При поддержке</div>
              <ul className={classNames(styles.footerNavList, 'text-common')}>
                <li>
                  <Link to="https://rs.school/" target="_blank">
                    RS School
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className={styles.footerRow}>
          <div className={classNames(styles.footerCopyrights, 'text-small')}>©2023 Candleaf. Все права защищены</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
