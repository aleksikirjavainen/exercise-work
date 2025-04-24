import { Outlet } from "react-router-dom";
import LogoutButton from "../LogoutButton";

const Layout = () => {
  return (
    <div style={{ padding: "2rem", position: "relative" }}>
      <LogoutButton />
      <Outlet />
    </div>
  );
};

export default Layout;
