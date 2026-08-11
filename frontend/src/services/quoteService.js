import API from './api';

export const generateQuoteAI = async (payload) => {
  const response = await API.post('/quotes/generate', payload);
  return response.data;
};

export const createQuote = async (payload) => {
  const response = await API.post('/quotes', payload);
  return response.data;
};

export const getQuotes = async (params = {}) => {
  const response = await API.get('/quotes', { params });
  return response.data;
};

export const getQuoteById = async (id) => {
  const response = await API.get(`/quotes/${id}`);
  return response.data;
};

export const updateQuote = async (id, payload) => {
  const response = await API.put(`/quotes/${id}`, payload);
  return response.data;
};

export const deleteQuote = async (id) => {
  const response = await API.delete(`/quotes/${id}`);
  return response.data;
};

export const duplicateQuote = async (id) => {
  const response = await API.post(`/quotes/${id}/duplicate`);
  return response.data;
};
