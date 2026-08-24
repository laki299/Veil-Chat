import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/userService";
import { logoutUser } from "../services/authService";

export default function Home() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserProfile(currentUser.uid);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: 30, marginTop: 10 }}>
        <h1 style={{ fontSize: 32, marginBottom: 4 }}>Veil</h1>
        <p style={{ color: "#aaa", fontSize: 14 }}>Anonymous. Real. Private.</p>
      </div>

      <div className="card">
        <p style={{ fontSize: 18, fontWeight: 600 }}>
          {profile?.displayName || "User"}
        </p>
        <p style={{ color: "#aaa", fontSize: 14, marginTop: 4 }}>
          {profile?.age ? `${profile.age} বছর` : ""} ·{" "}
          {profile?.gender === "male"
            ? "ছেলে"
            : profile?.gender === "female"
            ? "মেয়ে"
            : "অন্যান্য"}
        </p>
        {profile?.bio && (
          <p style={{ marginTop: 10, fontSize: 14, color: "#aaa" }}>{profile.bio}</p>
        )}
      </div>

      <button
        style={{ width: "100%", marginBottom: 12, padding: 16 }}
        onClick={() => alert("ম্যাচিং সিস্টেম পরবর্তী ধাপে যোগ হবে")}
      >
        নতুন বন্ধু খুঁজুন
      </button>

      <button
        style={{
          width: "100%",
          marginBottom: 12,
          padding: 16,
          background: "#1c1c1c",
          border: "1px solid #333"
        }}
        onClick={() => alert("চ্যাট লিস্ট পরবর্তী ধাপে যোগ হবে")}
      >
        চ্যাট লিস্ট
      </button>

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          marginTop: 30,
          background: "transparent",
          border: "1px solid #555",
          color: "#ff6b6b"
        }}
      >
        লগআউট
      </button>
    </div>
  );
        }
