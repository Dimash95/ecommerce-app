import { apiRoot } from '../api-root';

export const getCategories = async () => {
  try {
    const response = await apiRoot.categories().get().execute();
    const array = [];
    for (let index = 0; index < response.body.results.length; index++) {
      array.push({ id: response.body.results[index].id, name: response.body.results[index].name.ru });
    }
    return array;
  } catch (error) {
    return null;
  }
};

export const getProductsByCategory = async (id: string) => {
  try {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: `categories.id:"${id}"` } })
      .execute();

    return response.body.results;
  } catch (error) {
    return null;
  }
};

export const getCategoryById = async (categoryId: string) => {
  try {
    const allCategories = await getCategories();

    if (allCategories) {
      const targetCategory = allCategories.find((category) => category.id === categoryId);

      if (targetCategory) {
        return targetCategory.name;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};
