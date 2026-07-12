import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DonorLogin from "./pages/donor/Login";
import HospitalLogin from "./pages/hospital/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/donor/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BloodRequests from "./pages/bloodRequests/BloodRequests";
import BloodRequestDetails from "./pages/bloodRequests/BloodRequestDetails";

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
                        <Dashboard />
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
        </Routes>
      </>
  );
}

export default App;
