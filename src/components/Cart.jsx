import React, { useState, useEffect } from 'react';
import { getUserOrders, OrderStatus, updateOrder } from '../services/orderService';
import { getCurrentUser } from '../services/userService';
import ClientTopBar from './shared/ClientTopBar';
import ClientNavBar from './shared/ClientNavBar';
import Footer from './shared/Footer';

const getStatusBadge = (status) => {
    switch (status) {
        case OrderStatus.Completed:
            return <span className="badge badge-success">Успішний</span>;
        case OrderStatus.Canceled:
            return <span className="badge badge-danger">Скасований</span>;
        default:
            return <span className="badge badge-warning">В обробці</span>;
    }
};

const Cart = () => {
    const [orders, setOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [statusFilters, setStatusFilters] = useState({
        [OrderStatus.Completed]: true,
        [OrderStatus.InProgress]: true,
        [OrderStatus.Canceled]: true
    });

    const filteredOrders = orders.filter(order => statusFilters[order.status]);

    const handleStatusFilterChange = (status) => {
        setStatusFilters(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
                const userOrders = await getUserOrders(user.id);
                setOrders(userOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchData();
    }, []);

    const handleCancel = async (orderId) => {
        try {
            await updateOrder({
                id: orderId,
                status: OrderStatus.Canceled,
            });
            const updatedOrders = await getUserOrders(currentUser.id);
            setOrders(updatedOrders);
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const handleDownload = (mediaUrl) => {
        window.open(mediaUrl, '_blank');
    };

    return (
        <>
            <ClientTopBar />
            <ClientNavBar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <nav className="breadcrumb bg-light mb-30">
                            <a className="breadcrumb-item text-dark" href="/">Головна</a>
                            <span className="breadcrumb-item active">Кошик</span>
                        </nav>
                    </div>
                </div>
                <div className="row px-xl-5 mb-3">
                    <div className="col-12">
                    <div className="bg-light p-4 mb-30">
                        <form>
                            <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="statusCompleted"
                                    checked={statusFilters[OrderStatus.Completed]}
                                    onChange={() => handleStatusFilterChange(OrderStatus.Completed)}
                                />
                                <label className="custom-control-label" htmlFor="statusCompleted">
                                    Успішні замовлення
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="statusInProgress"
                                    checked={statusFilters[OrderStatus.InProgress]}
                                    onChange={() => handleStatusFilterChange(OrderStatus.InProgress)}
                                />
                                <label className="custom-control-label" htmlFor="statusInProgress">
                                    В обробці
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="statusCanceled"
                                    checked={statusFilters[OrderStatus.Canceled]}
                                    onChange={() => handleStatusFilterChange(OrderStatus.Canceled)}
                                />
                                <label className="custom-control-label" htmlFor="statusCanceled">
                                    Скасовані
                                </label>
                            </div>
                            </form>
                        </div>
                        
                    </div>
                </div>

            </div>

            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-12">
                        <div className="table-responsive mb-5">
                            <table className="table table-light table-borderless table-hover text-center mb-0">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Продукти</th>
                                        <th>Ціна</th>
                                        <th>Створено (UTC)</th>
                                        <th>Статус замовлення</th>
                                        <th>Скасувати</th>
                                        <th>Завантажити</th>
                                    </tr>
                                </thead>
                                <tbody className="align-middle">
                                    {filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="align-middle px-4">
                                                <div className="row align-items-center">
                                                    <div className="col-6 text-right">
                                                        <img
                                                            src={order.product.previewUrl || "img/product-1.jpg"}
                                                            alt={order.product.name}
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div className="col-6 text-left">
                                                        <span>{order.product.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="align-middle">${order.price.toFixed(2)}</td>
                                            <td className="align-middle">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td className="align-middle">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="align-middle">
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleCancel(order.id)}
                                                    disabled={order.status !== OrderStatus.InProgress}>
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </td>
                                            <td className="align-middle">
                                                <button
                                                    className="btn btn-sm btn-info"
                                                    onClick={() => handleDownload(order.product.mediaUrl)}
                                                    disabled={order.status !== OrderStatus.Completed}>
                                                    <i className="fa fa-download"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Cart;