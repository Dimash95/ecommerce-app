import React, { useEffect, useState } from 'react';
import styles from './cart-page.module.scss';
import classNames from 'classnames';

import Loader from '../../components/loader';
import { Link } from 'react-router-dom';

import { useFetching } from '../../hooks/use-fetching';
import { getActiveCart } from '../../api/carts/get-active-cart';
import { LineItem } from '@commercetools/platform-sdk';
import { deleteProductInCart } from '../../api/carts/delete-product-in-cart';
import { addProductInCart } from '../../api/carts/add-product-in-cart';
import { useCart } from '../../components/cart-context';

import cardImage from '../../assets/images/bg-intro.jpg';

function CartPage() {
  const { setTotalQuantity } = useCart();
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const { fetching, isLoading } = useFetching(async () => {
    const cart = await getActiveCart();
    setLineItems(cart.lineItems);
    setTotalPrice(cart.totalPrice.centAmount / 100);
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');
  const [isPromoCodeApplied, setIsPromoCodeApplied] = useState<boolean>(false);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);

  const handleApplyPromoCode = () => {
    if (isPromoCodeApplied) {
      alert('Промокод уже был применен');
      return;
    }

    if (!originalPrice) {
      setOriginalPrice(totalPrice);
    }

    switch (promoCode) {
      case 'DISCOUNT10':
        setTotalPrice(totalPrice * 0.9);
        setIsPromoCodeApplied(true);
        break;
      case 'DISCOUNT15':
        setTotalPrice(totalPrice * 0.85);
        setIsPromoCodeApplied(true);
        break;
      case 'DISCOUNT20':
        setTotalPrice(totalPrice * 0.8);
        setIsPromoCodeApplied(true);
        break;
      default:
        alert('Неверный промо-код');
    }
  };

  const clearCart = async () => {
    for (const item of lineItems) {
      await deleteProduct(item.id, item.quantity);
    }
    const updatedCart = await getActiveCart();
    setLineItems(updatedCart.lineItems);
    setTotalPrice(updatedCart.totalPrice.centAmount / 100);
  };

  const addProduct = async (lineItemId: string, productId: string, quantity = 1) => {
    setUpdatingItems((prev) => [...prev, lineItemId]);
    for (let i = 0; i < quantity; i++) {
      await addProductInCart(productId);
    }
    const updatedCart = await getActiveCart();
    setLineItems(updatedCart.lineItems);
    setTotalPrice(updatedCart.totalPrice.centAmount / 100); // добавьте эту строку
    setUpdatingItems((prev) => prev.filter((id) => id !== lineItemId));
  };

  const deleteProduct = async (lineItemId: string, quantity?: number) => {
    setUpdatingItems((prev) => [...prev, lineItemId]);

    try {
      await deleteProductInCart(lineItemId, quantity);
      const updatedCart = await getActiveCart();
      setLineItems(updatedCart.lineItems);
      setTotalPrice(updatedCart.totalPrice.centAmount / 100);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== lineItemId));
    }
  };

  useEffect(() => {
    const totalItems = lineItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPriceValue = lineItems.reduce((sum, item) => sum + item.price.value.centAmount * item.quantity, 0) / 100;

    setTotalQuantity(totalItems);
    setTotalPrice(totalPriceValue);
  }, [lineItems]);

  useEffect(() => {
    fetching();
  }, []);

  return (
    <main>
      <section className={styles.cart}>
        <div className={classNames('container', styles.cartContainer)}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className={styles.cartTitleRow}>
                <h1 className={classNames('title-1', styles.cartTitle)}>Корзина</h1>

                {lineItems.length > 0 && (
                  <button type="button" className={classNames(styles.cartClear, 'button-alert')} onClick={clearCart}>
                    Очистить корзину
                  </button>
                )}
              </div>

              {lineItems.length === 0 ? (
                <div className={styles.empty}>
                  <h2 className={classNames(styles.emptyTitle, 'title-2')}>Ваша корзина пуста</h2>
                  <Link className={classNames(styles.emptyLink, 'button')} to={`/catalog`}>
                    Вернуться в каталог
                  </Link>
                </div>
              ) : (
                <>
                  <div className={classNames(styles.cartHeadings, 'text-common')}>
                    <div className={styles.cartRow}>
                      <div className={styles.cartColLong}>
                        <div className={styles.cartItemHeading}>Товар</div>
                      </div>
                      <div className={styles.cartColShort}>
                        <div className={styles.cartItemHeading}>Цена</div>
                      </div>
                      <div className={styles.cartColShort}>
                        <div className={styles.cartItemHeading}>Количество</div>
                      </div>
                      <div className={styles.cartColShort}>
                        <div className={styles.cartItemHeading}>Стоимость</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cartWrapper}>
                    <ul className={styles.cartList}>
                      {lineItems.map((lineItem) => (
                        <li key={lineItem.id} className={styles.cartItem}>
                          <div className={styles.cartRow}>
                            <div className={styles.cartColLong}>
                              <img
                                src={lineItem.variant.images ? lineItem.variant.images[0].url : cardImage}
                                alt={lineItem.name.ru}
                                className={styles.cartItemImg}
                              />
                              <div className={styles.cartItemDescription}>
                                <h3 className={classNames(styles.cartItemName, 'title-3')}>{lineItem.name.ru}</h3>
                                <button
                                  type="button"
                                  onClick={() => deleteProduct(lineItem.id)}
                                  className={classNames(styles.cartItemRemove, 'button-alert')}
                                >
                                  Удалить
                                </button>
                              </div>
                            </div>
                            <div className={styles.cartColShort}>
                              <div className={classNames(styles.cartItemText, 'text-common')}>
                                <span className={styles.cartMobileHeading}>Цена:</span>
                                <span>{`${lineItem.price.value.centAmount / 100} ₸`}</span>
                              </div>
                            </div>
                            <div className={styles.cartColShort}>
                              <div className={classNames(styles.cartItemCounter, 'text-common')}>
                                <button
                                  type="button"
                                  className={styles.cartItemCounterButton}
                                  onClick={() => deleteProduct(lineItem.id, 1)}
                                >
                                  −
                                </button>
                                <input
                                  type="text"
                                  value={lineItem.quantity}
                                  className={styles.cartItemCounterInput}
                                  readOnly
                                />
                                <button
                                  type="button"
                                  className={styles.cartItemCounterButton}
                                  onClick={() => addProduct(lineItem.id, lineItem.productId)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className={styles.cartColShort}>
                              <div className={classNames(styles.cartItemText, 'text-common')}>
                                <span className={styles.cartMobileHeading}>Стоимость:</span>
                                <span>{`${(lineItem.price.value.centAmount * lineItem.quantity) / 100} ₸`}</span>
                              </div>
                            </div>
                          </div>
                          {updatingItems.includes(lineItem.id) && (
                            <div className={styles.cartItemLoader}>
                              <Loader />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                    <div className={styles.cartRow}>
                      <div className={styles.promoCodeWrapper}>
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className={classNames(styles.promoCodeInput, 'title-3')}
                          placeholder="Введите промо-код"
                        />
                        <button
                          type="button"
                          className={classNames(
                            isPromoCodeApplied ? styles.appliedPromoCodeButton : styles.applyPromoCodeButton,
                            'button'
                          )}
                          onClick={handleApplyPromoCode}
                          disabled={isPromoCodeApplied}
                        >
                          {isPromoCodeApplied ? 'Применено' : 'Применить'}
                        </button>
                      </div>

                      <div className={classNames(styles.totalPriceWrapper, 'title-3')}>
                        <div>
                          <span className={styles.totalPriceLabel}>Общая стоимость: </span>
                          {isPromoCodeApplied && originalPrice && (
                            <span className={styles.strikedOriginalPrice}>{`${originalPrice} ₸`}</span>
                          )}
                          <span className={styles.totalPriceValue}>{`${totalPrice} ₸`}</span>
                        </div>

                        <button type="button" className={classNames(styles.cartCheckout, 'button')}>
                          Перейти к оплате
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default CartPage;
