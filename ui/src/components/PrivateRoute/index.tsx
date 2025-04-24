import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        setAuthenticated(res.ok);
      } catch {
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) return <p>Loading...</p>;

  return authenticated ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
