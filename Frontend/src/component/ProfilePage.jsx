import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "lucide-react";
import { HeadNav } from "./Component";
import axiosInstance from "../axios";
import "../assets/css/profile.css";
import Error404 from "./Error404";

const ProfilePage = ({ user }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/u/userdetail/${username}`);
        setUserData(res.data);
        console.log(res.data)
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(true);
      }
    };
    fetchUser();
  }, [username]);

  if (error) return <Error404 />;

  if (!userData) return null; // nothing while fetching

  return (
    <div className="dashboard-bg">
      <HeadNav user={user} />

      {/* Banner */}
      <div className="profile-cover"></div>

      {/* Profile Container */}
      <div className="profile-container">
        {/* Header */}
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
            <h2 className="fullname">{userData?.fullName || "Unnamed User"}</h2>
            <p className="username">@{userData?.username || "unknown"}</p>
            <p className="email">{userData?.email || "No email provided"}</p>
            <p className="joined">
              Joined: {userData?.joined || "Unknown"}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="profile-info">
          <div className="about-card">
            <h3>About</h3>
            <p>
              {userData?.about ||
                "This user hasn’t written anything about themselves yet."}
            </p>
          </div>
          <div className="stats-card">
            <h3>Stats</h3>
            <p><strong>Followers:</strong> {userData?.followers || 0}</p>
            <p><strong>Following:</strong> {userData?.following || 0}</p>
            <p><strong>Posts:</strong> {userData?.posts || 0}</p>
          </div>
        </div>

        {/* Future */}
        <div className="future-components">
          📌 Future components (Posts, Activity, etc.) will appear here...
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
