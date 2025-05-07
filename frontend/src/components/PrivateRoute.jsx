// src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/", // À adapter en prod avec .env
});

export default api;
