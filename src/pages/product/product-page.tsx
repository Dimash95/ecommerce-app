import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './product-page.module.scss';

import ProductSlider from '../../components/product-slider';

import { useParams } from 'react-router-dom';
import { getProductById } from '../../api/id/get-data';

import Loader from '../../components/loader';
import { addProductInCart } from '../../api/carts/add-product-in-cart';

import { useCart } from '../../components/cart-context';

interface Product {
  id: string;
  name: string;
  genre: string | null;
  price: number | null;
  discount: number | null;
  description: string;
  year: number;
  author: string;
  images: string[];
}

function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const { setTotalQuantity } = useCart();

  const [buttonText, setButtonText] = useState('Добавить в корзину');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (productId) {
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        }
      }
    };

    fetchData();
  }, [productId]);

  if (!product) {
    return (
      <main>
        <Loader />;
      </main>
    );
  }

  const handleAddToCart = async () => {
    try {
      setButtonText('Загрузка...');
      setIsLoading(true);

      await addProductInCart(productId as string);
      setTotalQuantity((prevQuantity) => prevQuantity + 1);

      setButtonText('Добавлено!');
      setTimeout(() => {
        setButtonText('Добавить в корзину');
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setButtonText('Добавить в корзину');
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section className={styles.detail}>
        <div className={classNames(styles.detailContainer, 'container')}>
          <div className={styles.detailColLeft}>
            <div className="App">
              <ProductSlider images={product.images} />
            </div>
          </div>
          <div className={styles.detailColRight}>
            <div className={styles.detailWrapper}>
              <h1 className={classNames(styles.detailTitle, 'title-1')}>{product.name}</h1>
              <div className={styles.detailDataRow}>
                <div className={styles.detailPrice}>{product.price} ₸</div>
                {product.discount && <div className={styles.detailPriceOld}>{product.discount} ₸</div>}
              </div>
              <div className={styles.detailDataRow}>
                <button
                  type="button"
                  className={classNames(styles.detailButton, 'button')}
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  {buttonText}
                </button>
              </div>
            </div>
            <div className={styles.detailWrapper}>
              <div className={styles.detailDescription}>
                <h2 className={classNames(styles.detailSubtitle, 'title-3')}>Описание</h2>
                <div className={classNames(styles.detailText, 'text-common')}>{product.description}</div>
              </div>
              <div className={styles.detailInfo}>
                <div className={styles.detailInfoRow}>
                  <span>Автор</span>
                  <span>{product.author}</span>
                </div>
                <div className={styles.detailInfoRow}>
                  <span>Жанр</span>
                  <span>{product.genre}</span>
                </div>
                <div className={styles.detailInfoRow}>
                  <span>Год издания</span>
                  <span>{product.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductPage;
