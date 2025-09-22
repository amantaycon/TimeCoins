import React from "react";
import "../assets/css/companylist.css";

const gradients = [
  "linear-gradient(90deg, #667eea, #764ba2)", // purple-blue
  "linear-gradient(90deg, #ff9966, #ff5e62)", // orange-red
  "linear-gradient(90deg, #56ccf2, #2f80ed)", // light blue
  "linear-gradient(90deg, #11998e, #38ef7d)", // green
  "linear-gradient(90deg, #f7971e, #ffd200)", // yellow-orange
];

const CompanyList = ({ companyList }) => {
  return (
    <div className="company-list-wrapper">
      <h1 className="company-header">Coin Linked Companies</h1>

      <div className="company-list">
        {companyList && companyList.length > 0 ? (
          companyList.map((company, index) => (
            <div key={company.id} className="company-card">
              {/* Progress Bar */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${company.sharesPercentage}%`,
                    background: gradients[index % gradients.length],
                  }}
                >
                  <span className="progress-text">
                    {company.sharesPercentage}%
                  </span>
                </div>
              </div>

              {/* Company Details */}
              <div className="company-content">
                <div>
                  <h2 className="company-name">{company.companyName}</h2>
                  <p className="company-detail">
                    Ticker: {company.tickerSymbol}
                  </p>
                </div>
                <p className="company-date">
                  {new Date(company.createAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No company data available.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
