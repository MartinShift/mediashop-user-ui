import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfileById } from '../services/userService';
import ProductContainer from './shared/ProductContainer';
import ClientTopBar from './shared/ClientTopBar';
import ClientNavBar from './shared/ClientNavBar';
import Footer from './shared/Footer';

const UserProfile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserProfileById(id);
                console.log(data);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const decimal = rating % 1;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<small key={i} className="fa fa-star text-primary mr-1"></small>);
            } else if (i === fullStars && decimal >= 0.4) {
                stars.push(<small key={i} className="fa fa-star-half-alt text-primary mr-1"></small>);
            } else {
                stars.push(<small key={i} className="far fa-star text-primary mr-1"></small>);
            }
        }
        return stars;
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <ClientTopBar />
            <ClientNavBar />

            <div className="container">
                <div className="profile-container">
                    <img src={userData.avatarUrl} className="profile-image" alt={userData.visibleName} />
                    <div className="profile-details justify-content-center">
                        <div className="d-flex flex-row justify-content-center align-items-center">
                            <h1>{userData.visibleName}</h1>
                        </div>
                        <p>{userData.userName}</p>
                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start">
                            <h5 className="mr-md-2 mb-2 mb-md-0">Середня оцінка товарів:</h5>
                            <div className="d-flex align-items-center justify-content-center" style={{ minWidth: '200px' }}>
                                <div className="text-primary mb-0">
                                    {renderStars(userData.averageRating)}
                                </div>
                                <h4 className="ml-3 mb-0">{userData.averageRating} / 5</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-left row">
                    <h6 className="text-muted mb-2 ml-2">Про користувача:</h6>
                    <p className="text-dark ml-3" style={{ fontSize: '0.9rem' }}>
                        {userData.about || 'Опис відсутній'}
                    </p>
                </div>
            </div>

            {/* Popular Products Section */}
            <div className="container-fluid pt-5 pb-3 mt-5">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
                    <span className="bg-secondary pr-3">Найпопулярніші продукти</span>
                </h2>
                <div className="row px-xl-5">
                    {userData.products?.slice(0, 8).map(product => (
                        <ProductContainer key={product.id} product={product} />
                    ))}
                </div>
            </div>

            {/* Recent Reviews Section */}
            <div className="container-fluid pt-5 pb-3">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
                    <span className="bg-secondary pr-3">Останні відгуки</span>
                </h2>
                <div className="row px-xl-5 justify-content-center">
                    <div className="col-lg-10">
                        {userData.reviews?.slice(0, 10).map(review => (
                            <div key={review.id} className="col-12 bg-light mb-3 p-4">
                                <div className="d-flex">
                                    <div className="mr-4" style={{ minWidth: '100px' }}>
                                        <a href={`/product/${review.product.id}`}>
                                            <img 
                                                src={review.product.previewUrl || "img/product-1.jpg"} 
                                                alt={review.product.name}
                                                className="img-fluid"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                        </a>
                                    </div>
                                    <div className="flex-grow-1 pr-4">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6>
                                                    <a href={`/product/${review.product.id}`} 
                                                       className="text-dark text-decoration-none hover-primary">
                                                        Продукт: {review.product.name}
                                                    </a>
                                                </h6>
                                                <p>{review.text}</p>
                                            </div>
                                            <div className="text-right ml-3" style={{ minWidth: '120px' }}>
                                                <div>{renderStars(review.rating)}</div>
                                                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
export default UserProfile;