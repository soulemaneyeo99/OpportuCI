import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/'; // Django local

export const login = async (email, password) => {
  return axios.post(API_URL + 'login/', {
    email,
    password,
  });
};

export const register = async (username, email, password) => {
  return axios.post(API_URL + 'register/', {
    username,
    email,
    password,
  });
};
