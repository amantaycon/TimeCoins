import React, { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import axiosInstance from "../axios";
import MessageContent from "./MessageContent";

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};


const MessageBox = ({ selectedUser, user, onBack }) => {
  const [messages, setMessages] = useState([]);

  const messageHistory = async (id) => {
    try {
      const res = await axiosInstance.post(`/u/message/history?id=${id}`);
      setMessages(res.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedUser) messageHistory(selectedUser.id);
  }, [selectedUser]);

  return (
    <div className="message-box">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="message-header">
            <button className="back-btn" onClick={onBack}>
              ← Back
            </button>
            Chatting with <strong>{selectedUser.fullName}</strong>
          </div>

          {/* Messages */}
          <div className="message-history">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-card ${
                  msg.senderId === user.id ? "me" : "other"
                }`}
              >
                <MessageContent msg={msg}/>

                <div className="message-meta">
                  <span>{formatDate(msg.timestamp)}</span> ·{" "}
                  <span>{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <MessageInput selectedUser={selectedUser} user={user} />
        </>
      ) : (
        <div className="select-user-placeholder">
          Select a user to start messaging
        </div>
      )}
    </div>
  );
};

export default MessageBox;
