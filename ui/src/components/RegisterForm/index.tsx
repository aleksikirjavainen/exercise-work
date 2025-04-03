import React from "react";
import { useState } from "react";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== retypePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
      } else {
        setSuccess(data.message);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
      <input type="password" placeholder="Retype Password" value={retypePassword} required onChange={(e) => setRetypePassword(e.target.value)} />

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
