import { apiRoot } from '../api-root';

import { getCategoryById } from '../../api/categories/get-categories';

export const getProductById = async (id: string) => {
  try {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: `id:"${id}"` } })
      .execute();

    const products = response.body?.results;

    if (products && products.length > 0) {
      const { id, name, description, masterVariant, categories } = products[0];

      const authorAttribute = masterVariant?.attributes?.find((attribute) => attribute.name === 'author');
      const discountAttribute = masterVariant?.attributes?.find((attribute) => attribute.name === 'discount');
      const yearAttribute = masterVariant?.attributes?.find((attribute) => attribute.name === 'year');
      const price = masterVariant?.prices?.[0]?.value?.centAmount;
      const images = masterVariant?.images?.map((img) => img.url) || [];
      const categoryId = categories?.[0]?.id;
      const categoryName = categoryId ? await getCategoryById(categoryId) : null;
      const genre = categoryName;

      const product = {
        id: id,
        name: name['ru'],
        description: description?.['ru'] || 'No description available',
        year: yearAttribute ? yearAttribute.value : null,
        author: authorAttribute ? authorAttribute.value : null,
        discount: discountAttribute ? discountAttribute.value : null,
        price: price ? price / 100 : null,
        images,
        genre,
      };

      return product;
    }

    return null;
  } catch (error) {
    console.error('An error occurred while fetching the product:', error);
    return null;
  }
};
