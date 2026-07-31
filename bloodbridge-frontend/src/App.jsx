import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DonorLogin from "./pages/donor/Login";
import HospitalLogin from "./pages/hospital/Login";
import Navbar from "./components/Navbar";
import donorDashboard from "./pages/donor/Dashboard";
import hospitalDashboard from "./pages/hospital/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BloodRequests from "./pages/bloodRequests/BloodRequests";
import BloodRequestDetails from "./pages/bloodRequests/BloodRequestDetails";
import DonorRegister from "./pages/donor/Register";
import HospitalRegister from "./pages/hospital/Register"
import CreateBloodRequest from "./pages/hospital/CreateBloodRequest"

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
                    <ProtectedRoute>
                        <donorDashboard />
                    </ProtectedRoute>
                }
          />

          <Route
            path="/hospital/dashboard"
            element={
                    <ProtectedRoute>
                        <hospitalDashboard />
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
