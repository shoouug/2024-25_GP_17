import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';
import Lottie from 'lottie-react';
import animationData from '../images/Animation - 1729347628307.json'; 
import ProfileIcon from '../images/ProfileIcon.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutUs = () => {
    React.useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="about-us-container">
            <div className="background-animation1">
                <Lottie animationData={animationData} loop={true} />
            </div>
                <div className="logoANDprofile">
                    <Link to="/homepage">
                        <img src={require('../images/logo.png')} alt="GenNews Logo" className="logoW" />
                    </Link>

                    <Link to="/profile">
                    <img src={ProfileIcon} alt="Profile Icon" className="ProfileIconH" />
                </Link>
                </div>

                <div className="cards-container">
                <section className="cards" data-aos="fade-up">
                    <h1>About GenNews</h1>
                    <p>Empowering journalists through automated content creation with advanced technologies.</p>
                    </section>
              
                    <section className="cards" data-aos="fade-up">
                        <h2>Overview</h2>
                        <p>GenNews is a platform designed to help journalists automate their content creation process by utilizing several advanced technologies. This section explains the key concepts behind each technology and their applications in the project.</p>
                    </section>

                    <section className="cards" data-aos="fade-up">
                        <h2>Our Mission</h2>
                        <p>At GenNews, our goal is to revolutionize journalism by leveraging the power of AI to assist writers in generating high-quality content...</p>
                    </section>

                    <section className="cards" data-aos="fade-up">
                        <h2>Our Vision for the Future</h2>
                        <p>We envision a future where AI empowers every journalist to reach new heights in content creation...</p>
                    </section>

                    <section className="cards" data-aos="fade-up">
                        <h2>Contact Information</h2>
                        <p>We value your feedback and suggestions. Feel free to reach out to us at <a href="mailto:GenNews@gmail.com">GenNews@gmail.com</a>.</p>
                    </section>
                </div>
                <footer className="about-us-footer">
                    <p>Developers: Wijdan Alhashim, Shoug Aljebreen, Lina Alharbi, Lina Albarrak</p>
                    <p>© 2024 GenNews. All rights reserved.</p>
                </footer>
        </div>
    );
};

export default AboutUs;