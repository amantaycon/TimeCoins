import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axiosInstance from "../axios";
import { HeadNav } from "./Component";
import "../assets/css/markettrand.css";
import CompanyList from "./CompanyList";

const MarketTrendPage = ({ user }) => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1m");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get(`/value/history?range=${range}`);
        if (isMounted) {
          const formatted = res.data.map((item) => ({
            ...item,
            dateTimeFormatted: new Date(item.period).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
            value: item.avgValue, // use avgValue directly
          }));

          setData(formatted);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        if (isMounted) setError("Failed to load market trends.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [range]);

  

  return (
    <div className="dashboard-bg">
      <HeadNav />

      <div className="dashboard-container">
        <h1 className="dashboard-title">TimeCoins Market Trends</h1>

        <div className="flex justify-end mb-4">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="p-2 rounded border border-gray-300"
          >
            <option value="1m">Last 1 Month</option>
            <option value="2m">Last 2 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last 1 Year</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="market-chart-card">
          {loading ? (
            <p className="text-center text-gray-500">Loading chart...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : data.length === 0 ? (
            <p className="text-center text-gray-500">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateTimeFormatted" stroke="#0288d1" />
                <YAxis stroke="#0288d1" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0288d1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <CompanyList />
      </div>
    </div>
  );
};

export default MarketTrendPage;
