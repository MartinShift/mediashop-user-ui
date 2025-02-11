import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_ADMIN_URL, getCurrentUser, getToken, handleAdminRedirect } from '../../services/userService';

const ClientTopBar = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/signin';
  };

  return (
    <div className="container-fluid">
      <div className="row align-items-center bg-light py-3 px-xl-5 d-lg-flex">
        <div className="col-lg-4 col-12 text-left">
          {/* <div>
          <Link to="/" className="text-decoration-none">
            <span className="h1 text-uppercase text-dark bg-primary px-2">Media</span>
            <span className="h1 text-uppercase text-primary bg-dark px-2 ml-n1">Shop</span>
          </Link>
          </div> */}
        </div>

        <div className="col-lg-4 col-6 text-left">

        </div>

        <div className="col-lg-4 col-6 text-right">
          {!isLoading && (
            <div className="position-relative">
              <div 
                className="nav-link dropdown-toggle d-flex align-items-center justify-content-end"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                {user ? (
                  <>
                    <span className="mr-2 d-none d-lg-inline text-dark medium">
                      {user.visibleName}
                    </span>
                    {user.avatarUrl && (
                      <img
                        className="img-profile rounded-circle ml-2"
                        src={user.avatarUrl}
                        alt="Аватар користувача"
                        style={{ width: '30px', height: '30px' }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <span className="mr-2">Не авторизовано</span>
                  </>
                )}
              </div>

              <div className={`dropdown-menu dropdown-menu-right ${showDropdown ? 'show' : ''}`}
                   style={{ position: 'absolute', right: 0, zIndex: 1000 }}>
                {user ? (
                  <>
                    <Link to={`/profile/view/${user.id}`} className="dropdown-item">Переглянути профіль</Link>
                    <Link to="/profile/edit" className="dropdown-item">Редагувати профіль</Link>
                    <Link to="/cart" className="dropdown-item">Кошик</Link>
                    <button onClick={handleAdminRedirect} className="dropdown-item">Створити товар</button>
                    <a onClick={handleLogout} className="dropdown-item" style={{ cursor: 'pointer' }}>Вийти</a>
                  </>
                ) : (
                  <>
                    <Link to="/signin" className="dropdown-item">Увійти</Link>
                    <Link to="/signup" className="dropdown-item">Зареєструватись</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientTopBar;