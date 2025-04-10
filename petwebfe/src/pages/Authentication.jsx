import { useParams } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm";

export default function Authentication() {
  const params = useParams();
  const { action } = params;
  return (
    <div className="authentication-page">
      <div className="auth-forms">
        {action === "login" && <LoginForm />}
        {action === "register" && <RegisterForm />}
      </div>
    </div>
  );
}
