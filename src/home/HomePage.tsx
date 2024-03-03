import React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import MyInfo from './MyInfo';

function HomePage() {
  const isAuthenticated = useIsAuthenticated();
  return (
    <>
      <UnauthenticatedTemplate>
      <h2>Welcome to use the DOER toolbox</h2>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <MyInfo />
      </AuthenticatedTemplate>
    </>
  );
}

export default HomePage;