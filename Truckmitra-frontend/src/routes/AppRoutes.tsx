// src/routes/AppRoutes.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import PendingApproval from '../pages/auth/PendingApproval';
import DriverLogin from '../pages/auth/DriverLogin';
import DriverRegister from '../pages/auth/DriverRegister';
import ShipperLogin from '../pages/auth/ShipperLogin';
import ShipperRegister from '../pages/auth/ShipperRegister';
import TransporterLogin from '../pages/auth/TransporterLogin';
import TransporterRegister from '../pages/auth/TransporterRegister';

import Wallet from '../pages/wallet/Wallet';
import DriverDashboard from '../pages/driver/DriverDashboard';
import ShipperDashboard from '../pages/shipper/ShipperDashboard';
import TransporterDashboard from '../pages/transporter/TransporterDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminTransactions from '../pages/admin/AdminTransactions';
import ReportsPage from '../pages/admin/ReportsPage';
import SystemSettings from '../pages/admin/SystemSettings';
import CreateLoad from '../pages/loads/CreateLoad';
import Bids from '../pages/bids/Bids';
import Trips from '../pages/trips/Trips';
import Loads from '../pages/loads/Loads';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import LandingPage from '../pages/LandingPage';
import StaticPage from '../pages/StaticPage';
import ProfilePage from '../pages/profile/ProfilePage';
import EditProfilePage from '../pages/profile/EditProfilePage';
import DocumentsPage from '../pages/profile/DocumentsPage';
import SubscriptionManagement from '../pages/profile/SubscriptionManagement';
import MyRatingsPage from '../pages/rating/MyRatingsPage';
import UserRatingsPage from '../pages/rating/UserRatingsPage';
import CreateRatingPage from '../Components/rating/CreateRatingPage';
import InvoiceDetails from '../pages/billing/InvoiceDetails';
import RatingDetailPage from '../pages/rating/RatingDetailPage';
import EditRatingPage from '../pages/rating/EditRatingPage';
import EditReviewPage from '../pages/rating/EditReviewPage';
import VerifyLR from '../pages/public/VerifyLR';
import PricingPage from '../pages/public/PricingPage';
import AboutUs from '../pages/public/AboutUs';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/help" element={<StaticPage title="Help Center" />} />
      <Route path="/contact" element={<StaticPage title="Contact Us" />} />
      <Route path="/faqs" element={<StaticPage title="FAQs" />} />
      <Route path="/terms" element={<StaticPage title="Terms of Service" />} />
      <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
      <Route path="/verify/lr/:lrNumber" element={<VerifyLR />} />

      {/* Role Landing Redirects */}
      <Route path="/shipper" element={<Navigate to="/shipper/login" />} />
      <Route path="/transporter" element={<Navigate to="/transporter/login" />} />
      <Route path="/driver" element={<Navigate to="/driver/login" />} />

      {/* Auth Routes - Only for non-authenticated users */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/register" element={<DriverRegister />} />
        <Route path="/shipper/login" element={<ShipperLogin />} />
        <Route path="/shipper/register" element={<ShipperRegister />} />
        <Route path="/transporter/login" element={<TransporterLogin />} />
        <Route path="/transporter/register" element={<TransporterRegister />} />
      </Route>

      {/* Pending Approval - Accessible even when authenticated but pending */}
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* Protected Routes - Require authentication */}
      <Route element={<PrivateRoute />}>
        {/* Common Routes - Accessible by all authenticated users */}
        <Route path="/dashboard" element={<Navigate to="/profile" />} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/documents" element={<DocumentsPage />} />
        {/* Wallet and Billing */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/dashboard/billing/:id" element={<InvoiceDetails />} />
        
         {/* My Ratings */}
        <Route path="/ratings/received" element={<MyRatingsPage type="received" />} />
        <Route path="/ratings/given" element={<MyRatingsPage type="given" />} />
        {/* <Route path="/ratings/summary/me" element={<ProfilePage t />} /> */}
        <Route path="/ratings/stats/me" element={<MyRatingsPage type="stats" />} />
        
        {/* User Ratings */}
        <Route path="/ratings/user/:userId/received" element={<UserRatingsPage />} />
        <Route path="/ratings/user/:userId/type/:ratingType" element={<UserRatingsPage />} />
        
        {/* Trip Ratings
        <Route path="/ratings/trip/:tripId" element={<TripRatingsPage />} />
        <Route path="/ratings/trip/:tripId/check/:ratingType" element={<TripRatingsPage checkOnly />} /> */}
        
        {/* Single Rating */}
        <Route path="/ratings/:ratingId" element={<RatingDetailPage />} />
        <Route path="/ratings/:ratingId/edit" element={<EditRatingPage />} />
        
        {/* Create Rating */}
        <Route path="/ratings/create" element={<CreateRatingPage />} />
        
        {/* Reviews */}
        <Route path="/ratings/:ratingId/reviews" element={<RatingDetailPage tab="reviews" />} />
        <Route path="/ratings/reviews/create" element={<CreateRatingPage type="review" />} />
        <Route path="/ratings/reviews/:reviewId/edit" element={<EditReviewPage />} />

        {/* Load/Bid Routes */}
        {/* Generic routes removed to enforce role-based access */}
      </Route>

      {/* Role-Specific Routes */}
      <Route element={<PrivateRoute allowedRoles={['DRIVER']} />}>
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/trips" element={<Trips />} />
        <Route path="/driver/earnings" element={<div>Driver Earnings</div>} />
        <Route path="/driver/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['SHIPPER']} />}>
        <Route path="/shipper/dashboard" element={<ShipperDashboard />} />
        <Route path="/shipper/loads" element={<Navigate to="/shipper/dashboard" replace />} />
        <Route path="/shipper/loads/create" element={<CreateLoad />} />
        <Route path="/shipper/bids" element={<Navigate to="/shipper/dashboard" replace />} />
        <Route path="/shipper/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['TRANSPORTER']} />}>
        <Route path="/transporter/dashboard" element={<TransporterDashboard />} />
        <Route path="/transporter/loads/create" element={<CreateLoad />} />
        <Route path="/transporter/register-driver" element={<DriverRegister />} />
        <Route path="/transporter/vehicles" element={<Navigate to="/transporter/dashboard" replace />} />
        <Route path="/transporter/drivers" element={<Navigate to="/transporter/dashboard" replace />} />
        <Route path="/transporter/bids" element={<Bids />} />
        <Route path="/transporter/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminDashboard />} />
        <Route path="/admin/users/:id" element={<AdminDashboard />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/settings" element={<SystemSettings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;