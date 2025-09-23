import React, { useState } from "react";
import axiosInstance from "../axios";
import FloatingPayment from "./FloatingPayment";

const MessageInput = ({
  selectedUser,
  user,
  setMessageData,
  scrollToBottom,
}) => {
  const [message, setMessage] = useState("");
  const [paymentPopup, setPaymentPopup] = useState(false);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage === "" || !selectedUser) return;

    const messageJson = {
      senderId: user.id,
      receiverId: selectedUser.id,
      content: trimmedMessage,
      type: "Text",
    };

    try {
      const res = await axiosInstance.post("/u/message/push", messageJson);
      setMessageData((prev) => [...prev, res.data]);

      setTimeout(() => {
        scrollToBottom(true);
      }, 50);

      setMessage(""); // clear input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {paymentPopup && (
        <FloatingPayment
          selectedUser={selectedUser}
          user={user}
          onClose={() => {
            setPaymentPopup(false);
          }}
        />
      )}
      <div className="message-input-area">
        <input
          type="text"
          placeholder="Type a message..."
          className="text-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <div className="action-buttons">
          <button
            className="coin-btn"
            onClick={() => {
              setPaymentPopup(true);
            }}
          >
            Pay <span className="coin-highlight">TC</span>
          </button>
          <button className="send-btn" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
