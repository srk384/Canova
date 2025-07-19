import AuthWrapper from "./AuthWrapper/AuthWrapper";
import ShowSvg from "../svgs/ShowSvg";
import HideSvg from "../svgs/HideSvg";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthenticationMutation } from "../../utils/redux/api/AuthAPI";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [updatedPassword, setUpdatedPassword] = useState({});
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [authentication, { isLoading, isError }] = useAuthenticationMutation();

  const email = state?.email;
  
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const notify = () => toast("Password updated successfully");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPassword({ ...updatedPassword, [name]: value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updatedPassword.password !== updatedPassword.confirmPassword) {
      setError({ confirmPassword: true });
      return;
    }
    delete updatedPassword.confirmPassword;

    try {
      const { message } = await authentication({
        action: "reset-password",
        post: { ...updatedPassword, email },
      }).unwrap();

      console.log(message);

      if (message.includes("Password updated successfully")) {
        notify();
        navigate("/login");
      }
    } catch (error) {
      console.log("Varification error:", error);
      if (error.data.error.includes("OTP verification required")) {
        setError({ notVerified: true });
      }
    }
  };

  return (
    <AuthWrapper>
      <h2 className="login-title">Create New Password</h2>
      <p className="login-subtitle">
        Today is a new day. It's your day. You shape it.
        <br />
        Sign in to start managing your projects.
      </p>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Enter New Password</label>
        <div className="password-input">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="at least 8 characters"
            minLength={8}
            required
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword && <ShowSvg />}
            {showPassword && <HideSvg />}
          </span>
        </div>

        <label>Confirm Password</label>
        <div className="password-input">
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="at least 8 characters"
            minLength={8}
            required
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword && <ShowSvg />}
            {showPassword && <HideSvg />}
          </span>
        </div>

        {error.confirmPassword && (
          <div className="error">Password does not match</div>
        )}
        {error.notVerified && (
          <div className="error">OTP verification required</div>
        )}

        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? (
            <div
              className="spinner"
              style={{
                width: "16px",
                height: "16px",
                borderWidth: "3px",
                margin: "auto",
              }}
            ></div>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthWrapper>
  );
};

export default ResetPassword;
