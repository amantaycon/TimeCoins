import React, { useState } from "react";
import CompanyList from "./CompanyList";
import "../assets/css/AdminAddCompany.css";
import { HeadNav } from "./Component";
import { useSelector } from "react-redux";
import axiosInstance from "../axios";

const AdminAddCompany = () => {
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [companyList, setCompanyDetail] = useState([]);
  const [company, setCompany] = useState({
    name: "",
    email: "",
    website: "",
    tickerSymbol: "",
    sharePrice: "",
    shareToken: "",
    totalToken: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      const num = value === "" ? "" : parseFloat(value);

      // allow empty for editing, or numbers >= 0
      if (value === "" || num >= 0) {
        setCompany({ ...company, [name]: value });
      }
    } else {
      setCompany({ ...company, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      companyName: company.name,
      tickerSymbol: company.tickerSymbol,
      sharePrice: company.sharePrice,
      shareToken: company.shareToken,
      totalToken: company.totalToken,
      email: company.email,
      website: company.website,
    };
    const res = await axiosInstance.post("/value/company/add", data);
    setCompanyDetail((prev) => [...prev, res.data]);
    // 🚀 Here you’ll make your API call to save the company details
    setCompany({
      name: "",
      email: "",
      website: "",
      tickerSymbol: "",
      sharePrice: "",
      shareToken: "",
      totalToken: "",
    });
    setIsOpen(false);
  };

  return (
    <>
      <HeadNav />
      <div className="admin-container">
        {/* Centered Button */}
        <div className="button-wrapper">
          <button className="add-company-btn" onClick={() => setIsOpen(true)}>
            + Add Company
          </button>
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Add Company</h2>
              <form onSubmit={handleSubmit} className="company-form">
                <label>Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={company.name}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />

                <label>Ticker Symbol</label>
                <input
                  type="text"
                  name="tickerSymbol"
                  value={company.tickerSymbol}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />

                <label>Share Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="sharePrice"
                  value={company.sharePrice}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                />

                <label>Share Token</label>
                <input
                  type="number"
                  step="0.01"
                  name="shareToken"
                  value={company.shareToken}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                />

                <label>Total Token</label>
                <input
                  type="number"
                  step="0.01"
                  name="totalToken"
                  value={company.totalToken}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={company.email}
                  onChange={handleChange}
                  required
                />

                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={company.website}
                  onChange={handleChange}
                />

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List of Companies */}
        <CompanyList
          setCompanyDetail={setCompanyDetail}
          companyList={companyList}
        />
      </div>
    </>
  );
};

export default AdminAddCompany;
