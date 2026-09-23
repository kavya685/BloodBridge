import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { donorRegister } from "../../services/donor/registerService";
import "../../styles/Auth.css";

function Register() {

    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [city, setCity] = useState("");
    const [available, setAvailable] = useState(true);
    const [hasDonatedBefore, setHasDonatedBefore] = useState(false);
    const [lastDonationDate, setLastDonationDate] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !fullName ||
            !dateOfBirth ||
            !contactNumber ||
            !email ||
            !password ||
            !confirmPassword ||
            !bloodGroup ||
            !city
        ) {
            alert("Please fill all required fields.");
            return;
        }

        if (hasDonatedBefore && !lastDonationDate) {
            alert("Please provide your last donation date.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            const response = await donorRegister({
                fullName,
                dateOfBirth,
                contactNumber,
                email,
                password,
                confirmPassword,
                bloodGroup,
                city,
                available,
                lastDonationDate: hasDonatedBefore
                    ? lastDonationDate
                    : null
            });

            console.log(response);

            alert("Registration Successful!");

            navigate("/donor/login");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data ||
                "Registration Failed!"
            );
        }
    };

    return (
        <div className="auth-page auth-register-page">

            <div className="auth-card auth-card-wide">

                <div className="auth-header">

                    <div className="auth-brand-mark">
                        ♥
                    </div>

                    <p className="auth-label">
                        DONOR REGISTRATION
                    </p>

                    <h1>
                        Create your account
                    </h1>

                    <p>
                        Register as a donor and help save
                        lives through BloodBridge.
                    </p>

                </div>


                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-form-grid">


                        {/* Full Name */}

                        <div className="auth-field">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(event) =>
                                    setFullName(event.target.value)
                                }
                            />

                        </div>


                        {/* Date of Birth */}

                        <div className="auth-field">

                            <label htmlFor="dateOfBirth">
                                Date of Birth
                            </label>

                            <input
                                id="dateOfBirth"
                                type="date"
                                value={dateOfBirth}
                                onChange={(event) =>
                                    setDateOfBirth(event.target.value)
                                }
                            />

                        </div>


                        {/* Contact Number */}

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


                        {/* Email */}

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


                        {/* Password */}

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


                        {/* Confirm Password */}

                        <div className="auth-field">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                            />

                        </div>


                        {/* Blood Group */}

                        <div className="auth-field">

                            <label htmlFor="bloodGroup">
                                Blood Group
                            </label>

                            <select
                                id="bloodGroup"
                                value={bloodGroup}
                                onChange={(event) =>
                                    setBloodGroup(event.target.value)
                                }
                            >

                                <option value="">
                                    Select blood group
                                </option>

                                <option value="A_POSITIVE">
                                    A+
                                </option>

                                <option value="A_NEGATIVE">
                                    A-
                                </option>

                                <option value="B_POSITIVE">
                                    B+
                                </option>

                                <option value="B_NEGATIVE">
                                    B-
                                </option>

                                <option value="AB_POSITIVE">
                                    AB+
                                </option>

                                <option value="AB_NEGATIVE">
                                    AB-
                                </option>

                                <option value="O_POSITIVE">
                                    O+
                                </option>

                                <option value="O_NEGATIVE">
                                    O-
                                </option>

                            </select>

                        </div>


                        {/* City */}

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


                        {/* Availability */}

                        <div className="auth-field">

                            <label htmlFor="available">
                                Availability
                            </label>

                            <select
                                id="available"
                                value={available ? "true" : "false"}
                                onChange={(event) =>
                                    setAvailable(
                                        event.target.value === "true"
                                    )
                                }
                            >

                                <option value="true">
                                    Available
                                </option>

                                <option value="false">
                                    Not Available
                                </option>

                            </select>

                        </div>


                        {/* Previous Donation */}

                        <div className="auth-field">

                            <label htmlFor="hasDonatedBefore">
                                Have you donated before?
                            </label>

                            <select
                                id="hasDonatedBefore"
                                value={
                                    hasDonatedBefore
                                        ? "true"
                                        : "false"
                                }
                                onChange={(event) =>
                                    setHasDonatedBefore(
                                        event.target.value === "true"
                                    )
                                }
                            >

                                <option value="false">
                                    No
                                </option>

                                <option value="true">
                                    Yes
                                </option>

                            </select>

                        </div>


                        {/* Last Donation Date */}

                        {hasDonatedBefore && (

                            <div className="auth-field">

                                <label htmlFor="lastDonationDate">
                                    Last Donation Date
                                </label>

                                <input
                                    id="lastDonationDate"
                                    type="date"
                                    value={lastDonationDate}
                                    onChange={(event) =>
                                        setLastDonationDate(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                        )}

                    </div>


                    <button
                        type="submit"
                        className="auth-submit"
                    >
                        Create Donor Account
                    </button>

                </form>


                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/donor/login")
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