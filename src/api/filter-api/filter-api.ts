import { apiRoot } from '../api-root';

export const getFilteredProduct = async (
  id: string,
  minPrice: number,
  maxPrice: number,
  minYear: number,
  maxYear: number
) => {
  try {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: [
            `categories.id:"${id}"`,
            `variants.price.centAmount:range(${minPrice} to ${maxPrice})`,
            `variants.attributes.year:range(${minYear} to ${maxYear})`,
          ],
        },
      })
      .execute();

    return response.body.results;
  } catch (error) {
    return null;
  }
};
