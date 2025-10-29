import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../axios";
import { Wallet } from "lucide-react";
import { HeadNav } from "./Component";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "../assets/css/wallet.css";
import PayPalPayment from "./PayPalPayment";

const WalletPage = () => {
  const user = useSelector((state) => state.auth.user);

  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [payableInRupees, setPayableInRupees] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const txRes = await axiosInstance.get(
        `/u/external/transaction_list?page=${page}&size=10`
      );

      const newData = txRes.data?.content || [];
      const meta = txRes.data?.page;
      setTransactions((prev) => [...prev, ...newData]);
      const nextPage = meta.number + 1;
      setHasMore(nextPage < meta.totalPages);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        fetchTransactions();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const balanceRes = await axiosInstance.get("/u/balance");
        setBalance(balanceRes.data?.coin || 0);
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
      }
    };

    fetchWalletData();
  }, []);

  // Step 1: Calculate payable INR and show modal
  const handleAddMoney = async () => {
    if (amount <= 0) return;
    try {
      const res = await axiosInstance.get("/value/inrupees");
      const coinValue = res.data;
      const payableAmountInRupees = coinValue * amount;

      setPayableInRupees(payableAmountInRupees);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to calculate payable amount:", error);
    }
  };

  // Step 2: On successful PayPal payment
  const handlePaymentSuccess = async (details) => {
    alert("✅ Payment Successful!\n" + JSON.stringify(details, null, 2));
    setAmount(0);
    setPayableInRupees(0);
    setShowModal(false);

    // Refresh balance
    try {
      const balanceRes = await axiosInstance.get("/u/balance");
      setBalance(balanceRes.data?.coin || 0);
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  };

  return (
    <div className="dashboard-bg min-h-screen">
      <HeadNav user={user} />

      <div className="dashboard-container p-6">
        <h1 className="dashboard-title text-3xl font-bold mb-6">My Wallet</h1>

        {/* Wallet Section */}
        <div className="wallet-section grid gap-6 md:grid-cols-2">
          <div className="wallet-balance-card bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
            <Wallet size={40} className="text-blue-500 mb-2" />
            <h2 className="text-xl font-semibold">Current Balance</h2>
            <p className="wallet-amount text-2xl font-bold mt-2">
              TC {balance}
            </p>
          </div>

          <div className="wallet-add-money bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Add Money to Wallet</h3>
            <div className="flex gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Enter TimeCoins"
                className="flex-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              />
              <button
                onClick={handleAddMoney}
                className="wallet-add-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                disabled={amount <= 0}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="wallet-transactions bg-white rounded-2xl shadow p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>

          {transactions.length === 0 && !hasMore ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="divide-y">
              {transactions.map((tx, idx) => (
                <li key={idx} className="py-3 text-sm text-gray-700">
                  <p>
                    <strong>Transaction ID:</strong> {tx.transactionId}
                  </p>

                  <div className="flex justify-between font-medium">
                    <span
                      className={`tx-type ${tx.transactionType?.toLowerCase()}`}
                    >
                      {tx.transactionType}:
                    </span>
                    <span>TC {tx.timecoins}</span>
                  </div>

                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    <p>
                      <strong>Description:</strong> {tx.description}
                    </p>
                    <p>
                      <strong>Paid:</strong> {tx.localAmount} {tx.localCurrency}
                    </p>
                    <p>
                      <strong>PayPal Tx ID:</strong> {tx.localTransationId}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(tx.transactionDate).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}

              {loading && (
                <p className="text-center py-3 text-gray-500">
                  Loading more...
                </p>
              )}

              {!hasMore && (
                <p className="text-center py-3 text-gray-400">
                  No more transactions.
                </p>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Confirm Payment</h2>
            <p>
              You are about to pay{" "}
              <span style={{ fontWeight: "bold", color: "#2563eb" }}>
                ₹{payableInRupees}
              </span>{" "}
              for <span style={{ fontWeight: "bold" }}>{amount}</span>{" "}
              TimeCoins.
            </p>

            {/* PayPal Section */}
            <div style={{ marginTop: "20px" }}>
              <PayPalPayment
                payableInRupees={payableInRupees}
                handlePaymentSuccess={handlePaymentSuccess}
              />
            </div>

            {/* Cancel Button */}
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
