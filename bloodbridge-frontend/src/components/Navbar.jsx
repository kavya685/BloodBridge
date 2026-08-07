import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/hospital/register">Hospital Register</Link> |{" "}
      <Link to="/donor/register">Donor Register</Link> |{" "}
      <Link to="/donor/login">Donor Login</Link> |{" "}
      <Link to="/hospital/login">Hospital Login</Link>
    </nav>
  );
}

export default Navbar;
