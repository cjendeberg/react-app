import React from "react";
import "./App.css";
import ProjectsPage from "./projects/ProjectsPage";
import ProjectPage from './projects/ProjectPage';
import SubnetsPage from "./subnets/SubnetsPage";
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
          <img src="/assets/logo-3.svg" alt="logo" width="49" height="99" />
        </span>
        <NavLink to="/"  className="button rounded">
          <span className="icon-home"></span>
          Home
        </NavLink>
        <NavLink to="/projects" className="button rounded">
          Projects
        </NavLink>
        <NavLink to="/subnets" className="button rounded">
          Subnets
        </NavLink>
        <AuthenticatedTemplate>
          <SignOutButton />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <SignInButton />
        </UnauthenticatedTemplate>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/subnets" element={<SubnetsPage />} />
        </Routes>
      </div>
    </MsalProvider>
  );
}


export default App;
