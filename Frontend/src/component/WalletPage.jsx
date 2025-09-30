import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../axios";
import { Wallet } from "lucide-react";
import { HeadNav } from "./Component";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "../assets/css/wallet.css";

const WalletPage = () => {
  const user = useSelector((state) => state.auth.user);

  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [payableInRupees, setPayableInRupees] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const balanceRes = await axiosInstance.get("/u/balance");
        setBalance(balanceRes.data?.coin || 0);

        const txRes = await axiosInstance.get("/u/external/transaction_list");
        setTransactions(txRes.data?.content || []);
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
        setBalance(0);
        setTransactions([]);
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
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="divide-y">
              {transactions.map((tx, idx) => (
                <li
                  key={idx}
                  className="transaction-item flex justify-between py-2 text-sm"
                >
                  <span className={`tx-type ${tx.type?.toLowerCase()}`}>
                    {tx.type}
                  </span>
                  <span>₹{tx.amount}</span>
                  <span>{new Date(tx.date).toLocaleString()}</span>
                </li>
              ))}
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
              <PayPalScriptProvider
                options={{
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, // replace this
                  currency: "USD",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "pill" }}
                  forceReRender={[payableInRupees]}
                  createOrder={(data, actions) => {
                    const usdAmount = (payableInRupees / 88.78).toFixed(2);

                    // PayPal will error if amount < 0.01
                    if (usdAmount < 0.01) {
                      alert("Amount too small for PayPal payment.");
                      return;
                    }

                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            value: usdAmount,
                            currency_code: "USD",
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    console.log("✅ Payment Approved:", details);
                    handlePaymentSuccess(details); // your handler
                  }}
                  onError={(err) => {
                    console.error("❌ PayPal Checkout Error:", err);
                    alert("Payment failed. Please try again.");
                  }}
                />
              </PayPalScriptProvider>
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
