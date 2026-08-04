import axios from 'axios';
import { toast } from 'react-toastify';



// save token
export const setToken = (token) => {
    localStorage.setItem('accessToken', token);
}

// retrieve token for axios requests auth
export const getToken = () => {
    return localStorage.getItem('accessToken');
}

// clear token on logout
export const removeToken = () => {
    localStorage.removeItem('accessToken');
}

// check if user is logged in
export const isAuthenticated = () => {
    return !!getToken();
}

// handle logout
export const handleLogout = (navigate) => {
    removeToken();
    navigate('/login', { replace: true });
}

// logout and redirect when token expires
export const logoutAndRedirect = () => {
    removeToken();
    window.location.href = '/login';
}

export const handleAuthError = (error) => {
    if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logoutAndRedirect();
    }
    return Promise.reject(error);
}

axios.interceptors.response.use(
    (response) => response,
    handleAuthError
);

export const handleSignup = async (values, setSubmitting, navigate) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/signup', values, {
            withCredentials: true,
        });

        toast.success(response.data.message || 'Account created successfully!');

        // Store token if returned on signup
        if (response.data.accessToken) {
            setToken(response.data.accessToken);
        }

        navigate('/dashboard');
    }
    catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong during signup!';
        toast.error(errorMessage);
    }
    finally {
        setSubmitting(false); // Re-enables form submit button
    }
};


export const handleLogin = async (values, setSubmitting, navigate) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', values, {
            withCredentials: true,
        });

        toast.success(response.data.message || 'Logged in successfully!');

        if (response.data.accessToken) {
            setToken(response.data.accessToken);
        }

        navigate('/dashboard', { replace: true });
    }
    catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong during login!';
        toast.error(errorMessage);
    }
    finally {
        setSubmitting(false);
    }
};

