import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMediaTypeName, getProductDetail } from '../services/productService';
import { createReview } from '../services/reviewService';
import { getCurrentUser, getToken } from '../services/userService';
import ClientTopBar from './shared/ClientTopBar';
import ClientNavBar from './shared/ClientNavBar';
import OrderModal from './shared/OrderModal';
import Footer from './shared/Footer';
import StarRating from './shared/StarRating';
import { createOrder } from '../services/orderService';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const hasCompletedOrder = () => {
        return product?.orders?.some(order =>
            order.userId === currentUser?.id &&
            order.status === OrderStatus.Completed
        );
    };

    const handlePlaceOrder = async () => {
        try {
            const orderDto = {
                userId: currentUser.id,
                productId: product.id,
                price: product.price
            };
            await createOrder(orderDto);
            navigate('/cart');
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
                const productDetail = await getProductDetail(id);
                setProduct(productDetail.product);
                setReviews(productDetail.reviews);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmitReview = async (e) => {
        if (getToken() == null) {
            window.location.href = '/signin';
        }
        e.preventDefault();
        try {
            const reviewDto = {
                productId: parseInt(id),
                rating,
                text: reviewText,
                userId: currentUser.id
            };
            await createReview(reviewDto);
            const productDetail = await getProductDetail(id);
            setReviews(productDetail.reviews);
            setRating(0);
            setReviewText('');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (loading) return <div>Завантаження...</div>;
    if (!product) return <div>Товар не знайдено</div>;

    const hasUserReviewed = reviews.some(review => review.userId === currentUser?.id);

    return (
        <>
            <ClientTopBar />
            <ClientNavBar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    <div className="col-lg-5 mb-30">
                        <img className="w-100 h-100" src={product.mediaUrl || 'img/product-1.jpg'} alt={product.name} />
                    </div>
                    <div className="col-lg-7 h-auto mb-30">
                        <div className="h-100 bg-light p-30">
                            <h3>{product.name}</h3>
                            <div className="d-flex mb-3">
                                <StarRating rating={product.averageRating} />
                                <small className="pt-1 ml-2">({reviews.length} відгуків)</small>
                            </div>
                            <h3 className="font-weight-semi-bold mb-4">${product.price.toFixed(2)}</h3>
                            <p className="mb-4">{product.description}</p>
                            <div className="d-flex align-items-center mb-4 pt-2">
                                {currentUser && hasCompletedOrder() ? (
                                    <button className="btn btn-success px-3" disabled>
                                        <i className="fa fa-check mr-1"></i>
                                        У вас вже є цей продукт
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary px-3"
                                        onClick={() => setShowModal(true)}>
                                        <i className="fa fa-shopping-cart mr-1"></i>
                                        Замовити
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row px-xl-5">
                    <div className="col">
                        <div className="bg-light p-30">
                            <div className="nav nav-tabs mb-4">
                                <button className={`nav-item nav-link text-dark ${activeTab === 'description' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('description')}>
                                    Опис
                                </button>
                                <button className={`nav-item nav-link text-dark ${activeTab === 'reviews' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('reviews')}>
                                    Відгуки ({reviews.length})
                                </button>
                            </div>

                            <div className="tab-content">
                                {activeTab === 'description' && (
                                    <div className="tab-pane fade show active">
                                        <h3 className="mb-3">Опис продукту</h3>
                                        <p className="mb-4">{product.description}</p>
                                        <p className="mb-4"><strong>Тип медіа: </strong>{getMediaTypeName(product.mediaType)}</p>
                                        <p className="mb-4"><strong>Категорія: </strong>{product.category.name}</p>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="tab-pane fade show active">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h4 className="mb-4">{reviews.length} відгуків</h4>
                                                {reviews.map(review => (
                                                <div key={review.id} className="media mb-4">
                                                    <img src={review.user.avatarUrl || "img/user.jpg"}
                                                        alt={review.user.visibleName}
                                                        className="img-fluid mr-3 mt-1 rounded-circle"
                                                        style={{ width: '45px', height: '45px' }} />
                                                    <div className="media-body">
                                                        <h6>{review.user.visibleName}
                                                            <small> - <i>{new Date(review.createdAt).toLocaleDateString()}</i></small>
                                                        </h6>
                                                        <div className="text-primary mb-2">
                                                            <StarRating rating={review.rating} />
                                                        </div>
                                                        <p>{review.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            </div>

                                            {currentUser && !hasUserReviewed && (
                                                <div className="col-md-6">
                                                    <h4 className="mb-4">Залишити відгук</h4>
                                                    <form onSubmit={handleSubmitReview}>
                                                        <div className="d-flex my-3">
                                                            <p className="mb-0 mr-2">Ваша оцінка * :</p>
                                                            <div className="text-primary">
                                                            {[...Array(5)].map((_, index) => (
                                                                <i key={index}
                                                                    className={`${index < rating ? 'fas' : 'far'} fa-star`}
                                                                    onClick={() => setRating(index + 1)}
                                                                    style={{ cursor: 'pointer' }}>
                                                                </i>
                                                            ))}
                                                        </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="message">Ваш відгук *</label>
                                                            <textarea
                                                                id="message"
                                                                className="form-control"
                                                                rows="5"
                                                                value={reviewText}
                                                                onChange={(e) => setReviewText(e.target.value)}
                                                                required
                                                            ></textarea>
                                                        </div>
                                                        <div className="form-group mb-0">
                                                            <input type="submit" 
                                                                   value="Опублікувати відгук"
                                                                   className="btn btn-primary px-3"
                                                                   disabled={!rating || !reviewText} />
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OrderModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => {
                    handlePlaceOrder();
                    setShowModal(false);
                }}
                product={product} 
            />
            <Footer />
        </>
    );
};

export default ProductPage;