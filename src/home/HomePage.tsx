import React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { AuthenticatedTemplate } from '@azure/msal-react';
import MyInfo from './MyInfo';

function HomePage() {
  const isAuthenticated = useIsAuthenticated();
  return (
    <>
      <h2>Home</h2>
      <p>Is authenticated?</p>{isAuthenticated ? <p>yes</p>: <p>no</p>}
      <AuthenticatedTemplate>
        <MyInfo />
      </AuthenticatedTemplate>
    </>
  );
}

export default HomePage;