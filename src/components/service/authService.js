import axios from "axios";
import { API_BASE_URL } from "../../util/contants";

export const registerUser = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/register`, data);
  return response;
};

export const login = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/login`, data);
  return response;
};
