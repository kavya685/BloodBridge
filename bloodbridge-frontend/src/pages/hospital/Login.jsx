import { useState } from "react"
import { hospitalLogin } from "../../services/hospital/loginService"
import { useNavigate } from "react-router-dom"


function Login() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Handle Submit Called");

        try {
            const response = await hospitalLogin({
                email,
                password,
            });

            console.log(response);

            localStorage.setItem("token", response.token);
            localStorage.setItem(
                "hospital",
                JSON.stringify(response));

                navigate("/hospital/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Hospital Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
