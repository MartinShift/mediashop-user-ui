import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTopCategories } from '../../services/categoryService';
import { getCurrentUser, getToken, handleAdminRedirect } from '../../services/userService';

const ClientNavBar = () => {
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showPagesDropdown, setShowPagesDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

      useEffect(() => {
        const checkAuth = async () => {
          const token = getToken();
          if (token) {
            try {
              const userData = await getCurrentUser();
              setUser(userData);
            } catch (error) {
              console.error('Failed to fetch user:', error);
            }
          }
          setIsLoading(false);
        };
    
        checkAuth();
      }, []);

      const handleCategoryClick = (categoryId) => {
        console.log('Category clicked:', categoryId);
        navigate(`/shop?category=${categoryId}`);
    };


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getTopCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

      return (
        <div className="container-fluid bg-dark mb-30">
            <div className="row px-xl-5">
                <div className="col-lg-3 d-none d-lg-block">
                    <a className="btn d-flex align-items-center justify-content-between bg-primary w-100" 
                       onClick={() => setShowCategories(!showCategories)}
                       style={{ height: '65px', padding: '0 30px', cursor: 'pointer' }}>
                        <h6 className="text-dark m-0"><i className="fa fa-bars mr-2"></i>Категорії</h6>
                        <i className="fa fa-angle-down text-dark"></i>
                    </a>
                    <nav className={`position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light ${showCategories ? 'show' : 'collapse'}`}
                         style={{ width: 'calc(100% - 30px)', zIndex: 999 }}>
                        <div className="navbar-nav w-100">
                            {categories.map(category => (
                                <div key={category.id} 
                                   onClick={() => handleCategoryClick(category.id)}
                                   className="nav-item nav-link"
                                   type="button"
                                   style={{ cursor: 'pointer' }}>
                                    {category.name}
                                </div>
                            ))}
                        </div>
                    </nav>
                </div>
                <div className="col-lg-9">
                    
                    <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                        <button type="button" 
                                className="navbar-toggler" 
                                onClick={() => setShowMobileMenu(!showMobileMenu)}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={`collapse navbar-collapse justify-content-between ${showMobileMenu ? 'show' : ''}`}>
                            <div className="navbar-nav mr-auto py-0">
                                <Link to="/" className="nav-item nav-link">Головна</Link>
                                <Link to="/shop" className="nav-item nav-link">Магазин</Link>
                                <div onClick={handleAdminRedirect} type="button" className="nav-item nav-link">Створити</div>
                            </div>
                        </div>
                        {!isLoading && (
                        <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
                            <Link to="/cart" className="btn px-0 ml-3">
                                <i className="fas fa-shopping-cart text-primary"></i>
                                <span className="badge text-secondary border border-secondary rounded-circle">{user?.orderCount}</span>
                            </Link>
                        </div>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
};


export default ClientNavBar; 