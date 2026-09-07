import { test } from '../_fixtures/fixtures';
import {
  EMPTY_USERNAME_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  EMPTY_PASSWORD_MESSAGE,
} from '../../src/ui/constants/authErrorMessages';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';

const user = generateNewUserData();
const testParameters = [
  {
    email: user.email,
    password: user.password,
    username: '',
    message: EMPTY_USERNAME_MESSAGE,
    title: 'empty username',
  },
  {
    email: '',
    password: user.password,
    username: user.username,
    message: INVALID_EMAIL_MESSAGE,
    title: 'empty email',
  },
  {
    email: user.email,
    password: '',
    username: user.username,
    message: EMPTY_PASSWORD_MESSAGE,
    title: 'empty password',
  },
];

testParameters.forEach(({ email, password, username, message, title }) => {
  test.describe('Sign up negative tests', () => {
    test(`Sign up with ${title}`, async ({ signUpPage }) => {
      await signUpPage.open();
      await signUpPage.fillEmailField(email);
      await signUpPage.fillUsernameField(username);
      await signUpPage.fillPasswordField(password);
      await signUpPage.clickSignUpButton();

      await signUpPage.assertErrorMessageContainsText(message);
    });
  });
});
