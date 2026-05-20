// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const mockEnv = {
  REACT_APP_FIREBASE_API_KEY: 'mock-api-key',
  REACT_APP_FIREBASE_AUTH_DOMAIN: 'mock.firebaseapp.com',
  REACT_APP_FIREBASE_PROJECT_ID: 'mock-project',
  REACT_APP_FIREBASE_STORAGE_BUCKET: 'mock-project.appspot.com',
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
  REACT_APP_FIREBASE_APP_ID: '1:000000000000:web:mock',
};
Object.entries(mockEnv).forEach(([k, v]) => {
  process.env[k] = v;
});
