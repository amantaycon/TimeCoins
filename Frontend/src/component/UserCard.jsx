import React from "react";
import AvatarColor from "./AvatarColor";
import { useSelector } from "react-redux";

const UserCard = ({ user, onClick, isSelected }) => {
  const liveUser = useSelector((state) => state.auth.user);
  const notificationUsers = useSelector((state) => state.notifications.notificationUsers);


  return (
    <div
      className={`user-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      {liveUser.webNotification && notificationUsers.some((u) => u === user.userId) && <span className="badge"></span>}

      <div
        className="avatar"
        style={{ backgroundColor: AvatarColor(user.userId) }}
      >
        {user.fullName.charAt(0).toUpperCase()}
      </div>
      <div className="user-info">
        <div className="user-name">{user.fullName}</div>
        <div className="user-username">@{user.username}</div>
      </div>
    </div>
  );
};

export default UserCard;
