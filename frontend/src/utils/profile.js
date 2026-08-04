import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';
import axios from 'axios';

export const fetchProfile = async (setUser) => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setUser({
          ...response.data,
          hobbies: response.data.hobbies ? response.data.hobbies.join(', ') : '',
        });
      } catch {
        toast.error('Failed to load profile');
      }
};

export const profileCompleteness = (user) => {
    if (!user) return 0;
    const requiredFields = ['name', 'email', 'contact', 'hobbies', 'profilePicture'];
    const filledFields = requiredFields.filter(field => user[field] && user[field].trim() !== '');
    return (filledFields.length / requiredFields.length) * 100;
}