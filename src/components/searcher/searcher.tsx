import { ChangeEvent } from 'react';
import classNames from 'classnames';

import styles from './searcher.module.scss';

import spriteSvg from '../../assets/icons/sprite.svg';

interface Props {
  searchBookProp: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Searcher({ searchBookProp }: Props) {
  return (
    <div className={styles.searchContainer}>
      <input
        className={classNames(styles.searchInput, 'text-common')}
        onChange={searchBookProp}
        placeholder="Что вы ищите?"
        type="text"
      />
      <svg className={styles.searchIcon}>
        <use href={`${spriteSvg}#search`}></use>
      </svg>
    </div>
  );
}
