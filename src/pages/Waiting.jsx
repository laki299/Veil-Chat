import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { joinWaitingQueue, leaveWaitingQueue, findMatch } from "../services/matchingService";

export default function Waiting() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const preferences = location.state;

  const [status, setStatus] = useState("খুঁজছি...");
  const cancelled = useRef(false);

  useEffect(() => {
    if (!preferences) {
      navigate("/home");
      return;
    }

    let intervalId;

    async function start() {
      try {
        await joinWaitingQueue(currentUser.uid, preferences);
        setStatus("অপেক্ষা করছি...");

        intervalId = setInterval(async () => {
          if (cancelled.current) return;

          try {
            const result = await findMatch(currentUser.uid, preferences);
            if (result) {
              clearInterval(intervalId);
              navigate("/chat", {
                state: {
                  chatId: result.chatId,
                  partnerId: result.partnerId,
                  chatType: preferences.chatType
                }
              });
            }
          } catch (err) {
            console.error(err);
          }
        }, 3000);
      } catch (err) {
        console.error(err);
        setStatus("সমস্যা হয়েছে");
      }
    }

    start();

    return () => {
      cancelled.current = true;
      clearInterval(intervalId);
      leaveWaitingQueue(currentUser.uid).catch(() => {});
    };
  }, [currentUser, preferences, navigate]);

  const handleCancel = async () => {
    cancelled.current = true;
    await leaveWaitingQueue(currentUser.uid);
    navigate("/home");
  };

  return (
    <div className="container" style={{ textAlign: "center", paddingTop: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🔍</div>
      <h2 style={{ marginBottom: 8 }}>{status}</h2>
      <p style={{ color: "#aaa", marginBottom: 40 }}>
        {preferences?.chatType === "sex" ? "সেক্স চ্যাট" : "সাধারণ চ্যাট"} খুঁজছি...
      </p>

      <button
        onClick={handleCancel}
        style={{
          background: "transparent",
          border: "1px solid #555",
          color: "#fff"
        }}
      >
        বাতিল করুন
      </button>
    </div>
  );
        }
