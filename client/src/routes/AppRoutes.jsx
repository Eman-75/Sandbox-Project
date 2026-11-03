import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import ProtectedRoute from "../components/pages/Auth/ProtectedRoute";

// Investor Pages
import InvestorDashboard from "../components/pages/Investor/Dashboard/Dashboard";
import InvestorMessages from "../components/pages/Investor/Messages/Messages";
import InvestorPortfolio from "../components/pages/Investor/Portfolio/Portfolio";
import InvestorProposals from "../components/pages/Investor/Proposals/Proposals";
import InvestorNotifications from "../components/pages/Investor/NotificationHistory/NotificationHistory";
import InvestorProfile from "../components/pages/Investor/Profile/Profile";
import InvestorSettings from "../components/pages/Investor/Settings/Settings";
import Explore from "../components/pages/Investor/Explore/Explore";
import InvestorInnovationVault from "../components/pages/Investor/InnovationVault/InnovationVault";
import Investment from "../components/pages/Investor/Investment/Investment";

// Startup Pages
import StartupDashboard from "../components/pages/Startup/Dashboard/Dashboard";
import StartupProposals from "../components/pages/Startup/Proposals/Proposals";
import StartupMessages from "../components/pages/Startup/Messages/Messages";
import StartupProfile from "../components/pages/Startup/Profile/Profile";
import StartupInvestors from "../components/pages/Startup/Investors/Investors";
import StartupLearningHub from "../components/pages/Startup/LearningHub/LearningHub";
import StartupSettings from "../components/pages/Startup/Settings/Settings";
import StartupInnovationVault from "../components/pages/Startup/InnovationVault/InnovationVault";
import StartupNotifications from "../components/pages/Startup/NotificationHistory/NotificationHistory";
import Funds from "../components/pages/Startup/Funding/Funds";

// Admin Pages
import AdminDashboard from "../components/pages/Admin/Dashboard/Dashboard";
import AdminUsers from "../components/pages/Admin/Users/Users";
import AdminResearch from "../components/pages/Admin/ResearchIdea/ResrachIdeasPage";
import ResearchHistory from "../components/pages/Admin/ResearchHistory/ResearchHistory";
import AdminResources from "../components/pages/Admin/Resources/resources";

// Student Pages
import StudentDashboard from "../components/pages/Student/Dashboard/Dashboard";
import StudentProfile from "../components/pages/Student/Profile/Profile";
import StudentLearningHub from "../components/pages/Student/LearningHub/LearningHub";
import StudentResources from "../components/pages/Student/Resources/Resources";
import StudentStartups from "../components/pages/Student/Browsestartups/Browsestartups";
import StudentInvestors from "../components/pages/Student/Findinvestors/Findinvestors";
import StudentMessages from "../components/pages/Student/Messages/Messages";
import StudentInnovationVault from "../components/pages/Student/InnovationVault/InnovationVault";
import StudentNotifications from "../components/pages/Student/NotificationHistory/NotificationHistory";
import StudentFunds from "../components/pages/Student/Funding/Funds";
import StudentProposals from "../components/pages/Student/Proposals/Proposals";

// Auth Pages
import PaymentSuccess from "../components/pages/Auth/PaymentSuccess";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Investor Routes */}
      <Route path="/investor" element={
          <ProtectedRoute allowedRoles={['investor']}>
            <DashboardLayout role="Investor" />
          </ProtectedRoute>
        }>
        <Route index element={<InvestorDashboard />} />
        <Route path="dashboard" element={<InvestorDashboard />} />
        <Route path="explore" element={<Explore/>} />
        <Route path="messages" element={<InvestorMessages />} />
        <Route path="portfolio" element={<InvestorPortfolio />} />
        <Route path="proposals" element={<InvestorProposals />} />
        <Route path="notifications" element={<InvestorNotifications />} />
        <Route path="profile" element={<InvestorProfile />} />
        <Route path="settings" element={<InvestorSettings />} />
        <Route path="innovation-vault" element={<InvestorInnovationVault />} />
        <Route path="investment" element={<Investment />} />
      </Route>

      {/* Startup Routes */}
      <Route path="/startup" element={
          <ProtectedRoute allowedRoles={['startup']}>
            <DashboardLayout role="Startup" />
          </ProtectedRoute>
        }>
        <Route index element={<StartupDashboard />} />
        <Route path="dashboard" element={<StartupDashboard />} />
        <Route path="investors" element={<StartupInvestors />} />
        <Route path="learninghub" element={<StartupLearningHub />} />
        <Route path="messages" element={<StartupMessages />} />
        <Route path="profile" element={<StartupProfile />} />
        <Route path="settings" element={<StartupSettings />} />
        <Route path="proposals" element={<StartupProposals />} />
        <Route path="innovation-vault" element={<StartupInnovationVault />} />
        <Route path="notifications" element={<StartupNotifications />} />
        <Route path="funds" element={<Funds />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout role="Admin" />
          </ProtectedRoute>
        }>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="research-ideas" element={<AdminResearch />} />
        <Route path="research-history" element={<ResearchHistory />} />
        <Route path="resources" element={<AdminResources />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout role="Student" />
          </ProtectedRoute>
        }>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="startups" element={<StudentStartups />} />
        <Route path="investors" element={<StudentInvestors />} />
        <Route path="resources" element={<StudentResources />} />
        <Route path="learninghub" element={<StudentLearningHub />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="innovation-vault" element={<StudentInnovationVault />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="fundings" element={<StudentFunds />} />
        <Route path="proposals" element={<StudentProposals />} />
      </Route>

      {/* Payment Success Page */}
      <Route path="/success" element={<PaymentSuccess />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
