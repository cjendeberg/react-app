import React from "react";
import "./App.css";
import ProjectsPage from "./projects/ProjectsPage";
import ProjectPage from './projects/ProjectPage';
import SubnetsPage from "./subnets/SubnetsPage";
import { BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import HomePage from './home/HomePage';

function App() {
  return (
    <Router>
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
      </header>      
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/subnets" element={<SubnetsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
