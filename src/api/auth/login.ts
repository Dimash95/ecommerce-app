import type { MessageInstance } from 'antd/es/message/interface';
import { processRequests } from './process-requests';
import { createExistingFlow } from './existing-flow/api-root-existing-flow';

const messageError = 'Аккаунт не найден. Перепроверьте данные';

export const loginCustomer = (data: { email: string; password: string }, messageApi: MessageInstance) => {
  const customer = createExistingFlow()
    .me()
    .login()
    .post({ body: { ...data, activeCartSignInMode: 'MergeWithExistingCustomerCart' } })
    .execute();
  processRequests(customer, messageApi, { username: data.email, password: data.password }, messageError);
  return customer;
};
