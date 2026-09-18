import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hospitalRegister } from "../../services/hospital/registerService";
import "../../styles/Auth.css";

function Register() {
    const [hospitalName, setHospitalName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !hospitalName ||
            !contactNumber ||
            !email ||
            !password ||
            !confirmPassword ||
            !city ||
            !address ||
            !registrationNumber
        ) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const response = await hospitalRegister({
                hospitalName,
                contactNumber,
                email,
                password,
                confirmPassword,
                city,
                address,
                registrationNumber
            });

            console.log(response);

            navigate("/hospital/login");
        } catch (error) {
            console.error(error);
            alert("Registration Failed!");
        }
    };

    return (
        <div className="auth-page auth-register-page">

            <div className="auth-card auth-card-wide">

                <div className="auth-header">
                    <div className="auth-brand-mark">♥</div>

                    <p className="auth-label">
                        HOSPITAL REGISTRATION
                    </p>

                    <h1>Create your account</h1>

                    <p>
                        Register your hospital to start managing
                        blood requests through BloodBridge.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-form-grid">

                        <div className="auth-field">
                            <label htmlFor="hospitalName">
                                Hospital Name
                            </label>

                            <input
                                id="hospitalName"
                                type="text"
                                placeholder="Enter hospital name"
                                value={hospitalName}
                                onChange={(event) =>
                                    setHospitalName(event.target.value)
                                }
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="contactNumber">
                                Contact Number
                            </label>

                            <input
                                id="contactNumber"
                                type="text"
                                placeholder="Enter contact number"
                                value={contactNumber}
                                onChange={(event) =>
                                    setContactNumber(event.target.value)
                                }
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="email@gmail.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirmpassword">
                                Confirm Password
                            </label>

                            <input
                                id="confirmpassword"
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="city">
                                City
                            </label>

                            <input
                                id="city"
                                type="text"
                                placeholder="Enter your city"
                                value={city}
                                onChange={(event) =>
                                    setCity(event.target.value)
                                }
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="registrationNumber">
                                Registration Number
                            </label>

                            <input
                                id="registrationNumber"
                                type="text"
                                placeholder="Enter registration number"
                                value={registrationNumber}
                                onChange={(event) =>
                                    setRegistrationNumber(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="auth-field auth-field-full">
                            <label htmlFor="address">
                                Address
                            </label>

                            <textarea
                                id="address"
                                placeholder="Enter hospital address"
                                value={address}
                                onChange={(event) =>
                                    setAddress(event.target.value)
                                }
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                    >
                        Create Hospital Account
                    </button>

                </form>

                <div className="auth-footer">
                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/hospital/login")
                        }
                    >
                        Sign In
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Register;