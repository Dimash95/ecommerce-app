import { useState, useRef, Dispatch, SetStateAction } from 'react';
import styles from './filter.module.scss';
import { BookResponse } from '../../entities/book-response';
import { getFilteredProduct } from '../../api/filter-api/filter-api';
import { Book } from '../../entities/book';
import classNames from 'classnames';

import spriteSvg from '../../assets/icons/sprite.svg';

interface Props {
  categoryId: string | undefined;
  mapBookResponseToBook: (filteredBook: BookResponse) => Book;
  setSearchedBooks: Dispatch<SetStateAction<Book[] | undefined>>;
  setCategory: Dispatch<SetStateAction<Book[]>>;
}

export function Filter({ categoryId, mapBookResponseToBook, setSearchedBooks, setCategory }: Props) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(9999);
  const [minYear, setMinYear] = useState<number>(0);
  const [maxYear, setMaxYear] = useState<number>(9999);
  const inputMinPriceRef = useRef<HTMLInputElement | null>(null);
  const inputMaxPriceRef = useRef<HTMLInputElement | null>(null);
  const inputMinYearRef = useRef<HTMLInputElement | null>(null);
  const inputMaxYearRef = useRef<HTMLInputElement | null>(null);

  const minStablePrice = 0;
  const maxStablePrice = 9999;
  const minStableYear = 0;
  const maxStableYear = 9999;

  async function filterBooks(minPrice: number, maxPrice: number, minYear: number, maxYear: number) {
    minPrice = minPrice * 100;
    maxPrice = maxPrice * 100;
    const filteredBooks = ((await getFilteredProduct(
      categoryId as string,
      minPrice,
      maxPrice,
      minYear,
      maxYear
    )) as unknown) as BookResponse[];

    if (filteredBooks) {
      const fetchedBooks = filteredBooks.map((filteredBook: BookResponse) => mapBookResponseToBook(filteredBook));
      if (fetchedBooks) {
        setCategory(fetchedBooks);
        setSearchedBooks(fetchedBooks);
      }
    }
    if (inputMinPriceRef.current) {
      inputMinPriceRef.current.value = '';
    }
    if (inputMaxPriceRef.current) {
      inputMaxPriceRef.current.value = '';
    }
    if (inputMinYearRef.current) {
      inputMinYearRef.current.value = '';
    }
    if (inputMaxYearRef.current) {
      inputMaxYearRef.current.value = '';
    }

    setIsFilterOpen(!isFilterOpen);
  }
  return (
    <div className={styles.filter}>
      <button
        type="button"
        className={classNames(styles.filterButton, isFilterOpen ? styles.filterButtonOpened : '', 'button text-common')}
        onClick={function () {
          return setIsFilterOpen(!isFilterOpen);
        }}
      >
        <span>Фильтр</span>
        <svg>
          <use href={`${spriteSvg}#angle`}></use>
        </svg>
      </button>

      <div className={classNames(styles.filterModal, isFilterOpen ? styles.filterModalOpened : '')}>
        <div className={styles.filterModalRow}>
          <div className={styles.filterModalText}>Цена:</div>
          <div className={styles.filterModalInputs}>
            <input
              type="text"
              className={styles.filterModalInput}
              ref={inputMinPriceRef}
              onChange={(e) => {
                setMinPrice(+e.target.value);
              }}
            />
            <span></span>
            <input
              className={styles.filterModalInput}
              type="text"
              ref={inputMaxPriceRef}
              onChange={(e) => {
                setMaxPrice(+e.target.value);
              }}
            />
          </div>
        </div>

        <div className={styles.filterModalRow}>
          <div className={styles.filterModalText}>Год:</div>
          <div className={styles.filterModalInputs}>
            <input
              className={styles.filterModalInput}
              type="text"
              ref={inputMinYearRef}
              onChange={(e) => {
                setMinYear(+e.target.value);
              }}
            />
            <span></span>
            <input
              className={styles.filterModalInput}
              type="text"
              ref={inputMaxYearRef}
              onChange={(e) => {
                setMaxYear(+e.target.value);
              }}
            />
          </div>
        </div>

        <div className={styles.filterButtons}>
          <button
            className={classNames(styles.filterButtonReset, 'button text-common')}
            onClick={() => {
              filterBooks(minStablePrice, maxStablePrice, minStableYear, maxStableYear);
            }}
          >
            Сброс
          </button>
          <button
            className={classNames(styles.filterButtonSubmit, 'button text-common')}
            onClick={() => {
              filterBooks(minPrice, maxPrice, minYear, maxYear);
            }}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}
