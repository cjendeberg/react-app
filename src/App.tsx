import React from "react";
import SubnetsPage from "./subnets/SubnetsPage";
import FeatureTogglesPage from "./featureToggles/FeatureTogglesPage";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate} from 'react-router-dom';
import HomePage from './home/HomePage';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { CustomNavigationClient } from "./CustomNavigationClient";

interface AppProps {
  pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {      
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={pca}>
      <header className="sticky">
        <span className="logo">
          <img src="/assets/doer.jpg" alt="logo" width="50" height="50" />
        </span>
        <AuthenticatedTemplate>
          <NavLink to="/"  className="button rounded">
            <span className="icon-home"></span>
            Home
          </NavLink>
          <NavLink to="/featureToggles" className="button rounded">
            FeatureToggles
          </NavLink>
          <NavLink to="/subnets" className="button rounded">
            Subnets
          </NavLink>        
          <SignOutButton />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <SignInButton />
        </UnauthenticatedTemplate>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/featureToggles" element={<FeatureTogglesPage />} />
          <Route path="/subnets" element={<SubnetsPage />} />
        </Routes>
      </div>
    </MsalProvider>
  );
}


export default App;
