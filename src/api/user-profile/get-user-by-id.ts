import { LocalStorageNames } from '../../constants/local-storage-names';
import { getLocalStorageItem } from '../../utils/local-storage';
import { apiRoot } from '../api-root';

export const getUserById = async () => {
  const userId = getLocalStorageItem(LocalStorageNames.customerId);
  try {
    const response = await apiRoot.customers().withId({ ID: userId }).get().execute();

    return response.body;
  } catch (error) {
    return null;
  }
};
