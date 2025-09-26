import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import axiosInstance from "../axios";
import MessageContent from "./MessageContent";
import { useWebSocket } from "../context/WebSocketContext";
import { useDispatch } from "react-redux";
import { addNotificationUser, removeNotificationUser } from "../store/notificationSlice";

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
  const dispatch = useDispatch();
  let page = 0;

  // 🔹 Refs to always hold latest values
  const selectedUserRef = useRef(selectedUser);
  const isAtBottomRef = useRef(() => true);
  const scrollToBottomRef = useRef(() => {});

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Auto scroll logic
  const scrollToBottom = (smooth = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };
  scrollToBottomRef.current = scrollToBottom;

  const isAtBottom = () => {
    if (!historyRef.current) return true;
    const { scrollTop, clientHeight, scrollHeight } = historyRef.current;
    return scrollHeight - scrollTop <= clientHeight + 10;
  };
  isAtBottomRef.current = isAtBottom;

  // Handle incoming messages
  useEffect(() => {
    if (!connected) return;

    const subscription = subscribe("/user/queue/messages", (message) => {
      const currentUser = selectedUserRef.current;

      console.log(message)
      if (message.type === "Money" || (currentUser && message.senderId === currentUser.id)) {
        setMessages((prev) => [...prev, message]);
      } else {
        dispatch(addNotificationUser(message.senderId));
      }

      if (isAtBottomRef.current()) {
        setTimeout(() => scrollToBottomRef.current(true), 50);
      } else {
        setShowNewMsgAlert(true);
      }
    });

    return () => subscription && subscription.unsubscribe();
  }, [connected, subscribe, dispatch]);

  // Detect manual scroll
  useEffect(() => {
    const historyEl = historyRef.current;
    if (!historyEl) return;

    const handleScroll = () => {
      if (isAtBottomRef.current()) {
        setShowNewMsgAlert(false);
      }
    };

    historyEl.addEventListener("scroll", handleScroll);
    return () => historyEl.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch history
  const messageHistory = async (id) => {
    try {
      const res = await axiosInstance.post(`/u/message/history?id=${id}&&page=${page}`);
      const loadedMessages = res.data.content;

      setMessages(loadedMessages);

      // remove from notification list
      dispatch(removeNotificationUser(id));

      if (loadedMessages.length > 0) {
        const receivedMessages = loadedMessages.filter((msg) => msg.receiverId === user.id);
        const lastMessage = receivedMessages[receivedMessages.length - 1];
        if (lastMessage) {
          await axiosInstance.put(`/u/message/${lastMessage.id}/seen`);
        }
      }

      setTimeout(() => scrollToBottomRef.current(), 100);
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
                className={`message-card ${msg.senderId === user.id ? "me" : "other"}`}
              >
                <MessageContent msg={msg} />
                <div className="message-meta">
                  <span>{formatDate(msg.timestamp)}</span> ·{" "}
                  <span>{formatTime(msg.timestamp)}</span>
                </div>
                <div className="delivery-status">
                  {msg.senderId === user.id &&
                    (msg.delivered ? "✓" : "")}
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
                scrollToBottomRef.current(true);
                setShowNewMsgAlert(false);
              }}
            >
              ⬇️ New messages
            </div>
          )}

          {/* Input */}
          <MessageInput
            selectedUser={selectedUser}
            user={user}
            setMessageData={setMessages}
            scrollToBottom={scrollToBottom}
          />
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
