import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthWrapper from "./AuthWrapper/AuthWrapper";
import { useAuthenticationMutation } from "../../utils/redux/api/AuthAPI";

const ForgotPassword = () => {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const [authentication, { isLoading, isError }] = useAuthenticationMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message, OTP } = await authentication({
        action: "forgot-password",
        email,
      }).unwrap();

      console.log(message, OTP);

      if (!isLoading) setIsOTPSent(true);
    } catch (error) {
      console.log("Passowrd reset error:", error);
      if (error.data.error.includes("User not found")) {
        setError({ emailError: true });
      }
    }
  };
  const submitOTP = async (e) => {
    e.preventDefault();
    try {
      const { message } = await authentication({
        action: "verify-otp",
        post: { otp: OTP, email: email },
      }).unwrap();

      if (message.includes("OTP verified")) {
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      console.log("OTP error:", error);
      if (error.data.error.includes("Invalid or expired OTP")) {
        setError({ otpError: true });
      }
    }
  };
  return (
    <AuthWrapper>
      {!isOTPSent && (
        <>
          <h2 className="login-title">Welcome CANOVA 👋</h2>
          <p className="login-subtitle">
            Please enter your registered email ID to receive an OTP
          </p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your registered email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
                setError({});
              }}
            />
            {error.emailError && <div className="error">Email not found</div>}

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
                " Send Mail"
              )}
            </button>
          </form>
        </>
      )}

      {isOTPSent && (
        <>
          <h2 className="login-title">Enter Your OTP</h2>
          <p className="login-subtitle">
            We’ve sent a 6-digit OTP to your registered mail.
            <br />
            Please enter it below to sign in.
          </p>
          <form className="login-form" onSubmit={submitOTP}>
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter you OTP here"
              required
              onChange={(e) => {
                setOTP(e.target.value);
                setError({});
              }}
            />
            {error.otpError && (
              <div className="error">Invalid or expired OTP</div>
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
                " Confirm"
              )}
            </button>
          </form>
        </>
      )}
    </AuthWrapper>
  );
};

export default ForgotPassword;
