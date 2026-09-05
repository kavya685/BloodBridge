import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home">

            {/* Hero Section */}
            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-badge">
                        🩸 Connecting donors with those in need
                    </span>

                    <h1>
                        Every Drop
                        <span> Can Save a Life.</span>
                    </h1>

                    <p>
                        BloodBridge makes it easier for hospitals and blood
                        donors to connect when every second matters.
                    </p>

                    <div className="hero-actions">

                        <Link
                            to="/donor/register"
                            className="primary-button"
                        >
                            Become a Donor
                        </Link>

                        <Link
                            to="/hospital/register"
                            className="secondary-button"
                        >
                            Register Hospital
                        </Link>

                    </div>

                </div>

                <div className="hero-visual">
                    <div className="blood-drop">
                        ♥
                    </div>
                </div>

            </section>


            {/* How It Works */}
            <section className="how-section">

                <div className="section-heading">
                    <span>HOW IT WORKS</span>

                    <h2>
                        Simple. Fast. Life-saving.
                    </h2>

                    <p>
                        BloodBridge connects the right people at the right
                        time.
                    </p>
                </div>


                <div className="steps">

                    <div className="step-card">
                        <div className="step-number">01</div>

                        <h3>Find a Request</h3>

                        <p>
                            Donors can discover blood requests that match
                            their blood group.
                        </p>
                    </div>


                    <div className="step-card">
                        <div className="step-number">02</div>

                        <h3>Apply to Donate</h3>

                        <p>
                            Submit an application and let the hospital know
                            you're available to help.
                        </p>
                    </div>


                    <div className="step-card">
                        <div className="step-number">03</div>

                        <h3>Make a Difference</h3>

                        <p>
                            Once accepted, complete your donation and help
                            someone in need.
                        </p>
                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="cta-section">

                <h2>
                    Ready to make a difference?
                </h2>

                <p>
                    One donation can make an incredible impact.
                </p>

                <Link
                    to="/donor/register"
                    className="cta-button"
                >
                    Join BloodBridge
                </Link>

            </section>

        </div>
    );
}

export default Home;