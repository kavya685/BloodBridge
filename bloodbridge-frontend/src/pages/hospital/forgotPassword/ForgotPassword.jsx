import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {sendOTP} from "../../../services/passwordService.js";

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await sendOTP(email);
            navigate("/hospital/reset-password", {
                state: {
                    email: email,
                    expiresAt: response.expiresAt
                }
            });
        } catch (error) {
            console.log(error);
            alert("OTP not sent, try again.")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Enter email, will send otp</h2>
            <label htmlFor="email">Enter email: </label>
            <input type="email" id="email"
                   value={email}
                   onChange={(event) => setEmail(event.target.value)}
                   required
            />
            <button>Send OTP</button>
        </form>
    );
}

export default ForgotPassword;