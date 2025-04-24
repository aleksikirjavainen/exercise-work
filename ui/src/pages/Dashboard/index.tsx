import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
    navigate("/auth");
  }, [navigate]);

  const navigateToFiles = () => {
    navigate("/files");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          handleLogout();
        } else {
          setEmail(data.email);
          setLoading(false);
        }
      } catch (err) {
        handleLogout();
      }
    };

    fetchUser();
  }, [handleLogout]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to your dashboard</h2>
      <p>Logged in as: <strong>{email}</strong></p>
      <button onClick={navigateToFiles} style={{ marginTop: "1rem" }}>
        Files
      </button>
    </div>
  );
};

export default Dashboard;
