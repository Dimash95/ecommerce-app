import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './catalog-page.module.scss';

import { useFetching } from '../../hooks/use-fetching';
import { Spin } from 'antd';

import Header from '../../components/header';
import CategoryCard from '../../components/category-card';

import { getCategories } from '../../api/categories/get-categories';
import { Category } from '../../entities/category';

function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetching();
  }, []);

  const loadCategories = async () => {
    const categories = await getCategories();
    setCategories(categories || []);
  };

  const { fetching, isLoading } = useFetching(loadCategories);

  return (
    <>
      <Header />
      <main>
        <section>
          <div className={classNames(styles.catalogContainer, 'container')}>
            {isLoading ? (
              <Spin tip="Загрузка..." size="large">
                <div className={styles.antdText} />
              </Spin>
            ) : (
              <div className={styles.catalogContentContainer}>
                <div className={styles.pathCategoryLinkContainer}>
                  <div className={styles.pathLinkContainer}>
                    <Link className={styles.pathLink} to={`/`}>
                      Главная
                    </Link>
                    <div>{'>'}</div>
                    <Link className={styles.pathLink} to={`/catalog`}>
                      Каталог
                    </Link>
                  </div>
                  <ul className={styles.categoryLinkContainer}>
                    {categories?.map((category) => (
                      <li key={category.id}>
                        <Link className={styles.categoryLink} to={`/categories/${category.id}`}>
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className={styles.categoryContainer}>
                  {categories?.map((category) => (
                    <li key={category.id}>
                      <CategoryCard name={category.name} id={category.id} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default CatalogPage;
