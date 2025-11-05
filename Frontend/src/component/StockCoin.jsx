import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import "../assets/css/stock.css";

const StockCoin = ({update}) => {
  const [stock, setStock] = useState({ remainingTimecoins: 0, totalTimeCoins: 0, currentCoinValue: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const res = await axiosInstance.get("/value/timecoins/stock");
        const { remainingTimecoins, totalTimeCoins, currentCoinValue } = res.data;

        const soldPercent = ((totalTimeCoins - remainingTimecoins) / totalTimeCoins) * 100;
        setStock({ remainingTimecoins, totalTimeCoins, currentCoinValue });
        setProgress(soldPercent);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };

    fetchStockData();
  }, [update]);

  return (
    <div className="available-stock">
      <i className="fa-solid fa-coins"></i>

      <div className="stock-info">
        <span>Available in Stock:</span>
        <strong>{stock.remainingTimecoins.toLocaleString()}</strong> /
        <strong>{stock.totalTimeCoins.toLocaleString()}</strong>
        <span className="tc-label">TC</span>
      </div>

      <div className="stock-progress">
        <div
          className="stock-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="coin-value">
        Current Value:{" "}
        <strong style={{ color: "#2563eb" }}>
          ₹{stock.currentCoinValue.toFixed(2)}
        </strong>{" "}
        / TC
      </div>
    </div>
  );
};

export default StockCoin;