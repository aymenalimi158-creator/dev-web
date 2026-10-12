import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/products/';

export const getProducts = () => axios.get(API_URL);
export const createProduct = (product) => axios.post(API_URL, product);
export const updateProduct = (id, product) => axios.put(`${API_URL}${id}`, product);
export const deleteProduct = (id) => axios.delete(`${API_URL}${id}`);
