import validator from 'validator';
import { postcodeValidator } from 'postcode-validator';

const calculateAge = (birthdate: string) => {
  const currentDate = new Date();
  const birthDate = new Date(birthdate);
  const ageDifferent = currentDate.getFullYear() - birthDate.getFullYear();
  return ageDifferent;
};

export const createErrorMessage = (fieldName: string, value: string) => {
  let errorMessage = '';

  if (value === '') {
    return 'Обязатльное поле для заполнения';
  }

  switch (fieldName) {
    case 'email':
      if (!validator.isEmail(value)) {
        errorMessage = 'Некорректный адрес электронной почты';
      }
      break;
    case 'password':
    case 'newPassword':
    case 'currentPassword':
      if (!validator.isStrongPassword(value, { minSymbols: 0 })) {
        errorMessage = 'Минимум 8 символов, не менее 1 прописной буквы, 1 строчной буквы и 1 цифры';
      }
      break;
    case 'firstName':
    case 'lastName':
      if (!validator.isAlpha(value, 'ru-RU')) {
        errorMessage = 'Имя и фамилия должны содержать только буквы кириллицей';
      }
      break;
    case 'postCodeShipping':
    case 'postCodeBilling':
    case 'postalCode':
      if (!validator.isNumeric(value) && !postcodeValidator(`${value}`, 'KZ')) {
        errorMessage = 'Введите существующий индекс в Казахстане';
      }
      break;
    case 'cityBilling':
    case 'cityShipping':
    case 'city':
      if (!validator.isAlpha(value, 'ru-RU', { ignore: ' -' })) {
        errorMessage = 'Название должно состоять из кириллицы без спец. символов и чисел';
      }
      break;
    case 'dateOfBirth':
      if (calculateAge(value) <= 13) {
        errorMessage = 'Ограничения на сайте: пользователю должно быть 13 лет и больше';
      }
      break;
    default:
      break;
  }
  return errorMessage;
};
