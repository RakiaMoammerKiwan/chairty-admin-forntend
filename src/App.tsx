// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import AddProjectForm from "./pages/chairty/projects/AddChairtyProjectForm";
import AddVolunteerProject from "./pages/chairty/projects/AddVolunteerProject";
import AddDonationProject from "./pages/chairty/projects/AddDonationProject";
import ProjectsPage from "./pages/ProjectsPage";
import VolunteerRequestsPage from "./pages/VolunteerRequestsPage";
import BeneficiaryFeedbackPage from "./pages/BeneficiaryFeedbackPage";
import BeneficiaryRequestsPage from "./pages/BeneficiaryRequestsPage";
import GiftDonationsPage from "./pages/GiftDonationsPage";
import BeneficiariesPage from "./pages/AllBeneficiariesPage";
import VolunteersPage from "./pages/AllVolunteersPage";
import RequestFormPage from "./pages/RequestFormPage";

import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="home" index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="addProject" element={<AddProjectForm />} />
            <Route path="addVolunteerProject" element={<AddVolunteerProject />} />
            <Route path="addDonationProject" element={<AddDonationProject />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="volunteerRequests" element={<VolunteerRequestsPage />} />
            <Route path="beneficiaryFeedback" element={<BeneficiaryFeedbackPage />} />
            <Route path="beneficiaryRequests" element={< BeneficiaryRequestsPage />} />
            <Route path="giftDonations" element={<GiftDonationsPage />} />
            <Route path="beneficiaries" element={<BeneficiariesPage />} />
            <Route path="volunteers" element={<VolunteersPage />} />
            <Route path="/requestForm/:id" element={<RequestFormPage />} />
          </Route>
        </Route>

        {/* Redirect all other paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;