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

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        <form onSubmit={handleSubmit}>

            <h2>Donor Registration</h2>

            <label>Full Name</label>
            <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />

            <label>Date of Birth</label>
            <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
            />

            <label>Email</label>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <label>Contact Number</label>
            <input
                type="tel"
                placeholder="Enter your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
            />

            <label>City</label>
            <input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />

            <label>Blood Group</label>
            <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
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

            <label>Are you currently available to donate?</label>
            <select
                value={available}
                onChange={(e) => setAvailable(e.target.value === "true")}
            >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </select>

            <label>Have you donated blood before?</label>

            <label>
                <input
                    type="radio"
                    checked={hasDonatedBefore === true}
                    onChange={() => setHasDonatedBefore(true)}
                />
                Yes
            </label>

            <label>
                <input
                    type="radio"
                    checked={hasDonatedBefore === false}
                    onChange={() => setHasDonatedBefore(false)}
                />
                No
            </label>

            {hasDonatedBefore && (
                <>
                    <label>Last Donation Date</label>
                    <input
                        type="date"
                        value={lastDonationDate}
                        onChange={(e) => setLastDonationDate(e.target.value)}
                    />
                </>
            )}

            <button type="submit">
                Register
            </button>

        </form>
    );
}

export default Register;
