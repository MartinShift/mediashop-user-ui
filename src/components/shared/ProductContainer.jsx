import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductContainer = ({ product }) => {
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const decimal = rating % 1;
        const hasHalfStar = decimal >= 0.5;

        // Add full stars
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <small key={i} className="fa fa-star text-primary mr-1"></small>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <small key={i} className="fa fa-star-half-alt text-primary mr-1"></small>
                );
            } else {
                stars.push(
                    <small key={i} className="far fa-star text-primary mr-1"></small>
                );
            }
        }
        return stars;
    };

    return (
        <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
        <div className="product-item bg-light mb-4">
            <Link 
                to={`/product/${product.id}`} 
                className="product-img position-relative overflow-hidden d-block"
                style={{ 
                    height: '300px', // Fixed height
                    width: '100%',
                    display: 'block'
                }}
            >
                <img 
                    className="img-fluid"
                    src={product.previewUrl || 'img/default-product.jpg'} 
                    alt={product.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // Maintains aspect ratio while filling container
                        objectPosition: 'center' // Centers the image
                    }}
                />
                    <div className="product-action">
                        {/* Add action buttons if needed */}
                    </div>
                </Link>
                <div className="text-center py-4">
                    <Link 
                        to={`/product/${product.id}`} 
                        className="h6 text-decoration-none text-truncate"
                    >
                        {product.name}
                    </Link>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <h5>${product.price.toFixed(2)}</h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-1">
                        {renderStars(product.averageRating)}
                        <small>({product.ratingCount || 0})</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductContainer.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        mediaUrl: PropTypes.string,
        previewUrl: PropTypes.string,
        userId: PropTypes.number,
        categoryId: PropTypes.number.isRequired,
        averageRating: PropTypes.number,
        mediaType: PropTypes.number,
        ratingCount: PropTypes.number
    }).isRequired
};

export default ProductContainer;