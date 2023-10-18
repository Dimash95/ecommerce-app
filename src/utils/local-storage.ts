import { LocalStorageNames } from '../constants/local-storage-names';

const USER_CUSTOMER = 'customers';

export const isUserLogin = () => {
  const flowJSON = getLocalStorageItem(LocalStorageNames.flow);
  return flowJSON === USER_CUSTOMER;
};

export const setLocalStorageItem = <T>(name: string, value: T) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const deleteLocalStorageItem = (name: string) => {
  localStorage.removeItem(name);
};

export const getLocalStorageItem = (name: string) => {
  const item = localStorage.getItem(name);
  return item ? JSON.parse(item) : null;
};
