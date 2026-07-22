import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { hospitalRegister } from "../../services/hospital/registerService";

function Register() {
    const [hospitalName, setHospitalName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div>
            <h1>Hospital Registration</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Hospital Name</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter hospital name"
                        value={hospitalName}
                        onChange={(event) =>
                            setHospitalName(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Contact Number</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter contact number"
                        value={contactNumber}
                        onChange={(event) =>
                            setContactNumber(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        placeholder="email@gmail.com"
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
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
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
                    <label>Address</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(event) =>
                            setAddress(event.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Registration Number</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter your registration number"
                        value={registrationNumber}
                        onChange={(event) =>
                            setRegistrationNumber(event.target.value)
                        }
                    />
                </div>

                <br />

                <button type="submit">
                    Register
                </button>
            </form>
        </div>
    )
}

export default Register;
