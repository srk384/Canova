import { Link, useNavigate } from "react-router-dom";
import AuthWrapper from "./AuthWrapper/AuthWrapper";
import ShowSvg from "../svgs/ShowSvg";
import HideSvg from "../svgs/HideSvg";
import { useState } from "react";
import { useAuthenticationMutation } from "../../utils/redux/api/AuthAPI";
import LoadingFallback from "../LoadingFallback/LoadingFallback";
import { toast } from "react-toastify";

const Singnup = () => {
  const [authentication, { isLoading, isError }] = useAuthenticationMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({});
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const notify = () => toast("User created successfully!");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      setError({ confirmPassword: true });
      return;
    }
    delete signupForm.confirmPassword;
    try {
      const { user, token } = await authentication({
        action: "signup",
        post: signupForm,
      }).unwrap();

      localStorage.setItem("token", token);

      setError({});
      if (user) {
        notify()
        navigate("/dashboard/homepage");
      }
    } catch (error) {
      console.log("err:", error);
      if (error.data.error.includes("User already exist"))
        setError({ userexist: true });
    }
  };

  return (
    <AuthWrapper>
      <div>
        <div>
          <h2 className="login-title">Welcome CANOVA 👋</h2>
          <p className="login-subtitle">
            Today is a new day. It's your day. You shape it.
            <br />
            Sign in to start managing your projects.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              name="name"
              type="name"
              placeholder="Name"
              required
              onChange={handleChange}
            />
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Example@email.com"
              required
              onChange={handleChange}
            />

            <label>Create Password</label>
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
            {error.userexist && (
              <div className="error">User already exist, Please Sign In.</div>
            )}
            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
              style={{ marginTop: "15px" }}
            >
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
                " Sign up"
              )}
            </button>
          </form>

          <p className="signup-text">
            Don&apos;t you have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Singnup;
