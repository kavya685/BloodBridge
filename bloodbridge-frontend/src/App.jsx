import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DonorLogin from "./pages/donor/Login";
import HospitalLogin from "./pages/hospital/Login";
import Navbar from "./components/Navbar";

// react router takes care of which component to display when url changes
function App() {
  return (
      <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/donor/login"
        element={<DonorLogin />}
      />

      <Route
        path="/hospital/login"
        element={<HospitalLogin />}
      />
    </Routes>
    </>
  );
}

export default App;
