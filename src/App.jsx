import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LogoutModal from './components/shared/LogoutModal';
import MainPage from './components/MainPage';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import ProductPage from './components/ProductPage';
import Cart from './components/Cart';
import ShopList from './components/ShopList';

const App = () => {

  return (
    <Router>
        <Routes>
         <Route path="/index" element={<MainPage />}  />
          <Route path="/signup" element={<SignUp />} /> n           <Route path="/signin" element={<SignIn />} />
          <Route path="/profile/view/:id" element={<UserProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<ShopList />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="*" element={<Navigate to="/index" />} />
        </Routes>
      <LogoutModal />
    </Router>
  );
};

export default App; 