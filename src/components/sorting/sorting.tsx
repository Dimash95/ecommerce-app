import { useState, Dispatch, SetStateAction } from 'react';
import { getProductsSortByPrice, getProductsSortByName } from '../../api/sort-api/sort-api';
import styles from './sorting.module.scss';

import { BookResponse } from '../../entities/book-response';
import { Book } from '../../entities/book';

interface Props {
  categoryId: string | undefined;
  mapBookResponseToBook: (filteredBook: BookResponse) => Book;
  setSearchedBooks: Dispatch<SetStateAction<Book[] | undefined>>;
  setCategory: Dispatch<SetStateAction<Book[]>>;
}

export function Sorting({ categoryId, mapBookResponseToBook, setSearchedBooks, setCategory }: Props) {
  const [priceSort, setPriceSort] = useState<string>('asc');
  const [titleSort, setTitleSort] = useState<string>('asc');

  const [priceUp, setPriceUp] = useState<number>(0);
  const [alphabet, setAlphabet] = useState<string>('А-я');

  async function sortByPrice() {
    const sortedBooks = ((await getProductsSortByPrice(categoryId as string, priceSort)) as unknown) as BookResponse[];

    if (sortedBooks) {
      const fetchedBooks = sortedBooks.map((filteredBook: BookResponse) => mapBookResponseToBook(filteredBook));

      setCategory(fetchedBooks);
      setSearchedBooks(fetchedBooks);

      priceSort === 'desc' ? setPriceSort('asc') : setPriceSort('desc');

      priceUp != 1 ? setPriceUp(1) : setPriceUp(2);
    }
  }

  async function sortByTitles() {
    const sortedBooks = ((await getProductsSortByName(categoryId as string, titleSort)) as unknown) as BookResponse[];

    if (sortedBooks) {
      const fetchedBooks = sortedBooks.map((filteredBook: BookResponse) => mapBookResponseToBook(filteredBook));

      setCategory(fetchedBooks);
      setSearchedBooks(fetchedBooks);

      titleSort === 'desc' ? setTitleSort('asc') : setTitleSort('desc');

      alphabet === 'А-я' ? setAlphabet('Я-а') : setAlphabet('А-я');
    }
  }
  return (
    <div className={styles.sort}>
      <div className={styles.sortText}>Сортировка:</div>
      <div
        className={styles.sortButton}
        onClick={() => {
          sortByPrice();
        }}
      >
        <div className={styles.sortTextType}>Цена</div>
        <div className={styles.sortArrow}>{priceUp === 1 ? '↓' : priceUp === 2 ? '↑' : ''}</div>
      </div>
      <div className={styles.sortButton} onClick={sortByTitles}>
        <div className={styles.sortTextType}>{alphabet}</div>
      </div>
    </div>
  );
}
