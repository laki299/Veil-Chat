import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/userService";
import { useEffect } from "react";

export default function Preference() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const [genderPreference, setGenderPreference] = useState("any");
  const [ageRange, setAgeRange] = useState("any");
  const [chatType, setChatType] = useState("normal");

  useEffect(() => {
    getUserProfile(currentUser.uid).then(setProfile);
  }, [currentUser]);

  const handleStart = () => {
    // পরে Waiting পেজে নিয়ে যাব
    navigate("/waiting", {
      state: {
        genderPreference,
        ageRange,
        chatType,
        myGender: profile?.gender || "male",
        myAgeRange: getAgeRange(profile?.age)
      }
    });
  };

  return (
    <div className="container">
      <button
        onClick={() => navigate(-1)}
        style={{ background: "transparent", color: "#aaa", marginBottom: 20, padding: 0 }}
      >
        ← ফিরে যান
      </button>

      <h2 style={{ marginBottom: 24 }}>কাকে খুঁজছেন?</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>জেন্ডার</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { value: "any", label: "যে কেউ" },
            { value: "male", label: "ছেলে" },
            { value: "female", label: "মেয়ে" }
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGenderPreference(opt.value)}
              style={{
                flex: 1,
                background: genderPreference === opt.value ? "#2481cc" : "#1c1c1c",
                border: "1px solid #333"
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>বয়স রেঞ্জ</label>
        <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
          <option value="any">যে কোনো বয়স</option>
          <option value="18-22">১৮–২২</option>
          <option value="23-27">২৩–২৭</option>
          <option value="28-35">২৮–৩৫</option>
          <option value="35+">৩৫+</option>
        </select>
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>চ্যাট টাইপ</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setChatType("normal")}
            style={{
              flex: 1,
              background: chatType === "normal" ? "#2481cc" : "#1c1c1c",
              border: "1px solid #333"
            }}
          >
            সাধারণ চ্যাট
          </button>
          <button
            type="button"
            onClick={() => setChatType("sex")}
            style={{
              flex: 1,
              background: chatType === "sex" ? "#c0392b" : "#1c1c1c",
              border: "1px solid #333"
            }}
          >
            সেক্স চ্যাট
          </button>
        </div>
      </div>

      <button onClick={handleStart} style={{ width: "100%", padding: 16 }}>
        খোঁজা শুরু করুন
      </button>
    </div>
  );
}

function getAgeRange(age) {
  if (!age) return "any";
  if (age <= 22) return "18-22";
  if (age <= 27) return "23-27";
  if (age <= 35) return "28-35";
  return "35+";
      }
