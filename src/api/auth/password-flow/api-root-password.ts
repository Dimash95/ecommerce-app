import { ClientBuilder, PasswordAuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { AUTH_URL, PROJECT_KEY, CLIENT_ID, CLIENT_SECRET, SCOPES, API_URL } from '../../api-root';
import { getLocalStorageItem, setLocalStorageItem } from '../../../utils/local-storage';
import { LocalStorageNames } from '../../../constants/local-storage-names';
import { createCart } from '../../carts/create-cart';

export const createPasswordFlow = (userData: { username: string; password: string }) => {
  const authMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    host: AUTH_URL,
    projectKey: PROJECT_KEY,
    credentials: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      user: userData,
    },
    tokenCache: {
      get: () => {
        return JSON.parse(getLocalStorageItem(LocalStorageNames.tokenData));
      },
      set: (cache: { token: string; expirationTime: number }) => {
        setLocalStorageItem(LocalStorageNames.flow, 'customers');
        setLocalStorageItem(LocalStorageNames.tokenData, JSON.stringify(cache));
        return cache;
      },
    },
    scopes: [SCOPES],
    fetch,
  };

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: API_URL,
    fetch,
  };

  const client = new ClientBuilder()
    .withPasswordFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });
  // createCart(apiRoot);

  return apiRoot;
};
