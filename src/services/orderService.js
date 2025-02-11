import { BASE_ROOT, headers } from './userService';

const ORDER_URL = `${BASE_ROOT}/orders`;

export const getOrders = async () => {
    const response = await fetch(ORDER_URL, {
        method: 'GET',
        headers: headers(),
    });
    return response.json();
};

export const getOrder = async (id) => {
    const response = await fetch(`${ORDER_URL}/${id}`, {
        method: 'GET',
        headers: headers(),
    });
    return response.json();
};

export const createOrder = async (orderDto) => {
    const response = await fetch(ORDER_URL, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(orderDto),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
    }
    return response.json();
};

export const updateOrder = async (orderDto) => {
    const response = await fetch(ORDER_URL, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(orderDto),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
    }
    return response.json();
};

export const deleteOrder = async (id) => {
    const response = await fetch(`${ORDER_URL}/${id}`, {
        method: 'DELETE',
        headers: headers(),
    });
    return response.ok;
};

export const getUserOrders = async (userId) => {
    const response = await fetch(`${ORDER_URL}/user?userId=${userId}`, {
        method: 'GET',
        headers: headers(),
    });
    return response.json();
};

export const OrderStatus = {
    InProgress: 0,
    Completed: 1,
    Canceled: 2
};