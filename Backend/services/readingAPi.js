const API_BASE_URL = 'http://localhost:3001/api';

export const getReadingProgress = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/reading/${bookId}`, {
    credentials: 'include'
  });
  return await response.json();
};

export const saveReadingProgress = async (bookId, percentage, isReading) => {
  const response = await fetch(`${API_BASE_URL}/reading/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ percentage, isReading })
  });
  return await response.json();
};

export const getBooksInProgress = async () => {
  const response = await fetch(`${API_BASE_URL}/reading`, {
    credentials: 'include'
  });
  return await response.json();
};