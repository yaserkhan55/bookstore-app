const API_BASE_URL = 'http://localhost:3001/api';

export const getWishlist = async () => {
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    credentials: 'include'
  });
  return await response.json();
};

export const addToWishlist = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${bookId}`, {
    method: 'POST',
    credentials: 'include'
  });
  return await response.json();
};

export const removeFromWishlist = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${bookId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return await response.json();
};