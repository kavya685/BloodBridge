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
            element={<BloodRequests />}
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
                <ProtectedRoute>
                    <MyBloodRequests />
                </ProtectedRoute>
             }
            />
        </Routes>
      </>
  );
}

export default App;
