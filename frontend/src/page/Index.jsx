import { Link } from "react-router-dom";

function Index() {
    return (
        <div className="index-page">

            {/* Background */}
            <div className="index-grid"></div>

            <div className="index-orb index-orb-one"></div>
            <div className="index-orb index-orb-two"></div>
            <div className="index-orb index-orb-three"></div>

            {/* Navbar */}
            <nav className="index-navbar">

                <div className="index-logo">
                    <span className="index-logo-icon">🚗</span>
                    <span>CampusRide</span>
                </div>

                <div className="index-nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#about">About</a>
                </div>

                <div className="index-nav-actions">

                    <Link
                        to="/login"
                        className="index-login"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="index-register"
                    >
                        Get Started
                    </Link>

                </div>

            </nav>

            {/* Hero */}
            <section className="index-hero">

                <div className="hero-content">

                    <div className="hero-badge">
                        <span></span>
                        CAMPUS CARPOOLING PLATFORM
                    </div>

                    <h1>
                        MOVE TOGETHER.
                        <br />
                        <span>GO FURTHER.</span>
                    </h1>

                    <p>
                        CampusRide connects students traveling in the
                        same direction, making college journeys simpler,
                        smarter and more connected.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="hero-primary"
                        >
                            Start Riding
                            <span>→</span>
                        </Link>

                        <a
                            href="#how-it-works"
                            className="hero-secondary"
                        >
                            Explore CampusRide
                        </a>

                    </div>

                    <div className="hero-stats">

                        <div>
                            <strong>01</strong>
                            <span>Offer a Ride</span>
                        </div>

                        <div>
                            <strong>02</strong>
                            <span>Find a Ride</span>
                        </div>

                        <div>
                            <strong>03</strong>
                            <span>Ride Together</span>
                        </div>

                    </div>

                </div>

                {/* Hero Visual */}
                <div className="hero-visual">

                    <div className="hero-ring ring-one"></div>
                    <div className="hero-ring ring-two"></div>

                    <div className="hero-car">
                        🚗
                    </div>

                    <div className="floating-card card-top">
                        <span>●</span>
                        Ride Available
                    </div>

                    <div className="floating-card card-bottom">
                        <strong>Campus → Home</strong>
                        <small>4 seats available</small>
                    </div>

                </div>

            </section>

            {/* About */}
            <section
                className="index-section about-section"
                id="about"
            >

                <div className="section-label">
                    ABOUT CAMPUSRIDE
                </div>

                <h2>
                    Your campus journey,
                    <span> reimagined.</span>
                </h2>

                <p className="section-description">
                    CampusRide is a college-focused carpooling platform
                    designed to help students offer rides, discover
                    available rides and travel together within their
                    campus community.
                </p>

            </section>

            {/* Features */}
            <section
                className="index-section"
                id="features"
            >

                <div className="section-label">
                    WHY CAMPUSRIDE
                </div>

                <h2>
                    Everything you need
                    <span> for your daily ride.</span>
                </h2>

                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            🚗
                        </div>

                        <h3>
                            Offer a Ride
                        </h3>

                        <p>
                            Have empty seats? Share your journey
                            with fellow students.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon">
                            🔎
                        </div>

                        <h3>
                            Find a Ride
                        </h3>

                        <p>
                            Search available rides based on your
                            travel route.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon">
                            🤝
                        </div>

                        <h3>
                            Ride Together
                        </h3>

                        <p>
                            Connect with students and make your
                            daily commute easier.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon">
                            🔐
                        </div>

                        <h3>
                            Secure Access
                        </h3>

                        <p>
                            Your account is protected with secure
                            authentication.
                        </p>

                    </div>

                </div>

            </section>

            {/* How it works */}
            <section
                className="index-section how-section"
                id="how-it-works"
            >

                <div className="section-label">
                    HOW IT WORKS
                </div>

                <h2>
                    Three steps.
                    <span> One better journey.</span>
                </h2>

                <div className="steps">

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <h3>
                            Create your account
                        </h3>

                        <p>
                            Register on CampusRide and become
                            part of your campus travel community.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <h3>
                            Offer or find a ride
                        </h3>

                        <p>
                            Share your ride or search for a ride
                            that matches your journey.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <h3>
                            Travel together
                        </h3>

                        <p>
                            Request a ride, get accepted and
                            start your journey.
                        </p>

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="index-cta">

                <div className="cta-glow"></div>

                <div>

                    <div className="section-label">
                        YOUR JOURNEY STARTS HERE
                    </div>

                    <h2>
                        Ready to ride
                        <span> together?</span>
                    </h2>

                    <p>
                        Join CampusRide and make your college
                        commute a shared experience.
                    </p>

                </div>

                <Link
                    to="/register"
                    className="cta-button"
                >
                    Create Account →
                </Link>

            </section>

            {/* Footer */}
            <footer className="index-footer">

                <div className="footer-brand">
                    🚗 CampusRide
                </div>

                <p>
                    MOVE TOGETHER. GO FURTHER.
                </p>

                <span>
                    © 2026 CampusRide. Built for campus communities.
                </span>

            </footer>

        </div>
    );
}

export default Index;