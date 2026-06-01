import axios from "axios";
import { API_BASE_URL } from "../../util/contants";

const CART_URL = `${API_BASE_URL}/cart`;

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// Add item to cart
export const addToCart = async (foodId, token) => {
  try {
    const response = await axios.post(
      CART_URL,
      { foodId },
      { headers: authHeader(token) }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error);
    throw error;
  }
};

// Remove one quantity from cart
export const removeQtyFromCart = async (foodId, token) => {
  try {
    const response = await axios.post(
      `${CART_URL}/remove`,
      { foodId },
      { headers: authHeader(token) }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error.response?.data || error);
    throw error;
  }
};

// Get cart data — returns the items map { foodId: quantity }
export const getCartData = async (token) => {
  try {
    const response = await axios.get(CART_URL, { headers: authHeader(token) });
    // BUG FIX 4: backend returns { id, userId, items: {...} }
    // items can be null if cart is brand new — default to {}
    return response.data.items ?? {};
  } catch (error) {
    console.error("Error fetching cart:", error.response?.data || error);
    throw error;
  }
};

// Clear entire cart
// BUG FIX 4: backend endpoint is DELETE /api/cart (not /api/cart/clear)
export const clearCart = async (token) => {
  try {
    const response = await axios.delete(CART_URL, {
      headers: authHeader(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error.response?.data || error);
    throw error;
  }
};
