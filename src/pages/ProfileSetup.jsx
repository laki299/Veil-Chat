import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/userService";

export default function ProfileSetup() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    age: "",
    gender: "male",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const ageNum = Number(form.age);
    if (!ageNum || ageNum < 18 || ageNum > 80) {
      setError("বয়স ১৮ থেকে ৮০ এর মধ্যে হতে হবে");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(currentUser.uid, {
        age: ageNum,
        gender: form.gender,
        bio: form.bio.trim(),
        profileCompleted: true
      });
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("সেভ করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: 8 }}>প্রোফাইল সম্পূর্ণ করুন</h2>
      <p style={{ color: "#aaa", marginBottom: 24, fontSize: 14 }}>
        আরও কিছু তথ্য দিন
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>বয়স</label>
          <input
            name="age"
            type="number"
            placeholder="আপনার বয়স"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>জেন্ডার</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="male">ছেলে</option>
            <option value="female">মেয়ে</option>
            <option value="other">অন্যান্য</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>
            হালকা পরিচয় (ঐচ্ছিক)
          </label>
          <textarea
            name="bio"
            placeholder="কী করেন, শখ ইত্যাদি..."
            value={form.bio}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {error && <p style={{ color: "#ff6b6b", marginBottom: 14 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "সেভ হচ্ছে..." : "পরবর্তী"}
        </button>
      </form>
    </div>
  );
        }
