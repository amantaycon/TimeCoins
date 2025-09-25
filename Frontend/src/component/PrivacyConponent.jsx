import React, { useState } from "react";
import "../assets/css/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-updated">Last updated: September 25, 2025</p>

      <section className="privacy-section">
        <h2>1. Introduction</h2>
        <p>
          Welcome to <strong>TimeCoins</strong>. Your privacy is important to
          us. This Privacy Policy explains how we collect, use, and protect your
          personal information when you use our platform.
        </p>
      </section>

      <section className="privacy-section">
        <h2>2. Information We Collect</h2>
        <ul>
          <li>
            <strong>Account Information:</strong> Full name, username, email,
            and password for registration.
          </li>
          <li>
            <strong>Transaction Data:</strong> Details of TimeCoins transfers,
            wallet activity, and purchases.
          </li>
          <li>
            <strong>Technical Data:</strong> Device type, IP address, and
            browser details.
          </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To provide secure wallet and transaction services.</li>
          <li>To improve platform performance and user experience.</li>
          <li>To comply with legal and financial regulations.</li>
          <li>To prevent fraud, abuse, and unauthorized access.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>4. Data Security</h2>
        <p>
          We implement advanced encryption and security measures to protect your
          personal and financial data. However, no online service is 100%
          secure, and we encourage you to use strong passwords and enable
          two-factor authentication.
        </p>
      </section>

      <section className="privacy-section">
        <h2>5. Sharing of Information</h2>
        <p>We do not sell or rent your data. Information may be shared with:</p>
        <ul>
          <li>Regulatory authorities when legally required.</li>
          <li>Payment providers and financial institutions.</li>
          <li>Service providers who assist in platform operations.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information. Contact our support team if you wish to exercise these
          rights.
        </p>
      </section>

      <section className="privacy-section">
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:{" "}
          <a className="condition" href="mailto:support@timecoins.com">
            support@timecoins.com
          </a>
        </p>
      </section>
    </div>
  );
};

const TermsAndConditions = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Terms & Conditions</h1>
      <p className="privacy-updated">Last updated: September 25, 2025</p>

      <section className="privacy-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using <strong>TimeCoins</strong>, you agree to comply
          with these Terms & Conditions. If you do not agree, you must stop
          using the platform immediately.
        </p>
      </section>

      <section className="privacy-section">
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old and legally eligible to use digital
          financial services in your jurisdiction to create an account and use
          TimeCoins.
        </p>
      </section>

      <section className="privacy-section">
        <h2>3. Account Responsibilities</h2>
        <ul>
          <li>
            You are responsible for maintaining the confidentiality of your
            account.
          </li>
          <li>
            You must provide accurate and up-to-date information during
            registration.
          </li>
          <li>You agree not to share your account credentials with others.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>4. Use of TimeCoins</h2>
        <ul>
          <li>
            TimeCoins can be used for transactions, payments, and transfers
            within the platform.
          </li>
          <li>
            The value of TimeCoins may fluctuate due to market conditions and
            demand.
          </li>
          <li>
            We do not guarantee any profits, investments, or returns from
            holding TimeCoins.
          </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>5. Prohibited Activities</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use TimeCoins for illegal transactions or fraudulent activities.
          </li>
          <li>
            Attempt to hack, disrupt, or compromise the platform’s security.
          </li>
          <li>Engage in money laundering or terrorist financing.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>6. Risk Disclaimer</h2>
        <p>
          The use of TimeCoins involves financial risks. You understand that
          digital assets may increase or decrease in value and that you are
          solely responsible for your decisions and losses.
        </p>
      </section>

      <section className="privacy-section">
        <h2>7. Limitation of Liability</h2>
        <p>
          TimeCoins is not liable for any indirect, incidental, or consequential
          damages arising from your use of the platform, including but not
          limited to loss of funds, profits, or data.
        </p>
      </section>

      <section className="privacy-section">
        <h2>8. Modifications</h2>
        <p>
          We reserve the right to modify these Terms at any time. Updates will
          be posted on this page with a revised “Last updated” date.
        </p>
      </section>

      <section className="privacy-section">
        <h2>9. Governing Law</h2>
        <p>
          These Terms & Conditions shall be governed by and construed in
          accordance with the laws of your jurisdiction.
        </p>
      </section>

      <section className="privacy-section">
        <h2>10. Contact Us</h2>
        <p>
          For questions regarding these Terms & Conditions, please contact us
          at:{" "}
          <a className="condition" href="mailto:support@timecoins.com">
            support@timecoins.com
          </a>
        </p>
      </section>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">About Us</h1>
      <p className="privacy-updated">Welcome to TimeCoins</p>

      <section className="privacy-section">
        <h2>Who We Are</h2>
        <p>
          <strong>TimeCoins</strong> is a next-generation digital currency
          platform designed to make financial transactions faster, smarter, and
          more transparent. Built with cutting-edge blockchain-inspired
          technology, our mission is to provide a secure and scalable way for
          individuals and businesses to exchange value in real time.
        </p>
      </section>

      <section className="privacy-section">
        <h2>Our Mission</h2>
        <p>
          To empower people with a reliable digital currency that grows with
          market demand, ensuring safe and efficient transactions across the
          globe. TimeCoins is more than just a coin — it represents trust,
          innovation, and financial freedom.
        </p>
      </section>

      <section className="privacy-section">
        <h2>Our Vision</h2>
        <p>
          We envision a world where digital assets are seamlessly integrated
          into everyday life, enabling secure payments, investments, and
          financial opportunities for everyone — anytime, anywhere.
        </p>
      </section>

      <section className="privacy-section">
        <h2>Our Core Values</h2>
        <ul>
          <li>
            <strong>Security:</strong> Protecting your data and funds with
            enterprise-grade encryption.
          </li>
          <li>
            <strong>Transparency:</strong> Building trust with clear policies
            and fair practices.
          </li>
          <li>
            <strong>Innovation:</strong> Continuously improving to meet the
            evolving needs of our users.
          </li>
          <li>
            <strong>Community:</strong> Creating a platform where every user has
            a voice.
          </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>Our Team</h2>
        <p>
          TimeCoins was founded by passionate innovators, software engineers,
          and financial experts who believe in transforming how people use
          money. Together, we are building a strong ecosystem where technology
          meets trust.
        </p>
      </section>

      <section className="privacy-section">
        <h2>Join Us</h2>
        <p>
          Whether you’re an individual, developer, or business, you can be part
          of the <strong>TimeCoins</strong> revolution. Connect, trade, and grow
          with us as we redefine the future of digital transactions.
        </p>
      </section>

      <section className="privacy-section">
        <h2>Contact Us</h2>
        <p>
          Have questions or want to collaborate? Reach out to us at{" "}
          <a className="condition" href="mailto:support@timecoins.com">
            support@timecoins.com
          </a>
        </p>
      </section>
    </div>
  );
};

