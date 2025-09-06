import React, { useState } from 'react';
import '../assets/css/floting.css';

const usersData = [
  { name: 'Aman Kumar', username: 'amank' },
  { name: 'Priya Sharma', username: 'priyash' },
  { name: 'Rohit Singh', username: 'rohits' },
  { name: 'Simran Jain', username: 'simranj' },
  { name: 'Ankit Raj', username: 'ankitraj' },
  { name: 'Neha Yadav', username: 'nehay' },
];

const avatarColor = (name) => {
  const colors = ['#0288d1', '#26a69a', '#7e57c2', '#ef5350', '#ffa726'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const UserSearchFloating = () => {
  const [query, setQuery] = useState('');

  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="floating-user-search">
      <input
        type="text"
        className="search-input"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={index} className="user-card">
              <div
                className="avatar"
                style={{ backgroundColor: avatarColor(user.name) }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-username">@{user.username}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No users found</div>
        )}
      </div>
    </div>
  );
};

export default UserSearchFloating;
