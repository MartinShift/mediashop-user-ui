import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const ShopProductContainer = ({ product }) => {
    return (
        <div className="col-lg-4 col-md-6 col-sm-6 pb-1">
            <div className="product-item bg-light mb-4">
                <div className="product-img position-relative overflow-hidden">
                    <img 
                        className="img-fluid w-100" 
                        src={product.previewUrl || "img/product-1.jpg"} 
                        alt={product.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="product-action">
                        <Link to={`/product/${product.id}`} className="btn btn-outline-dark btn-square">
                            <i className="fa fa-shopping-cart"></i>
                        </Link>
                        <Link to={`/product/${product.id}`} className="btn btn-outline-dark btn-square">
                            <i className="fa fa-search"></i>
                        </Link>
                    </div>
                </div>
                <div className="text-center py-4">
                    <Link to={`/product/${product.id}`} className="h6 text-decoration-none text-truncate">
                        {product.name}
                    </Link>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <h5>${product.price.toFixed(2)}</h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-1">
                        <StarRating rating={product.averageRating} />
                        <small className="ml-2">({product.reviewCount})</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProductContainer;