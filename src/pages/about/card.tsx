import React from 'react';
import classNames from 'classnames';

import styles from './about-page.module.scss';

import logoGithub from '../../assets/icons/logo-github.svg';

type CardType = {
  img: string;
  name: string;
  role: string;
  description: string;
  github: string;
};

function Card({ img, name, role, description, github }: CardType) {
  return (
    <div className={styles.teamCard}>
      <a href={github} target="_blank" aria-label="GitHub" className={styles.teamLinkOverlay}></a>
      <div className={styles.teamPhoto}>
        <img src={img} alt={name} />
      </div>
      <div className={styles.teamDescription}>
        <h3 className={classNames(styles.teamName, 'title-3')}>{name}</h3>
        <a href={github} target="_blank" aria-label="GitHub" className={styles.teamGithub}>
          <svg>
            <use href={`${logoGithub}#logo-github`}></use>
          </svg>
        </a>
        <p className={classNames(styles.teamRole, 'text-common')}>{role}</p>
        <p className={classNames(styles.teamText, 'text-small')}>{description}</p>
      </div>
    </div>
  );
}

export default Card;
