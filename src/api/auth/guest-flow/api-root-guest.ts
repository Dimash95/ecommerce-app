import { ClientBuilder, AuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { getLocalStorageItem, setLocalStorageItem } from '../../../utils/local-storage';
import { LocalStorageNames } from '../../../constants/local-storage-names';
import { AUTH_URL, PROJECT_KEY, CLIENT_ID, CLIENT_SECRET, SCOPES, API_URL } from '../../api-root';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: AUTH_URL,
  projectKey: PROJECT_KEY,
  credentials: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  },
  tokenCache: {
    get: () => {
      return JSON.parse(getLocalStorageItem(LocalStorageNames.tokenData));
    },
    set: (cache: { token: string; expirationTime: number }) => {
      setLocalStorageItem(LocalStorageNames.flow, 'anonymous');
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
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRootGuest = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });
