import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosInstance from "../axios";

export default function PayPalPayment({ payableInRupees, handlePaymentSuccess }) {
  
  const createOrder = async () => {
    try {
      const usdAmount = parseFloat((payableInRupees / 88.78).toFixed(2));

      if (usdAmount < 0.01) {
        alert("Amount too small for PayPal payment.");
        return;
      }

      const response = await axiosInstance.post("/paypal/create-order", {
        amount: usdAmount,
      });

      return response.data.orderId;
    } catch (error) {
      console.error("❌ Error creating PayPal order:", error);
      alert("Failed to create PayPal order. Please try again.");
    }
  };

  const onApprove = async (data) => {
    try {
      const response = await axiosInstance.post("/paypal/capture-order", {
        orderId: data.orderID,
      });

      console.log("✅ Payment Captured:", response.data);
      handlePaymentSuccess(response.data);

    } catch (error) {
      console.error("❌ Error capturing PayPal order:", error);
      alert("Payment verification failed. Please try again.");
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "pill" }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error("❌ PayPal Checkout Error:", err);
          alert("Payment failed. Please try again.");
        }}
      />
    </PayPalScriptProvider>
  );
}
