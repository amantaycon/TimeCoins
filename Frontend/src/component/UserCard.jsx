import React from "react";
import AvatarColor from "./AvatarColor";

const UserCard = ({ user, onClick, isSelected }) => (
  <div
    className={`user-card ${isSelected ? "selected" : ""}`}
    onClick={onClick}
  >
    {user.unreadCount != 0 ? (
      <span className="badge">{user.unreadCount}</span>
    ) : (
      <></>
    )}

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

export default UserCard;
