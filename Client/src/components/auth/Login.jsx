import { Link, useNavigate } from "react-router-dom";
import AuthWrapper from "./AuthWrapper/AuthWrapper";
import ShowSvg from "../svgs/ShowSvg";
import HideSvg from "../svgs/HideSvg";
import { useAuthenticationMutation } from "../../utils/redux/api/AuthAPI";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [authentication, { isLoading, isError }] = useAuthenticationMutation();
  const [signinForm, setSigninForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const notify = () => toast("Welcome CANOVA 👋");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninForm({ ...signinForm, [name]: value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user, token } = await authentication({
        action: "signin",
        post: signinForm,
      }).unwrap();

      localStorage.setItem("token", token);

      
      if (user) {
        notify();
        navigate("/dashboard/homepage");
      }
    } catch (error) {
      console.log("err:", error);

      if (error.data.error.includes("Incorrect Password"))
        setError({ incorrectPassword: true });

      if (error.data.error.includes("User does not exist"))
        setError({ incorrectEmail: true });
    }
  };

  return (
    <AuthWrapper>
      <h2 className="login-title">Welcome CANOVA 👋</h2>
      <p className="login-subtitle">
        Today is a new day. It's your day. You shape it.
        <br />
        Sign in to start managing your projects.
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Example@email.com"
          required
          onChange={handleChange}
        />
        {error.incorrectEmail && (
          <div className="error">Email does not exist</div>
        )}
        <label>Password</label>
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
        {error?.incorrectPassword && (
          <div className="error">Password is incorrect</div>
        )}

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

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
            " Sign in"
          )}
        </button>
      </form>

      <p className="signup-text">
        Don&apos;t you have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthWrapper>
  );
};

export default Login;
