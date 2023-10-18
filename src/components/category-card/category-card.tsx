import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './category-card.module.scss';
import classNames from 'classnames';

import BookCard from '../book-card';
import { getProductsByCategory } from '../../api/categories/get-categories';
import { Book } from '../../entities/book';
import { BookResponse } from '../../entities/book-response';

import spriteSvg from '../../assets/icons/sprite.svg';

interface Props {
  id: string;
  name: string;
}

export function CategoryCard(category: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isAtLeftEdge, setIsAtLeftEdge] = useState(true);
  const [isAtRightEdge, setIsAtRightEdge] = useState(false);
  const scrollRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    displayProducts(category.id);
  }, []);

  useEffect(() => {
    checkScrollEdges();
  }, [books]);

  const checkScrollEdges = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtLeftEdge(scrollLeft === 0);
      setIsAtRightEdge(scrollLeft >= scrollWidth - clientWidth);
    }
  };

  async function displayProducts(id: string) {
    const bookResponses = ((await getProductsByCategory(id)) as unknown) as BookResponse[];
    if (bookResponses) {
      const fetchedBooks = bookResponses.map((bookResponse: BookResponse) => mapBookResponseToBook(bookResponse));
      setBooks(fetchedBooks);
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

  let cardWidth = 0;

  if (cardRef.current) {
    const rect = cardRef.current.getBoundingClientRect();
    const computedStyles = window.getComputedStyle(cardRef.current);
    const marginLeft = parseFloat(computedStyles.marginLeft);
    const marginRight = parseFloat(computedStyles.marginRight);
    cardWidth = rect.width + marginLeft + marginRight;
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      setTimeout(checkScrollEdges, 0);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      setTimeout(checkScrollEdges, 0);
    }
  };

  return (
    <div className={styles.categoryPreview}>
      <h2 className={classNames(styles.categoryPreviewTitle, 'title-2')}>
        <Link to={`/catalog/${category.id}`}>
          <span>{category.name}</span>
          <svg>
            <use href={`${spriteSvg}#arrow`}></use>
          </svg>
        </Link>
      </h2>

      <div className={styles.books}>
        <ul className={styles.booksList} ref={scrollRef}>
          {books.map((book) => (
            <li ref={cardRef} className={styles.booksItem} key={book.id}>
              <BookCard book={book} categoryId={category.id} />
            </li>
          ))}
        </ul>
        <nav className={styles.booksNav}>
          <button
            type="button"
            className={classNames(styles.booksNavButtonLeft, { [styles.disabled]: isAtLeftEdge })}
            onClick={scrollLeft}
            aria-label="Назад"
            disabled={isAtLeftEdge}
          >
            <svg>
              <use href={`${spriteSvg}#angle`}></use>
            </svg>
          </button>
          <button
            type="button"
            className={classNames(styles.booksNavButtonRight, { [styles.disabled]: isAtRightEdge })}
            onClick={scrollRight}
            aria-label="Вперед"
            disabled={isAtRightEdge}
          >
            <svg>
              <use href={`${spriteSvg}#angle`}></use>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}
