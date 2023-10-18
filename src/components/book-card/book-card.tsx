import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import styles from './book-card.module.scss';

import { Book } from '../../entities/book';
import { addProductInCart } from '../../api/carts/add-product-in-cart';
import { useCart } from '../cart-context';

import classNames from 'classnames';

interface Props {
  book: Book;
  categoryId?: string;
}

export function BookCard({ book, categoryId }: Props) {
  const convertToRightPrice = 100;
  const hundredPercent = 100;

  const realPrice = book.prices / convertToRightPrice;
  const percentOfPrice = (realPrice * hundredPercent) / Number(book.oldPrice);
  const discount = String(Math.ceil(hundredPercent - percentOfPrice));

  const { setTotalQuantity } = useCart();

  const [buttonText, setButtonText] = useState('В корзину');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setButtonText('Загрузка...');
      setIsLoading(true);

      await addProductInCart(book.id);
      setTotalQuantity((prevQuantity) => prevQuantity + 1);

      setButtonText('Добавлено!');
      setTimeout(() => {
        setButtonText('В корзину');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding book to cart:', error);
      setButtonText('В корзину');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.bookCard}>
      <Link className={styles.bookCardLinkOverlay} to={`/catalog/${categoryId}/${book.id}`}></Link>

      {book.oldPrice && <div className={classNames(styles.bookDiscount, 'title-3')}>-{discount}%</div>}

      <div className={styles.bookPreview}>
        <img src={book.img} alt={book.title} />
      </div>

      <div className={styles.bookDescription}>
        <div className={classNames(styles.bookTitle, 'title-4')}>{book.title}</div>
        <div className={classNames(styles.bookAuthor, 'text-small')}>{book.author}</div>
      </div>

      <div className={styles.bookPriceWrapper}>
        <div className={classNames(styles.bookPriceNew, 'title-3')}>{realPrice} ₸</div>
        {book.oldPrice && <div className={classNames(styles.bookPriceOld, 'title-4')}>{book.oldPrice} ₸</div>}
      </div>

      <button
        type="button"
        className={classNames(styles.bookButton, 'button')}
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {buttonText}
      </button>
    </div>
  );
}
