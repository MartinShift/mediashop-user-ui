import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authenticate } from '../services/userService';

const SignIn = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await authenticate(formData);
    console.log(response);
    if (response.token) {
      localStorage.setItem('token', response.token);
      navigate('/admin/products');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Помилка автентифікації',
        text: response.Message || 'Виникла помилка під час автентифікації',
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-xl-4 col-lg-6 col-md-8">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12 col-sm-12">
            <div className="p-5">
              <div className="text-center">
                <h1 className="h4 text-gray-900 mb-4">Вхід до системи</h1>
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
                    placeholder="Введіть email або логін..."
                    required
                  />
                </div>
                <div className="form-group">
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
                <div className="form-group">
                  <div className="custom-control custom-checkbox small">
                    <input type="checkbox" className="custom-control-input" id="customCheck" />
                    <label className="custom-control-label" htmlFor="customCheck">
                      Запам'ятати мене
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-user btn-block">
                  Увійти
                </button>
                <hr />
              </form>
              <div className="text-center mt-3">
                <a className="small custom-link" href="/signup">
                  Створити обліковий запис
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;