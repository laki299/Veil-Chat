import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
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

      <h2 style={{ marginBottom: 8 }}>লগইন করুন</h2>
      <p style={{ color: "#aaa", marginBottom: 24, fontSize: 14 }}>
        আপনার অ্যাকাউন্টে প্রবেশ করুন
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <input
            type="email"
            placeholder="ইমেইল"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <input
            type="password"
            placeholder="পাসওয়ার্ড"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "#ff6b6b", marginBottom: 14 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 24, color: "#aaa" }}>
        অ্যাকাউন্ট নেই?{" "}
        <Link to="/register" style={{ color: "#2481cc" }}>
          রেজিস্টার করুন
        </Link>
      </p>
    </div>
  );
}
