import React, { useState } from 'react';
import classNames from 'classnames';

import styles from './product-slider.module.scss';

import Modal from '../modal';

import spriteSvg from '../../assets/icons/sprite.svg';

interface ProductSliderProps {
  images: string[];
  inModal?: boolean;
}

function ProductSlider({ images, inModal = false }: ProductSliderProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prevSlide = (): void => {
    if (activeIndex === 0) {
      setActiveIndex(images.length - 1);
    } else {
      setActiveIndex((prevIndex) => prevIndex - 1);
    }
  };
  const nextSlide = (): void => {
    if (activeIndex === images.length - 1) {
      setActiveIndex(0);
    } else {
      setActiveIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent): void => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (!isDragging) return;

    const distanceMoved = e.clientX - startX;
    if (distanceMoved > 100) {
      prevSlide();
      setIsDragging(false);
    } else if (distanceMoved < -100) {
      nextSlide();
      setIsDragging(false);
    }
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent): void => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    if (!isDragging) return;

    const distanceMoved = e.touches[0].clientX - startX;
    if (distanceMoved > 100) {
      prevSlide();
      setIsDragging(false);
    } else if (distanceMoved < -100) {
      nextSlide();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = (): void => {
    setIsDragging(false);
  };

  return (
    <div className={classNames(inModal ? styles.sliderModal : '', styles.slider)}>
      {isModalOpen ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ProductSlider images={images} inModal={true} />
        </Modal>
      ) : null}

      <div className={styles.sliderCurrentWrapper}>
        {images.length > 1 && (
          <div className={styles.sliderNav}>
            <button onClick={prevSlide} className={styles.sliderNavLeft}>
              <svg>
                <use href={`${spriteSvg}#angle`} />
              </svg>
            </button>
            <button onClick={nextSlide} className={styles.sliderNavRight}>
              <svg>
                <use href={`${spriteSvg}#angle`} />
              </svg>
            </button>
          </div>
        )}
        <img
          src={images[activeIndex]}
          alt="Current slide"
          className={`${styles.slideCurrentSlide} ${isDragging ? 'dragging' : ''} dragging`}
          onClick={() => {
            if (!inModal) {
              setIsModalOpen(true);
            }
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, index) => (
            <button
              type="button"
              key={index}
              className={index === activeIndex ? `${styles.active}` : ''}
              onClick={() => setActiveIndex(index)}
            >
              <img src={img} alt={`Thumbnail ${index}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductSlider;
