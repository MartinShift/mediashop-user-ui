export const BASE_ROOT = 'https://mediashop-api.azurewebsites.net/api';
export const BASE_ADMIN_URL = `https://lemon-mushroom-04b813c03.4.azurestaticapps.net`;
export const BASE_CLIENT_URL = `https://jolly-ocean-0cf2f9c03.4.azurestaticapps.net`;
//export const BASE_ADMIN_URL = `http://localhost:5173`;
//export const BASE_CLIENT_URL = `http://localhost:5174`;
export const BASE_URL = `${BASE_ROOT}/users`;

let token = localStorage.getItem('token');
let currentUser = null;
export const setToken = (newToken) => {
    token = newToken;
    currentUser = null;
    localStorage.setItem('token', newToken);
  };

export const getToken = () =>{
  return token;
}
  
 export const headers = () => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
  });

  export const authHeaders = () => ({
    ...(token && { Authorization: token }),
  });
  
  export const handleAdminRedirect = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      const encodedToken = encodeURIComponent(token);
      window.location.href = `${BASE_ADMIN_URL}/admin/products?token=${encodedToken}`;
    }
    else 
    {
      window.location.href = `${BASE_ADMIN_URL}/signin`;
    }
  };
    export const getUserProfileById = async (id) => {
      const response = await fetch(`${BASE_URL}/${id}/profile`, {
        method: 'GET',
        headers: headers(),
      });
      return response.json();
    };
  
    export const checkAndSetTokenFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      if (tokenFromUrl) {
        setToken(tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
      }
      return false;
    };
    
    // Modify handleUserRedirect to include user data
    export const handleUserRedirect = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const encodedToken = encodeURIComponent(token);
          window.location.href = `${BASE_CLIENT_URL}/index?token=${encodedToken}`;
        } catch (error) {
          console.error('Error getting user data:', error);
          window.location.href = `${BASE_CLIENT_URL}/signin`;
        }
      } else {
        window.location.href = `${BASE_CLIENT_URL}/signin`;
      }
    };

  export const register = async (formData) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let the browser set it with the boundary
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }
    return response.json();
  };

export const authenticate = async (loginDto) => {
    const response = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(loginDto),
    });
    const data = await response.json();
    setToken(data.token);
    return data;
  };

export const getUserById = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: headers(),
    });
    return response.json();
  };

  export const getCurrentUser = async () => {

    if(currentUser != null)
    {
      return currentUser;
    }
    const response = await fetch(`${BASE_URL}/current`, {
      method: 'GET',
      headers: headers(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }
    const data = await response.json();
    currentUser = data;
    return data;
  };
  


export const getUserByEmail = async (email) => {
  const response = await fetch(`${BASE_URL}/email?email=${email}`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getUserByName = async (name) => {
  const response = await fetch(`${BASE_URL}/login?name=${name}`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const updateUser = async (formData) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });
  return response.json();
};
export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return response.json();
};

export const getUserRoles = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/roles`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};

export const getUserAdmin = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/admin`, {
    method: 'GET',
    headers: headers(),
  });
  return response.json();
};