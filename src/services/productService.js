import { authHeaders, BASE_ROOT, getToken, setToken } from './userService';
import { headers } from './userService';

const BASE_URL = `${BASE_ROOT}/products`;

export const MediaFileType = {
  Image: 1,
  Video: 2,
  Audio: 3,
  Document: 4
};

export const getMediaTypeName = (type) => {
  return Object.keys(MediaFileType).find(key => MediaFileType[key] === type) || 'Unknown';
};

export const getProducts = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getFeaturedProducts = async () => {
  const response = await fetch(`${BASE_URL}/featured`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getRecentProducts = async () => {
  const response = await fetch(`${BASE_URL}/recent`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getProductDetail = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/detail`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};


export const createProduct = async (formData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }
  return response.json();
};

export const updateProduct = async (formData) => {
  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return response;
};

export const getProductsByUserId = async (userId) => {
  const response = await fetch(`${BASE_URL}/user/${userId}`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getFilteredProducts = async (filter) => {
  const queryParams = new URLSearchParams(filter).toString();
  const response = await fetch(`${BASE_URL}/filter?${queryParams}`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};
