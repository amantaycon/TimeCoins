import React, { useEffect } from "react";
import "../assets/css/companylist.css";
import { useSelector } from "react-redux";
import axiosInstance from "../axios";

const gradients = [
  "linear-gradient(90deg, #667eea, #764ba2)",
  "linear-gradient(90deg, #ff9966, #ff5e62)",
  "linear-gradient(90deg, #56ccf2, #2f80ed)",
  "linear-gradient(90deg, #11998e, #38ef7d)",
  "linear-gradient(90deg, #f7971e, #ffd200)",
];

const CompanyList = ({ companyList, setCompanyDetail }) => {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosInstance.get("/value/company/list");
        setCompanyDetail(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanies();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/value/company/approve/${id}`);
      const res = await axiosInstance.get("/value/company/list");
      setCompanyDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async (id, type) => {
    try {
      const voteData = { companyId: id, userVote: type };
      await axiosInstance.post(`/u/add-or-update`, voteData);
      const res = await axiosInstance.get("/value/company/list");
      setCompanyDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="company-list-wrapper">
      <h1 className="company-header">📊 Coin Linked Companies</h1>

      <div className="company-list">
        {companyList && companyList.length > 0 ? (
          companyList.map((company, index) => {
            const totalVotes = (company.upVotes || 0) + (company.downVotes || 0);
            const upPercent =
              totalVotes > 0
                ? ((company.upVotes / totalVotes) * 100).toFixed(1)
                : 0;
            const downPercent =
              totalVotes > 0
                ? ((company.downVotes / totalVotes) * 100).toFixed(1)
                : 0;

            return (
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

                {/* Company Info */}
                <div className="company-content">
                  <div>
                    <h2 className="company-name">{company.companyName}</h2>
                    <p className="company-detail">
                      <strong>Ticker:</strong> {company.tickerSymbol}
                    </p>
                    <p className="company-detail">
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${company.email}`}>{company.email}</a>
                    </p>
                    <p className="company-detail">
                      <strong>Website:</strong>{" "}
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {company.website}
                      </a>
                    </p>
                  </div>
                  <p className="company-date">
                    {new Date(company.createAt).toLocaleDateString()}
                  </p>
                </div>

                <hr className="hr"/>

                {/* Approval + Voting */}
                <div className="company-actions">
                  <div className="approval-section">
                    {company.approve ? (
                      <span className="approved">✅ Approved</span>
                    ) : user?.admin ? (
                      <button
                        className="approve-btn approve-btn1"
                        onClick={() => handleApprove(company.id)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="not-approved">❌ Not Approved</span>
                    )}
                  </div>

                  <div className="vote-section">
                    {company.userVote ? (
                      <div className="vote-result">
                        <div className="vote-bar">
                          <div
                            className="vote-up"
                            style={{ width: `${upPercent}%` }}
                          >
                            👍 {upPercent}%
                          </div>
                          <div
                            className="vote-down"
                            style={{ width: `${downPercent}%` }}
                          >
                            👎 {downPercent}%
                          </div>
                        </div>
                        <p className="your-vote">
                          You voted:{" "}
                          <strong>
                            {company.userVote === "UP" ? "👍 Up" : "👎 Down"}
                          </strong>
                        </p>
                      </div>
                    ) : (
                      <div className="vote-buttons">
                        <button
                          className="upvote-btn"
                          onClick={() => handleVote(company.id, "UP")}
                        >
                          👍 Upvote
                        </button>
                        <button
                          className="downvote-btn"
                          onClick={() => handleVote(company.id, "DOWN")}
                        >
                          👎 Downvote
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-data">No company data available.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
