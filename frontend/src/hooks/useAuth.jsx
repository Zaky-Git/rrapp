/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import axiosClient from 'src/services/axios-client';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axiosClient
        .post('/validate-token')
        .then((response) => {
          if (response.data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return { isAuthenticated, loading };
};

export const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <ClipLoader size={50} color="#000" loading={loading} />
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <ClipLoader size={50} color="#000" loading={loading} />
      </div>
    );
  }

  return !isAuthenticated ? children : null;
};
