import { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import styles from './category-page.module.scss';

import { useFetching } from '../../hooks/use-fetching';

import { getProductsByCategory } from '../../api/categories/get-categories';
import { getCategories } from '../../api/categories/get-categories';

import BookCard from '../../components/book-card';
import Searcher from '../../components/searcher';
import Filter from '../../components/filter';
import Sorting from '../../components/sorting';

import { Category } from '../../entities/category';
import { Book } from '../../entities/book';
import { BookResponse } from '../../entities/book-response';

import Loader from '../../components/loader';
import classNames from 'classnames';

export function CategoryPage() {
  const { categoryId } = useParams();

  const [categories, setCategories] = useState<Category[]>([]);

  let categoryTitle = '';

  categories.forEach((category) => {
    if (category.id === categoryId) {
      categoryTitle = category.name;
    }
  });

  useEffect(() => {
    fetching();
  }, []);

  const loadCategories = async () => {
    const categories = await getCategories();
    setCategories(categories || []);
  };
  const { fetching, isLoading } = useFetching(loadCategories);

  const [category, setCategory] = useState<Book[]>([]);

  useEffect(() => {
    if (categoryId) {
      displayProducts(categoryId);
    }
  }, []);

  async function displayProducts(categoryId: string) {
    const bookResponses = ((await getProductsByCategory(categoryId)) as unknown) as BookResponse[];

    if (bookResponses) {
      const fetchedBooks = bookResponses.map((bookResponse: BookResponse) => mapBookResponseToBook(bookResponse));
      setCategory(fetchedBooks);
      setSearchedBooks(fetchedBooks);
    }
  }

  const mapBookResponseToBook = (payload: BookResponse): Book => ({
    id: payload.id,
    img: payload.masterVariant.images[0].url,
    title: payload.name.ru,
    year: payload.masterVariant.attributes[0].value,
    author: payload.masterVariant.attributes[1].value,
    oldPrice: payload.masterVariant.attributes[2]?.value,
    prices: payload.masterVariant.prices[0].value.centAmount,
  });

  const [searchedBooks, setSearchedBooks] = useState<Book[]>();

  const searchBook = (event: ChangeEvent<HTMLInputElement>) => {
    const searchedBook = category.filter((book) =>
      book.title.toLowerCase().includes(event.target?.value.toLowerCase())
    );
    setCategory(category);
    setSearchedBooks(searchedBook);
  };

  return (
    <main>
      {isLoading ? (
        <Loader />
      ) : (
        <section className={styles.category}>
          <div className={classNames(styles.categoryContainer, 'container')}>
            <div className={styles.categoryRowHeading}>
              <h1 className={classNames(styles.categoryTitle, 'title-1')}>{categoryTitle}</h1>
              <Searcher searchBookProp={searchBook} />
            </div>

            <div className={styles.categoryRowFilter}>
              <Filter
                categoryId={categoryId}
                mapBookResponseToBook={mapBookResponseToBook}
                setSearchedBooks={setSearchedBooks}
                setCategory={setCategory}
              />
              <Sorting
                categoryId={categoryId}
                mapBookResponseToBook={mapBookResponseToBook}
                setSearchedBooks={setSearchedBooks}
                setCategory={setCategory}
              />
            </div>

            <ul className={styles.booksList}>
              {searchedBooks?.map((book) => (
                <li className={styles.booksItem} key={book.id}>
                  <BookCard book={book} categoryId={categoryId} />
                </li>
              ))}
            </ul>

            <div className={searchedBooks?.length === 0 ? styles.nothingToShow : styles.hide}>
              По вашему запросу ничего не найдено!
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
