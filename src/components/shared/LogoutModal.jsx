import React from 'react';
import { setToken } from '../../services/userService'; 

const LogoutModal = () => {
  const handleLogout = () => {
    setToken(null); 
    window.location.href = '/login';
  };

  return (
    <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Готові вийти?</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">Виберіть "Вийти", якщо ви готові завершити поточну сесію.</div>
          <div className="modal-footer">
            <button className="btn btn-secondary" type="button" data-dismiss="modal">Скасувати</button>
            <button className="btn btn-primary" type="button" onClick={handleLogout}>Вийти</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;