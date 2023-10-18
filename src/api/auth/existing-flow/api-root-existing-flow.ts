import { ClientBuilder, ExistingTokenMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { API_URL, PROJECT_KEY } from '../../api-root';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { getLocalStorageItem } from '../../../utils/local-storage';
import { LocalStorageNames } from '../../../constants/local-storage-names';

export const createExistingFlow = () => {
  const tokenData = JSON.parse(getLocalStorageItem(LocalStorageNames.tokenData));
  const authorization = 'Bearer ' + tokenData.token;

  const options: ExistingTokenMiddlewareOptions = {
    force: true,
  };

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: API_URL,
    fetch,
  };

  const client = new ClientBuilder()
    .withExistingTokenFlow(authorization, options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
  const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });

  return apiRoot;
};
