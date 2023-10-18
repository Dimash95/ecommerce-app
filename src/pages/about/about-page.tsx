import React from 'react';
import classNames from 'classnames';

import styles from './about-page.module.scss';

import logoRs from '../../assets/images/logo-rs.svg';

import Card from './card';
import avaSaya from '../../assets/images/ava-saya.jpg';
import avaDimash from '../../assets/images/ava-dimash.jpg';
import avaDayana from '../../assets/images/ava-dayana.png';
import avaSema from '../../assets/images/ava-sema.jpg';

const cardSaya = {
  img: avaSaya,
  name: 'Саяжан Онласын',
  role: 'Ментор',
  description:
    'Наставник года с глубокими знаниями и опытом. Направляет команду на основе реальных проектов и вводит команду в мир React, демонстрируя лучшие практики.',
  github: 'https://github.com/Crepiks',
};

const cardDimash = {
  img: avaDimash,
  name: 'Амиров Динмухамед',
  role: 'Разработчик',
  description:
    'Лидер года! Очень активный и ответственный. Планирует проект в Asana, распределяет задачи и организовывает ежедневные встречи',
  github: 'https://github.com/Dimash95',
};

const cardDayana = {
  img: avaDayana,
  name: 'Даяна Шакенова',
  role: 'Разработчик',
  description:
    'Бэкендер года! Интеллектуальный двигатель команды! Контролирует техническую часть на Commercetools и связывает фронтенд с бэкендом',
  github: 'https://github.com/dayanych',
};

const cardSema = {
  img: avaSema,
  name: 'Семен Калашников',
  role: 'Разработчик',
  description:
    'Дизайнер-верстальщик года! Организовывает дизайнерскую часть проекта, улучшает верстку команды и настраивает среду разработки',
  github: 'https://github.com/Horvar',
};

function AboutPage() {
  return (
    <main>
      <section className={styles.about}>
        <div className={classNames('container', styles.aboutContainer)}>
          <h1 className={classNames('title-1', styles.aboutTitle)}>О нас</h1>
          <div className={styles.aboutRow}>
            <div className={classNames(styles.aboutText, 'text-common')}>
              <p>
                <strong>Финальный проект курса «JavaScript/Front-end»</strong>
              </p>
              <p>
                Добро пожаловать в наш интернет-магазин! Эта платформа электронной коммерции эффективно воссоздает все
                преимущества реальных магазинов в цифровом формате. Система предлагает интуитивно понятный
                пользовательский интерфейс от стадии поиска товара до момента оформления заказа, что усиливает
                вовлеченность и укрепляет доверие покупателей.
              </p>
              <p>
                На платформе доступен широкий ассортимент товаров: от одежды и обуви до книг и электроники. Пользователи
                могут просматривать детальные описания, добавлять выбранные товары в корзину и совершать покупки с
                максимальным комфортом. Для упрощения процесса мы предлагаем возможности регистрации и входа в систему,
                продвинутый поиск по товарам, а также категоризацию и сортировку.
              </p>
              <h2>Особенности приложения:</h2>
              <ul>
                <li>
                  <strong>Разработано на React:</strong> Использование этой популярной JavaScript-библиотеки позволяет
                  сделать интерфейс быстрым и отзывчивым, что особенно важно при большом ассортименте товаров и высокой
                  нагрузке на платформу.
                </li>
                <li>
                  <strong>Адаптивный дизайн:</strong> Наш сайт корректно отображается на различных устройствах, начиная
                  с минимального разрешения экрана в 390px. Это обеспечивает комфортный процесс покупок на любом
                  устройстве.
                </li>
              </ul>
              <h2>Ключевые страницы:</h2>
              <ul>
                <li>
                  <strong>Главная страница:</strong> обзор акций, новинок и основных категорий.
                </li>
                <li>
                  <strong>Страница «О нас»:</strong> информация о компании и контактные данные.
                </li>
                <li>
                  <strong>Страница каталога товаров:</strong> широкий выбор продуктов с возможностью сортировки и
                  фильтрации.
                </li>
                <li>
                  <strong>Детальная страница товара:</strong> полная информация о продукте.
                </li>
                <li>
                  <strong>Страница корзины:</strong> обзор и оформление покупок.
                </li>
                <li>
                  <strong>Страницы входа и регистрации:</strong> для входа в систему или создания нового аккаунта.
                </li>
                <li>
                  <strong>Страница профиля пользователя:</strong> управление аккаунтом и история заказов.
                </li>
              </ul>
              <p>
                На технической стороне, наша платформа работает на базе CommerceTools — ведущего поставщика решений для
                B2C и B2B рынков. CommerceTools предлагает облачную, микросервисную платформу, позволяя брендам
                создавать уникальные и захватывающие цифровые торговые опыты.
              </p>
            </div>
            <div className={styles.linkRss}>
              <a href="https://rs.school/" target="_blank" className={styles.aboutLogoRs}>
                <img src={logoRs} alt="rollingScopesSchool" />
              </a>
            </div>
          </div>

          <h2 className={classNames('title-1', styles.aboutTitle)}>Наша команда</h2>

          <div className={styles.aboutCards}>
            <Card
              img={cardSaya.img}
              name={cardSaya.name}
              role={cardSaya.role}
              description={cardSaya.description}
              github={cardSaya.github}
            />
            <Card
              img={cardDimash.img}
              name={cardDimash.name}
              role={cardDimash.role}
              description={cardDimash.description}
              github={cardDimash.github}
            />
            <Card
              img={cardDayana.img}
              name={cardDayana.name}
              role={cardDayana.role}
              description={cardDayana.description}
              github={cardDayana.github}
            />
            <Card
              img={cardSema.img}
              name={cardSema.name}
              role={cardSema.role}
              description={cardSema.description}
              github={cardSema.github}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
