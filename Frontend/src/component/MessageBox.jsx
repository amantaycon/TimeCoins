import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import axiosInstance from "../axios";
import MessageContent from "./MessageContent";
import { useWebSocket } from "../context/WebSocketContext";

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
  const [showNewMsgAlert, setShowNewMsgAlert] = useState(false);
  const { subscribe, connected } = useWebSocket();
  const messagesEndRef = useRef(null);
  const historyRef = useRef(null);

  // Auto scroll logic
  const scrollToBottom = (smooth = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const isAtBottom = () => {
    if (!historyRef.current) return true;
    const { scrollTop, clientHeight, scrollHeight } = historyRef.current;
    return scrollHeight - scrollTop <= clientHeight + 10; // small buffer
  };

  // Handle incoming messages
  useEffect(() => {
    if (!connected) return;

    const subscription = subscribe("/user/queue/messages", (message) => {
      setMessages((prev) => [...prev, message]);

      if (isAtBottom()) {
        // If user is already at bottom, scroll
        setTimeout(() => scrollToBottom(true), 50);
      } else {
        // If user is reading older messages, show alert
        setShowNewMsgAlert(true);
      }
    });

    return () => subscription && subscription.unsubscribe();
  }, [connected, subscribe]);

  // Fetch history
  const messageHistory = async (id) => {
    try {
      const res = await axiosInstance.post(`/u/message/history?id=${id}`);
      setMessages(res.data.content);
      setTimeout(scrollToBottom, 100); // scroll after loading history
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
          <div className="message-history" ref={historyRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-card ${
                  msg.senderId === user.id ? "me" : "other"
                }`}
              >
                <MessageContent msg={msg} />

                <div className="message-meta">
                  <span>{formatDate(msg.timestamp)}</span> ·{" "}
                  <span>{formatTime(msg.timestamp)}</span>
                </div>
                <div className="delivery-status">
                  {msg.delivered && msg.senderId === user.id ? "✓" : ""}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* New message alert */}
          {showNewMsgAlert && (
            <div
              className="new-message-badge"
              onClick={() => {
                scrollToBottom(true);
                setShowNewMsgAlert(false);
              }}
            >
              ⬇️ New messages
            </div>
          )}

          {/* Input */}
          <MessageInput selectedUser={selectedUser} user={user} messageData={setMessages} />
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
