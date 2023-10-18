import { apiRoot } from '../api-root';

export const getProductsSortByPrice = async (id: string, priceSort: string) => {
  try {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: [`categories.id:"${id}"`], sort: [`price ${priceSort}`] } })
      .execute();

    return response.body.results;
  } catch (error) {
    return null;
  }
};

export const getProductsSortByName = async (id: string, nameSort: string) => {
  try {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: [`categories.id:"${id}"`], sort: [`name.ru ${nameSort}`] } })
      .execute();

    return response.body.results;
  } catch (error) {
    return null;
  }
};
