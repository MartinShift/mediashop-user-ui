import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/userService';
import Swal from 'sweetalert2';

const SignUp = () => {
  const [formData, setFormData] = useState({
    login: '',
    visibleName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null,
  });
  const navigate = useNavigate();



  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e, inputName) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');

    const fileInput = document.getElementById(inputName);
    fileInput.files = e.dataTransfer.files;

    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
  };

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Помилка!', 'Паролі не співпадають', 'error');
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('userName', formData.login);
    formDataToSend.append('visibleName', formData.visibleName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);
    if (formData.avatar) {
      formDataToSend.append('avatar', formData.avatar);
    }
  
    try {
      const response = await register(formDataToSend);
      if (response.user && response.token) {
        Swal.fire('Успіх!', 'Реєстрація пройшла успішно', 'success');
        localStorage.setItem('token', response.token);
        navigate('/signin');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      const errorData = JSON.parse(error.message);
      Swal.fire('Помилка!', errorData.Message, 'error');
    }
  };
  
  return (
<div className="container vh-100 d-flex align-items-center justify-content-center">
<div className="row justify-content-center w-100">
    
        <div className="col-lg-7">
          <div className="p-5">
            <div className="text-center">
              <h1 className="h4 text-gray-900 mb-4">Створити обліковий запис</h1>
            </div>
            <form className="user" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-control-user"
                  id="login"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Логін"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-control-user"
                  id="visibleName"
                  name="visibleName"
                  value={formData.visibleName}
                  onChange={handleChange}
                  placeholder="Відображуване ім'я"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control form-control-user"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email адреса"
                  required
                />
              </div>

              <div className="form-group">
                  <label htmlFor="category">Картинка</label>
                  <div className="form-group">
                    <label
                      className="drop-container"
                      id="dropcontainer-avatar"
                      htmlFor="avatar"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'avatar')}
                    >
                      <span className="drop-title">Перетягніть файл</span>
                      або
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  </div>
              <div className="form-group row">
                <div className="col-sm-6 mb-3 mb-sm-0">
                  <input
                    type="password"
                    className="form-control form-control-user"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <input
                    type="password"
                    className="form-control form-control-user"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Підтвердження паролю"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-user btn-block">
                Зареєструватися
              </button>
            </form>
            <hr />
            <div className="text-center">
              <a className="small custom-link" href="/signin">
                Вже маєте обліковий запис? Увійти!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;