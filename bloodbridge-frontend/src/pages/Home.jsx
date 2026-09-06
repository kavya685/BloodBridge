import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home">

            {/* Hero */}
            <section className="hero-section">

                <div className="hero-content">

                    <p className="hero-eyebrow">
                        BLOOD DONATION NETWORK
                    </p>

                    <h1>
                        Find blood.
                        <br />
                        <span>Give hope.</span>
                    </h1>

                    <p className="hero-description">
                        BloodBridge connects hospitals and donors through
                        one simple platform, helping people find the blood
                        they need when it matters most.
                    </p>

                    <div className="hero-actions">

                        <Link
                            to="/donor/login"
                            className="primary-button"
                        >
                            Find a Blood Request
                        </Link>

                        <Link
                            to="/donor/register"
                            className="secondary-button"
                        >
                            Become a Donor
                        </Link>

                    </div>

                </div>


                {/* Product Preview */}
                <div className="hero-preview">

                    <div className="preview-header">
                        <div>
                            <span className="preview-label">
                                ACTIVE REQUESTS
                            </span>

                            <h3>Blood needed nearby</h3>
                        </div>

                        <span className="live-indicator">
                            ● LIVE
                        </span>
                    </div>


                    <div className="request-preview">

                        <div className="blood-group">
                            O+
                        </div>

                        <div className="request-info">
                            <strong>3 units required</strong>
                            <span>City Hospital</span>
                        </div>

                        <span className="urgent-badge">
                            Urgent
                        </span>

                    </div>


                    <div className="request-preview">

                        <div className="blood-group">
                            B−
                        </div>

                        <div className="request-info">
                            <strong>2 units required</strong>
                            <span>General Hospital</span>
                        </div>

                        <span className="open-badge">
                            Open
                        </span>

                    </div>


                    <div className="request-preview">

                        <div className="blood-group">
                            AB+
                        </div>

                        <div className="request-info">
                            <strong>1 unit required</strong>
                            <span>Care Hospital</span>
                        </div>

                        <span className="open-badge">
                            Open
                        </span>

                    </div>

                    <Link
                        to="/donor/login"
                        className="preview-link"
                    >
                        View blood requests →
                    </Link>

                </div>

            </section>


            {/* Two Sides */}
            <section className="roles-section">

                <div className="section-intro">

                    <p className="section-eyebrow">
                        ONE PLATFORM
                    </p>

                    <h2>
                        Built for both sides of the bridge.
                    </h2>

                </div>


                <div className="role-grid">

                    <div className="role-card donor-card">

                        <div className="role-number">
                            01
                        </div>

                        <h3>For Donors</h3>

                        <p>
                            Discover blood requests, apply to donate,
                            and keep track of your donation activity.
                        </p>

                        <ul>
                            <li>Find matching blood requests</li>
                            <li>Apply to donate</li>
                            <li>Track your applications</li>
                        </ul>

                        <Link to="/donor/register">
                            Join as a donor →
                        </Link>

                    </div>


                    <div className="role-card hospital-card">

                        <div className="role-number">
                            02
                        </div>

                        <h3>For Hospitals</h3>

                        <p>
                            Create requests, manage donor applications,
                            and keep track of fulfillment.
                        </p>

                        <ul>
                            <li>Create blood requests</li>
                            <li>Review donor applications</li>
                            <li>Track request status</li>
                        </ul>

                        <Link to="/hospital/register">
                            Register your hospital →
                        </Link>

                    </div>

                </div>

            </section>


            {/* Process */}
            <section className="process-section">

                <div className="section-intro centered">

                    <p className="section-eyebrow">
                        HOW IT WORKS
                    </p>

                    <h2>
                        From request to donation.
                    </h2>

                </div>


                <div className="process-flow">

                    <div className="process-step">
                        <span>01</span>
                        <h3>Request</h3>
                        <p>
                            A hospital creates a blood request.
                        </p>
                    </div>

                    <div className="process-line" />

                    <div className="process-step">
                        <span>02</span>
                        <h3>Connect</h3>
                        <p>
                            Matching donors discover the request.
                        </p>
                    </div>

                    <div className="process-line" />

                    <div className="process-step">
                        <span>03</span>
                        <h3>Donate</h3>
                        <p>
                            The donor helps fulfill the request.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;