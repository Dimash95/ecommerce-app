import axios from 'axios';
import { deleteLocalStorageItem, getLocalStorageItem } from '../../utils/local-storage';
import { AUTH_URL, CLIENT_ID, CLIENT_SECRET } from '../api-root';
import { LocalStorageNames } from '../../constants/local-storage-names';

const url = `${AUTH_URL}/oauth/token/revoke`;
const authCredentials = {
  username: CLIENT_ID,
  password: CLIENT_SECRET,
};

const revokeToken = () => {
  const tokenData = JSON.parse(getLocalStorageItem(LocalStorageNames.tokenData));

  const requestData = new URLSearchParams();
  requestData.append('token', tokenData.token);
  requestData.append('token_type_hint', 'access_token');
  axios.post(url, requestData, {
    auth: authCredentials,
  });
};

const deleteData = [
  LocalStorageNames.flow,
  LocalStorageNames.customerId,
  LocalStorageNames.tokenData,
  LocalStorageNames.cartId,
];

export const logout = () => {
  revokeToken();
  deleteData.forEach((name) => deleteLocalStorageItem(name));
};
