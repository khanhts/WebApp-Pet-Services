import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Redirect({ new_path }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if new_path is a valid URL
    if (!new_path || typeof new_path !== "string") {
      console.error("Invalid new_path provided for redirect:", new_path);
      return;
    }

    // Perform the redirection
    navigate(new_path, { replace: true });
  }, []);
  return (
    <div>
      <h1>Redirecting...</h1>
      <p>Please wait while we redirect you to the appropriate page.</p>
    </div>
  );
}
