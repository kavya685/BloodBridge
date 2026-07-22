import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { donorRegister } from "../../services/donor/registerService";

function Register() {

    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [city, setCity] = useState("");
    const [available, setAvailable] = useState(true);
    const [hasDonatedBefore, setHasDonatedBefore] = useState(false);
    const [lastDonationDate, setLastDonationDate] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !fullName ||
            !dateOfBirth ||
            !email ||
            !password ||
            !contactNumber ||
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

        const donorData = {
            fullName,
            dateOfBirth,
            email,
            password,
            contactNumber,
            bloodGroup,
            city,
            available,
            lastDonationDate: hasDonatedBefore ? lastDonationDate : null
        };

        try {
            await donorRegister(donorData);

            alert("Registration Successful! Please log in.");

            navigate("/donor/login");

        } catch (error) {
            console.error(error);
            alert("Registration Failed!");
        }
    };

    return (
        <div>
            <h1>Donor Registration</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Full Name</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(event) =>
                            setFullName(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Date of Birth</label>
                    <br />
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(event) =>
                            setDateOfBirth(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
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
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Contact Number</label>
                    <br />
                    <input
                        type="tel"
                        placeholder="Enter your contact number"
                        value={contactNumber}
                        onChange={(event) =>
                            setContactNumber(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>City</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter your city"
                        value={city}
                        onChange={(event) =>
                            setCity(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Blood Group</label>
                    <br />
                    <select
                        value={bloodGroup}
                        onChange={(event) =>
                            setBloodGroup(event.target.value)
                        }
                    >
                        <option value="">Select Blood Group</option>
                        <option value="A_POSITIVE">A+</option>
                        <option value="A_NEGATIVE">A-</option>
                        <option value="B_POSITIVE">B+</option>
                        <option value="B_NEGATIVE">B-</option>
                        <option value="AB_POSITIVE">AB+</option>
                        <option value="AB_NEGATIVE">AB-</option>
                        <option value="O_POSITIVE">O+</option>
                        <option value="O_NEGATIVE">O-</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Are you currently available to donate?</label>
                    <br />
                    <select
                        value={available}
                        onChange={(event) =>
                            setAvailable(event.target.value === "true")
                        }
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Have you donated blood before?</label>

                    <br />

                    <label>
                        <input
                            type="radio"
                            checked={hasDonatedBefore === true}
                            onChange={() => setHasDonatedBefore(true)}
                        />
                        Yes
                    </label>

                    <br />

                    <label>
                        <input
                            type="radio"
                            checked={hasDonatedBefore === false}
                            onChange={() => setHasDonatedBefore(false)}
                        />
                        No
                    </label>
                </div>

                <br />

                {hasDonatedBefore && (
                    <div>
                        <label>Last Donation Date</label>
                        <br />
                        <input
                            type="date"
                            value={lastDonationDate}
                            onChange={(event) =>
                                setLastDonationDate(event.target.value)
                            }
                        />
                    </div>
                )}

                <br />

                <button type="submit">
                    Register
                </button>

            </form>
        </div>
    );
}

export default Register;
