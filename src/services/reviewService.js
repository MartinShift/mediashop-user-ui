import { BASE_ROOT } from './userService';
import { headers } from './userService';

const REVIEW_URL = `${BASE_ROOT}/reviews`;



export const getReview = async (id) => {
    const response = await fetch(`${REVIEW_URL}/${id}`, {
        method: 'GET',
        headers: headers(),
    });
    return response.json();
};

export const createReview = async (reviewDto) => {
    const response = await fetch(`${REVIEW_URL}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(reviewDto),
    });
    return response.json();
};

export const updateReview = async (reviewDto) => {
    const response = await fetch(`${REVIEW_URL}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(reviewDto),
    });
    return response.json();
};

export const deleteReview = async (id) => {
    const response = await fetch(`${REVIEW_URL}/${id}`, {
        method: 'DELETE',
        headers: headers(),
    });
    return response.ok;
};

export const getReviewsByProduct = async (productId) => {
    const response = await fetch(`${REVIEW_URL}/product?productId=${productId}`, {
        method: 'GET',
        headers: headers(),
    });
    return response.json();
};

export const getReviewsByUser = async (userId) => {
    const response = await fetch(`${REVIEW_URL}/user?userId=${userId}`, {
        method: 'GET',
        headers: headers(),
    });
    return response.json();
};