import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const UserListPanel = ({ selectedUser }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [frequentUsers, setFrequentUsers] = useState([]); // keep a backup
  const navigate = useNavigate();

  // Load frequent users initially
  const loadFrequentUsers = async () => {
    try {
      const res = await axios.post("/u/message/listpanel");
      setUsers(res.data.content || []);
      setFrequentUsers(res.data.content || []); // store original list
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
        {users.map((user, idx) => (
          <UserCard
            key={idx}
            user={user}
            isSelected={selectedUser?.username === user.username}
            onClick={() => {navigate(`/${user.username}/message`)}}
          />
        ))}
      </div>
    </div>
  );
};

export default UserListPanel;
