import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Frontend route protection: ensures only authenticated users can access children
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include", // Send cookies to allow backend authentication
        });

        setAuthenticated(res.ok); // If 200 OK, user is authenticated
      } catch {
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) return <p>Loading...</p>;

  // If not authenticated, redirect to login page
  return authenticated ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
