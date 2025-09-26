import React, { useEffect, useState } from "react";
import "../assets/css/companylist.css";
import { useSelector } from "react-redux";
import Error404 from "./Error404";
import axiosInstance from "../axios";

const gradients = [
  "linear-gradient(90deg, #667eea, #764ba2)", // purple-blue
  "linear-gradient(90deg, #ff9966, #ff5e62)", // orange-red
  "linear-gradient(90deg, #56ccf2, #2f80ed)", // light blue
  "linear-gradient(90deg, #11998e, #38ef7d)", // green
  "linear-gradient(90deg, #f7971e, #ffd200)", // yellow-orange
];

const CompanyList = ({ companyList, setCompanyDetail }) => {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const companiesName = async () => {
      try {
        const res = await axiosInstance.get("/value/company/list");
        setCompanyDetail(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    companiesName();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/value/company/approve/${id}`);
      // refresh list
      const res = await axiosInstance.get("/value/company/list");
      setCompanyDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async (id, type) => {
    try {
      await axiosInstance.post(`/value/company/vote/${id}/${type}`);
      // refresh list
      const res = await axiosInstance.get("/value/company/list");
      setCompanyDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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

              {/* Approve or Vote buttons */}
              <div className="company-actions">
                {/* Approval section */}
                {company.approve ? (
                  <button className="approve-btn" disabled>
                    ✅ Approved
                  </button>
                ) : user?.admin ? (
                  <button
                    className={"approve-btn " + (user?.admin ?"approve-btn1":"")}
                    onClick={() => handleApprove(company.id)}
                  >
                    Approve
                  </button>
                ) : (
                  <button className="approve-btn" disabled>
                    ❌ Not Approved
                  </button>
                )}

                {/* Voting section (everyone can vote) */}
                <div className="vote-buttons">
                  <button
                    className="upvote-btn"
                    onClick={() => handleVote(company.id, "up")}
                  >
                    👍 Upvote
                  </button>
                  <button
                    className="downvote-btn"
                    onClick={() => handleVote(company.id, "down")}
                  >
                    👎 Downvote
                  </button>
                </div>
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
