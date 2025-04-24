import { useState } from "react";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import "./styles.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="toggle-button"
      >
        {isLogin ? "Create an account" : "Already have an account?"}
      </button>
    </div>
  );
};

export default AuthPage;
