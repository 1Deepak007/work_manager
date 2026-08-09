import { getToken } from '../utils/auth';
import axios from 'axios';

export const fetchProfile = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/profile/get_my_profile', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    const data = response.data || {};
    let profilePic = data.profilePicture || '';

    // 1. Safe parsing for the image array string
    if (profilePic && profilePic.includes('base64,')) {
      const parts = profilePic.split('base64,');
      const byteString = parts[1];
      
      if (byteString && /[\d,]+$/.test(byteString)) {
        const byteArray = new Uint8Array(byteString.split(',').map(Number));
        let binary = '';
        const len = byteArray.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(byteArray[i]);
        }
        const base64String = window.btoa(binary);
        profilePic = `data:image/jpeg;base64,${base64String}`;
      }
    }

    // 2. Safe parsing for hobbies (Handles Arrays, Strings, and Null/Undefined)
    let cleanHobbies = '';
    if (Array.isArray(data.hobbies)) {
      cleanHobbies = data.hobbies.join(', ');
    } else if (typeof data.hobbies === 'string') {
      cleanHobbies = data.hobbies;
    }

    return {
      ...data,
      profilePicture: profilePic,
      hobbies: cleanHobbies,
    };
  } catch (error) {
    console.error("Error inside fetchProfile utility:", error);
    throw error; 
  }
};

export const profileCompleteness = (user) => {
    if (!user) return 0;
    const requiredFields = ['name', 'email', 'contact', 'hobbies', 'profilePicture', 'location', 'homeTown', 'profession', 'alternateEmail'];
    const filledFields = requiredFields.filter(field => {
      return user[field] && String(user[field]).trim() !== '';
    });
    return (filledFields.length / requiredFields.length) * 100;
};