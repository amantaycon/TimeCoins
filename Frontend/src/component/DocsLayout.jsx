import React, { useState } from "react";
import "../assets/css/PrivacyPolicy.css";
import {
  AboutUs,
  ContactUs,
  Disclaimer,
  PrivacyPolicy,
  TermsAndConditions,
} from "./PrivacyConponent";

const DocsLayout = () => {
  const [activePage, setActivePage] = useState("about");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case "about":
        return <AboutUs />;
      case "privacy":
        return <PrivacyPolicy />;
      case "terms":
        return <TermsAndConditions />;
      case "disclaimer":
        return <Disclaimer />;
      case "contact":
        return <ContactUs />;
      default:
        return <AboutUs />;
    }
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // auto-close sidebar on mobile
  };

  return (
    <div className="docs-container">
      {/* Top Bar for Mobile */}
      <header className="docs-header">
        <button
          className="menu-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <h1 className="header-title">TimeCoins Docs</h1>
      </header>

      {/* Sidebar */}
      <aside className={`docs-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li
            className={activePage === "about" ? "active" : ""}
            onClick={() => handleNavClick("about")}
          >
            About Us
          </li>
          <li
            className={activePage === "privacy" ? "active" : ""}
            onClick={() => handleNavClick("privacy")}
          >
            Privacy Policy
          </li>
          <li
            className={activePage === "terms" ? "active" : ""}
            onClick={() => handleNavClick("terms")}
          >
            Terms & Conditions
          </li>
          <li
            className={activePage === "disclaimer" ? "active" : ""}
            onClick={() => handleNavClick("disclaimer")}
          >
            Disclaimer
          </li>
          <li
            className={activePage === "contact" ? "active" : ""}
            onClick={() => handleNavClick("contact")}
          >
            Contact Us
          </li>
        </ul>
      </aside>

      {/* Content */}
      <main className="docs-content">{renderContent()}</main>
    </div>
  );
};

export default DocsLayout;
