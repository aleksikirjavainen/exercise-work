import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/Auth";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Files from "./pages/Files";
import MyFiles from "./pages/Files/MyFiles";
import FileUpload from "./pages/Files/FileUpload";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/files" element={<PrivateRoute><Files /></PrivateRoute>} />
      <Route path="/files/upload" element={<PrivateRoute><FileUpload /></PrivateRoute>} />
      <Route path="/files/my-files" element={<PrivateRoute><MyFiles /></PrivateRoute>} />
    </Routes>
  );
};

export default App;
