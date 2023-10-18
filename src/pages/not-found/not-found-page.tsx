import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './not-found-page.module.scss';

function NotFoundPage() {
  return (
    <main>
      <section className={styles.notFound}>
        <div className={classNames(styles.notFoundContainer)}>
          <div>
            <video
              className={styles.video}
              src="https://static-mh.content.disney.io/matterhorn/assets/errors/e404_main_video-eac5362f8f95.mp4"
              autoPlay
              muted
            ></video>
          </div>

          <h1 className={styles.h1}>Вы не сломали Интернет, но мы не можем найти то, что вы ищете.</h1>
          <div className={styles.textContainer}>
            <div className={styles.searchContainer}>
              <div>Попробуйте найти здесь! </div>
              <Link to="/catalog" className={classNames(styles.notFoundButton, 'button')}>
                Каталог
              </Link>
            </div>

            <div>
              <img
                className={styles.imgDisney}
                src="https://static-mh.content.disney.io/matterhorn/assets/errors/e404_search-a3ee4300507c.png"
                alt="disney"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;
