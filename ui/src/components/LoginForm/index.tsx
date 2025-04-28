import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Handles user login: securely sends credentials and manages authentication flow
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include HttpOnly cookies for secure session management
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        navigate("/dashboard"); // Redirect after successful authentication
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