const Disclaimer = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Disclaimer</h1>
      <p className="privacy-updated">Last updated: September 25, 2025</p>

      <section className="privacy-section">
        <h2>1. Educational Purpose</h2>
        <p>
          The <strong>TimeCoins</strong> platform has been developed primarily
          for educational and demonstration purposes. It is not intended to
          represent a fully operational financial product.
        </p>
      </section>

      <section className="privacy-section">
        <h2>2. No Financial Advice</h2>
        <p>
          TimeCoins does not provide investment, financial, or trading advice.
          Any use of TimeCoins or related information is at your own risk.
        </p>
      </section>

      <section className="privacy-section">
        <h2>3. Risk of Digital Assets</h2>
        <p>
          Digital currencies may fluctuate in value and carry significant risks.
          You should carefully evaluate your own circumstances and not rely on
          this project for financial decision-making.
        </p>
      </section>

      <section className="privacy-section">
        <h2>4. Limitation of Liability</h2>
        <p>
          The developers of TimeCoins are not responsible for any losses,
          damages, or consequences that may arise from using this project,
          whether directly or indirectly.
        </p>
      </section>

      <section className="privacy-section">
        <h2>5. External Links</h2>
        <p>
          Any external resources or links provided within the project are for
          informational purposes only. We are not responsible for the content or
          practices of third-party sites.
        </p>
      </section>
    </div>
  );
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been submitted.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Contact Us</h1>
      <p className="privacy-updated">
        We'd love to hear from you! Please reach out using the form below.
      </p>

      <section className="privacy-section">
        <h2>Get in Touch</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Message:</label>
            <textarea
              name="message"
              placeholder="Write your message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <button type="submit" className="contact-btn">
            Send Message
          </button>
        </form>
      </section>

      <section className="privacy-section">
        <h2>Other Ways to Reach Us</h2>
        <p>
          Email:{" "}
          <a className="condition" href="mailto:support@timecoins.com">
            support@timecoins.com
          </a>
        </p>
        <p>Phone: +91 98765 43210</p>
        <p>Address: TimeCoins HQ, Innovation Tower, Tech Park, India</p>
      </section>
    </div>
  );
};

export { PrivacyPolicy, TermsAndConditions, AboutUs, Disclaimer, ContactUs };
