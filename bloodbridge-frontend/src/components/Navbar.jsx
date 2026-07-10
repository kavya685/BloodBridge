import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/donor/login">Donor Login</Link> |{" "}
      <Link to="/hospital/login">Hospital Login</Link> |{" "}
      <Link to="/blood-requests">Blood Requests</Link>
    </nav>
  );
}

export default Navbar;
