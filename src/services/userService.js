export const BASE_ROOT = 'https://mediashop-api.azurewebsites.net/api';
export const BASE_ADMIN_URL = `https://lemon-mushroom-04b813c03.4.azurestaticapps.net`;
export const BASE_CLIENT_URL = `https://jolly-ocean-0cf2f9c03.4.azurestaticapps.net`;
export const BASE_URL = `${BASE_ROOT}/users`;

let token = localStorage.getItem('token');
let currentUser = null;

export const handleAdminRedirect = (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  
  if (token) {
    const encodedToken = encodeURIComponent(token);
    window.location.href = `${BASE_ADMIN_URL}?token=${encodedToken}`;
  }
  else 
  {
    window.location.href = `${BASE_ADMIN_URL}/signin`;
  }
};

export const handleUserRedirect = (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (token) {
    const encodedToken = encodeURIComponent(token);
    window.location.href = `${BASE_CLIENT_URL}/index?token=${encodedToken}`;
  }
  else 
  {
    window.location.href = `${BASE_CLIENT_URL}/signin`;
  }
};



export const setToken = (newToken) => {
    token = newToken;
    currentUser = null;
    localStorage.setItem('token', newToken);
  };

export const getToken = () =>{
 
  if(token == null)
  {
    console.log('Token:', token);
    token = localStorage.getItem('token');
  }
  return token;
}
  
 export const headers = () => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
  });

  export const authHeaders = () => ({
    ...(token && { Authorization: token }),
  });
  
  

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

  export const getUserProfileById = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/profile`, {
      method: 'GET',
      headers: headers(),
    });
    return response.json();
  };

  export const getCurrentUser = async () => {

    const urlParams = new URLSearchParams(window.location.search);
    let paramsToken = urlParams.get('token');
    if (paramsToken) {
      try {
        setToken(paramsToken);
        currentUser = null;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
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