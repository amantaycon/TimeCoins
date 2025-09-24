import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, Coins, MapPin, Briefcase } from "lucide-react";
import { HeadNav } from "./Component";
import axiosInstance from "../axios";
import "../assets/css/profile.css";
import Error404 from "./Error404";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const ProfilePage = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/u/userdetail/${username}`);
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(true);
      }
    };
    fetchUser();
  }, [username]);

  if (error) return <Error404 />;
  if (!userData) return null;

  return (
    <div className="dashboard-bg">
      <HeadNav user={user} />

      {/* Banner */}
      <div className="profile-cover">
        <div className="transactions-badge">
          <span>{userData?.totalTransaction || 0}</span>
          <small>Transactions</small>
        </div>
      </div>

      {/* Profile Container */}
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-left">
            {userData?.profilePic ? (
              <img
                src={userData.profilePic}
                alt={userData.username}
                className="profile-pic"
              />
            ) : (
              <User className="profile-pic-icon" />
            )}
          </div>

          <div className="profile-right">
            <div className="profile-top-row">
              <div>
                <h2 className="fullname">
                  {userData?.fullName || "Unnamed User"}
                </h2>
                <p className="username">@{userData?.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="profile-info">
          {/* About */}
          <div className="about-card">
            <h3>About</h3>
            <p>{userData?.bio || "This user hasn't added a bio yet."}</p>
            {userData?.role && (
              <p className="info-line">
                <Briefcase size={16} /> {userData.role}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="stats-card">
            <h3>Stats</h3>
            <p>Total Transactions: {userData?.totalTransaction || 0}</p>
            <p>Member Since: {formatDate(userData?.joined)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
