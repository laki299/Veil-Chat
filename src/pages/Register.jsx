import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("পাসওয়ার্ড দুটো মিলছে না");
      return;
    }

    if (form.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form.email, form.password, form.phone, form.displayName);
      navigate("/profile-setup");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে");
      } else {
        setError("রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button
        onClick={() => navigate(-1)}
        style={{ background: "transparent", color: "#aaa", marginBottom: 20, padding: 0 }}
      >
        ← ফিরে যান
      </button>

      <h2 style={{ marginBottom: 8 }}>অ্যাকাউন্ট তৈরি করুন</h2>
      <p style={{ color: "#aaa", marginBottom: 24, fontSize: 14 }}>
        Veil-এ যোগ দিন
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <input
            name="displayName"
            placeholder="নাম"
            value={form.displayName}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <input
            name="email"
            type="email"
            placeholder="ইমেইল"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <input
            name="phone"
            type="tel"
            placeholder="মোবাইল নাম্বার"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <input
            name="password"
            type="password"
            placeholder="পাসওয়ার্ড"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <input
            name="confirmPassword"
            type="password"
            placeholder="পাসওয়ার্ড আবার লিখুন"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p style={{ color: "#ff6b6b", marginBottom: 14 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "তৈরি হচ্ছে..." : "রেজিস্টার করুন"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 24, color: "#aaa" }}>
        আগে থেকে অ্যাকাউন্ট আছে?{" "}
        <Link to="/login" style={{ color: "#2481cc" }}>
          লগইন করুন
        </Link>
      </p>
    </div>
  );
          }
