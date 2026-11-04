import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DonorLogin from "./pages/donor/Login";
import HospitalLogin from "./pages/hospital/Login";
import Navbar from "./components/Navbar";
import DonorDashboard from "./pages/donor/Dashboard";
import HospitalDashboard from "./pages/hospital/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BloodRequests from "./pages/bloodRequests/BloodRequests";
import BloodRequestDetails from "./pages/bloodRequests/BloodRequestDetails";
import DonorRegister from "./pages/donor/Register";
import HospitalRegister from "./pages/hospital/Register"
import CreateBloodRequest from "./pages/hospital/CreateBloodRequest"
import MyBloodRequests from "./pages/hospital/MyBloodRequests";
import BloodRequestApplicants from "./pages/hospital/BloodRequestApplicants";
import MyApplications from "./pages/donor/MyApplications";
import DonorNotifications from "./pages/donor/Notifications";
import HospitalNotifications from "./pages/hospital/Notifications";
import EditBloodRequest from "./pages/hospital/EditBloodRequest.jsx";
import ForgotPassword from "./pages/hospital/forgotPassword/ForgotPassword.jsx"
import VerifyOTP from "./pages/hospital/forgotPassword/VerifyOTP.jsx";
import ResetPassword from "./pages/hospital/forgotPassword/ResetPassword.jsx";
import DonorForgotPassword from "./pages/donor/forgotPassword/ForgotPassword.jsx";
import DonorVerifyOTP from "./pages/donor/forgotPassword/VerifyOTP.jsx";
import DonorResetPassword from "./pages/donor/forgotPassword/ResetPassword.jsx";
import DonorProfile from "./pages/donor/Profile";
import HospitalProfile from "./pages/hospital/Profile";

// react router takes care of which component to display when url changes
function App() {
  return (
      <>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/donor/login"
            element={<DonorLogin />}
          />

          <Route
            path="/hospital/login"
            element={<HospitalLogin />}
          />

          <Route
            path="/donor/dashboard"
            element={
                    <ProtectedRoute role="donor">
                        <DonorDashboard />
                    </ProtectedRoute>
                }
          />

          <Route
            path="/hospital/dashboard"
            element={
                    <ProtectedRoute role="hospital">
                        <HospitalDashboard />
                    </ProtectedRoute>
                  }
          />

          <Route
            path="/blood-requests"
            element={
                <ProtectedRoute role="donor">
                    <BloodRequests />
                </ProtectedRoute>
            }
           />

           <Route
             path="/blood-requests/:id"
             element={<BloodRequestDetails />}
            />

            <Route
             path="/donor/register"
             element={<DonorRegister />}
            />

            <Route
             path="/hospital/register"
             element={<HospitalRegister />}
            />

            <Route
             path="/hospital/create-blood-request"
             element={<CreateBloodRequest />}
            />

            <Route
             path="/hospital/my-blood-requests"
             element={
                <ProtectedRoute role="hospital">
                    <MyBloodRequests />
                </ProtectedRoute>
             }
            />

            <Route
             path="/hospital/blood-requests/:id/applicants"
             element={
                <ProtectedRoute  role="hospital">
                    <BloodRequestApplicants />
                </ProtectedRoute>
             }
            />

            <Route
             path="/donor/my-applications"
             element={
               <ProtectedRoute role="donor">
                   <MyApplications />
               </ProtectedRoute>
             }
            />

            <Route
             path="/donor/notifications"
             element={
               <ProtectedRoute role="donor">
                    <DonorNotifications />
               </ProtectedRoute>
             }
            />

            <Route
                path="/hospital/notifications"
                element={
                    <ProtectedRoute role="hospital">
                        <HospitalNotifications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/hospital/edit-blood-request/:id"
                element={
                    <ProtectedRoute role="hospital">
                        <EditBloodRequest />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/hospital/forgot-password"
                element={
                        <ForgotPassword />
                }
            />

            <Route
                path="/hospital/verify-otp"
                element={<VerifyOTP />}
            />

            <Route
                path="/hospital/reset-password"
                element={<ResetPassword />}
            />

            {/* Donor Password Reset Routes */}
            <Route
                path="/donor/forgot-password"
                element={<DonorForgotPassword />}
            />

            <Route
                path="/donor/verify-otp"
                element={<DonorVerifyOTP />}
            />

            <Route
                path="/donor/reset-password"
                element={<DonorResetPassword />}
            />

            {/* Profile Routes */}
            <Route
                path="/donor/profile"
                element={
                    <ProtectedRoute role="donor">
                        <DonorProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/hospital/profile"
                element={
                    <ProtectedRoute role="hospital">
                        <HospitalProfile />
                    </ProtectedRoute>
                }
            />

        </Routes>
      </>
  );
}

export default App;
