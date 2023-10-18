import { MessageInstance } from 'antd/es/message/interface';
import { apiRoot } from '../api-root';

interface PasswordData {
  id: string;
  version: number;
  currentPassword: string;
  newPassword: string;
}

enum MessageForError {
  'badRequest' = 'Неправильно введенный пароль',
}

enum ErrorMessage {
  'badRequest' = 'The given current password does not match.',
}

export const updatePassword = async (
  { id, version, currentPassword, newPassword }: PasswordData,
  messageApi: MessageInstance
) => {
  return apiRoot
    .customers()
    .password()
    .post({
      body: {
        id: id,
        version: version,
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
    })
    .execute()
    .then((response) => {
      messageApi.destroy();
      messageApi.success('Успешно!');
      return response.body;
    })
    .catch((error) => {
      messageApi.destroy();

      switch (error.message) {
        case ErrorMessage.badRequest:
          messageApi.error(MessageForError.badRequest);
          break;
        default:
          messageApi.error(error.message);
          break;
      }
    });
};
