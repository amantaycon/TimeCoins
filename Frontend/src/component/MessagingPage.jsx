import React, { useEffect, useState } from "react";
import "../assets/css/messaging.css";
import UserListPanel from "./UserListPanel";
import MessageBox from "./MessageBox";
import { HeadNav } from "./Component";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { useSelector } from "react-redux";
import { WebSocketProvider } from "../context/WebSocketContext";

const MessagingPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();

  // Fetch user detail when a username is selected via URL
  useEffect(() => {
    if (username) {
      const fetchDetail = async () => {
        try {
          const res = await axiosInstance.get(`/u/userdetail/${username}`);
          setSelectedUser(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchDetail();
    }else{
      setSelectedUser(null);
    }
  }, [username]);

  // Back action (mobile view or swipe back)
  const handleBack = () => {
    navigate("/u/message");
    setSelectedUser(null);
  };

  return (
    <>
      <HeadNav />
      <div
        className={`messaging-page ${
          selectedUser ? "show-message-box" : "show-user-list"
        }`}
      >
        {/* User List */}
        <UserListPanel
          selectedUser={selectedUser}
        />

        {/* Message Box */}
        <WebSocketProvider>
        <MessageBox
          selectedUser={selectedUser}
          user={user}
          onBack={handleBack}
        />
        </WebSocketProvider>
      </div>
    </>
  );
};

export default MessagingPage;
