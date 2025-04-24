import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Files from "./pages/Files";
import MyFiles from "./pages/Files/MyFiles";
import FileUpload from "./pages/Files/FileUpload";
import Layout from "./components/Layout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/files" element={<Files />} />
        <Route path="/files/upload" element={<FileUpload />} />
        <Route path="/files/my-files" element={<MyFiles />} />
      </Route>
    </Routes>
  );
};

export default App;
