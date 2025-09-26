import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationUsers } from "../store/notificationSlice";

const UserListPanel = ({ selectedUser }) => {
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [frequentUsers, setFrequentUsers] = useState([]); // keep a backup
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  // Load frequent users initially
  const loadFrequentUsers = async () => {
    try {
      const res = await axios.post("/u/message/listpanel");
      const otherUsers = res.data.content;
      setUsers(otherUsers || []);
      setFrequentUsers(otherUsers || []); // store original list
      const notificationUserIds = otherUsers
                .filter((u) => u.hasSeen === false)
                .map((u) => u.userId);
      
              // Update redux globally
              dispatch(setNotificationUsers(notificationUserIds));

    } catch (error) {
      console.error(
        "Freq user History List API error:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    loadFrequentUsers();
  }, []);

  // Handle search
  useEffect(() => {
    if (search.trim() === "") {
      // if search cleared → reset back to frequent users
      setUsers(frequentUsers);
      return;
    }

    const searchUser = async () => {
      try {
        const res = await axios.post(`/u/search/user?search=${search}`);
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    };

    const delay = setTimeout(() => {
      searchUser();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, frequentUsers]);

  return (
    <div className="user-list-panel">
      <input
        className="user-search"
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="user-list">
        {users.map((u, idx) => (u.userId != user.id &&
          <UserCard
            key={idx}
            user={u}
            isSelected={selectedUser?.username === u.username}
            onClick={() => {navigate(`/${u.username}/message`)}}
          />
        ))}
      </div>
    </div>
  );
};

export default UserListPanel;
