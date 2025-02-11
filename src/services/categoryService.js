import { headers, authHeaders, BASE_ROOT } from './userService';


const BASE_URL = `${BASE_ROOT}/categories`;

export const getCategories = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getCategory = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getTopCategories = async () => {
  const response = await fetch(`${BASE_URL}/top`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};


export const createCategory = async (categoryDto) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(categoryDto),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }
  return response.json();
};

export const updateCategory = async (categoryDto) => {
  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(categoryDto),
  });
  return response.json();
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return response.json();
};

export const getCategoryByName = async (name) => {
  const response = await fetch(`${BASE_URL}/name?name=${name}`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const searchCategories = async (query) => {
  const response = await fetch(`${BASE_URL}/search?query=${query}`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};