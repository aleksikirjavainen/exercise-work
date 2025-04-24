import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      navigate("/auth");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        padding: "0.5rem 1rem",
        background: "#eee",
        border: "1px solid #ccc",
        cursor: "pointer",
      }}
    >
      Log out
    </button>
  );
};

export default LogoutButton;