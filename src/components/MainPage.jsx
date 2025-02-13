import React, { useState, useEffect } from 'react';
import ClientNavBar from './shared/ClientNavBar';
import ProductContainer from './shared/ProductContainer';
import { getFeaturedProducts, getRecentProducts } from '../services/productService';
import ClientTopBar from './shared/ClientTopBar';
import Footer from './shared/Footer';
import { getToken, setToken } from '../services/userService';
import { useNavigate } from 'react-router-dom';
const MainPage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let token = params.get('token');
        if (token == null) {
            token = getToken();
        }
        else if(token) {
            setToken(token);  
            navigate('/index');
        }
        else {

            navigate('/signin');
        }
    }, []);
  

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [featured, recent] = await Promise.all([
                    getFeaturedProducts(),
                    getRecentProducts()
                ]);
                setFeaturedProducts(featured);
                setRecentProducts(recent);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <ClientTopBar />
            <ClientNavBar />

            <div className="container-fluid py-5 bg-secondary">
            <div className="container">
                <div className="text-center">
                    <h1 className="text-uppercase mb-4">Ласкаво просимо до Media Shop</h1>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <p className="lead text-dark mb-4">
                                Media Shop - ваш надійний партнер у світі цифрових розваг. 
                                Ми пропонуємо широкий вибір товарів за найкращими цінами. 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            <div className="container-fluid pt-5 pb-3">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
                    <span className="bg-secondary pr-3">Найновіші товари</span>
                </h2>
                <div className="row px-xl-5">
                    {isLoading ? (
                        <div>Завантаження...</div>
                    ) : (
                        recentProducts.map(product => (
                            <ProductContainer key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
            
        <Footer />
        </div>
    );
};

export default MainPage;