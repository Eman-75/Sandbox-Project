import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../src/api/axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/users/me');
      setProfile(res.data);
    } catch (err) {
      console.error('User not logged in or profile missing');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await axios.patch('/users/update-profile', updatedData);
      setProfile(res.data.updatedProfile);
      return { success: true, data: res.data.updatedProfile };
    } catch (err) {
      console.error('Update failed:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Update failed',
      };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        loading,
        refreshProfile: fetchProfile,
        BASE_URL: import.meta.env.VITE_BACKEND_URL,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
