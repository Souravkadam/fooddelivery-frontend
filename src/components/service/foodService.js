import axios from "axios";
import { API_BASE_URL } from "../../util/contants";

const FOOD_URL = `${API_BASE_URL}/foods`;

export const fetchFoodList = async () => {
  try {
    const response = await axios.get(FOOD_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching food list:", error);
    throw error;
  }
};

export const fetchFoodDetails = async (id) => {
  try {
    const response = await axios.get(`${FOOD_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching food details:", error);
    throw error;
  }
};
