const API_BASE_URL = 'http://localhost:3001/api';

export const getRecommendations = async () => {
  const response = await fetch(`${API_BASE_URL}/recommendations`);
  return await response.json();
};

export const getSimilarBooks = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/recommendations/${bookId}`);
  return await response.json();
};