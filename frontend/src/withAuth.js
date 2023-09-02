import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    navigate('/login');
    return null;
  };

  return AuthenticatedComponent;
};

export default withAuth;
