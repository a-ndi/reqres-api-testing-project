require('dotenv').config();

module.exports = {
  baseURL: process.env.API_BASE_URL || 'https://reqres.in',
  apiKey: process.env.REQRES_API_KEY,
  login: {
    email: process.env.REQRES_LOGIN_EMAIL,
    password: process.env.REQRES_LOGIN_PASSWORD,
  },
  register: {
    email: process.env.REQRES_REGISTER_EMAIL,
    password: process.env.REQRES_REGISTER_PASSWORD,
  },
};
