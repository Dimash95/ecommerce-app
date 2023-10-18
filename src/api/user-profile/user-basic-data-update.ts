import { apiRoot } from '../api-root';
import { MessageInstance } from 'antd/es/message/interface';

interface BasicInfoBody {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

enum MessageForError {
  'existingCustomerEmail' = 'Данная почта занята',
}

enum ErrorMessage {
  'existingCustomerEmail' = 'There is already an existing customer with the provided email.',
}

export const updateUserBasicData = async (
  userId: string,
  version: number,
  body: BasicInfoBody,
  messageApi: MessageInstance
) => {
  return apiRoot
    .customers()
    .withId({ ID: userId })
    .post({
      body: {
        version: version,
        actions: [
          {
            action: 'setFirstName',
            firstName: body.firstName,
          },
          {
            action: 'setLastName',
            lastName: body.lastName,
          },
          {
            action: 'changeEmail',
            email: body.email,
          },
          {
            action: 'setDateOfBirth',
            dateOfBirth: body.dateOfBirth,
          },
        ],
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
        case ErrorMessage.existingCustomerEmail:
          messageApi.error(MessageForError.existingCustomerEmail);
          break;
        default:
          messageApi.error(error.message);
          break;
      }
    });
};
