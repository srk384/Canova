import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateName, clearUser } from "../../utils/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./ProfilePage.css";
import { clearQuestions } from "../../utils/redux/slices/questionsSlice";
import { clearUi } from "../../utils/redux/slices/uiSlice";
import { clearBuilderState } from "../../utils/redux/slices/builderStateSlice";
import { setConditions } from "../../utils/redux/slices/conditionsSlice";
import { authApi } from "../../utils/redux/api/AuthAPI";
import { formAPI } from "../../utils/redux/api/FormAPI";
import { projectsApi } from "../../utils/redux/api/ProjectAPI";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nameInput, setNameInput] = useState(user?.name);

  useEffect(() => {
    if (!user) {
      navigate("/dashboard");
    }
  }, []);

  const handleSave = () => {
    dispatch(updateName(nameInput));
    alert("Name updated successfully!");
  };

  const handleDiscard = () => {
    setNameInput(user.name);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    dispatch(clearQuestions());
    dispatch(clearUi());
    dispatch(clearBuilderState());
    dispatch(setConditions([]));
    dispatch(authApi.util.resetApiState());
    dispatch(formAPI.util.resetApiState());
    dispatch(projectsApi.util.resetApiState());
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <aside className="sidebar">
        <Link to={"/dashboard"}>
          <div className="sidebar-logo">
            <img src="/svgs/smallLogo.svg" alt="" />
          </div>
        </Link>
        <div className="profile-info">
          <img src="/svgs/avatar.png" alt="avatar" className="avatar" />
          <div className="user-details">
            <p className="name">{user?.name}</p>
            <p className="email">{user?.email}</p>
          </div>
        </div>

        <ul className="menu">
          <li className="active">
            <div className="profile-settings-cont">
              <img src="/svgs/profile.svg" alt="" />
              <span>My Profile</span>
            </div>
            <img src="/svgs/rightIcon.svg" alt="" />
          </li>
          <li>
            <div className="profile-settings-cont">
              <img src="/svgs/settings.svg" alt="" />
              <span>Settings</span>
            </div>
            <img src="/svgs/rightIcon.svg" alt="" />
          </li>
          <li className="logout" onClick={handleLogout}>
            <div className="profile-settings-cont">
              <img src="/svgs/logout.svg" alt="" />
              <span>Log Out</span>
            </div>
          </li>
        </ul>
      </aside>
      <main className="profile-main-container">
        <div className="profile-main">
          <div className="heading-container">
            <h1>My Profile</h1>
          </div>
          <div className="profile-details">
            <div className="profile-header">
              <img
                src="/svgs/avatar.png"
                alt="avatar"
                className="avatar-large"
              />
              <div>
                <p className="name">{user?.name}</p>
                <p className="email">{user?.email}</p>
              </div>
            </div>

            <div className="profile-fields">
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Email account</label>
                <p>{user?.email}</p>
              </div>

              <div className="field">
                <label>Mobile number</label>
                <p>Add number</p>
              </div>

              <div className="field">
                <label>Location</label>
                <p>India</p>
              </div>
            </div>

            <div className="actions">
              <button className="btn-primary" onClick={handleSave}>
                Save Change
              </button>
              <button className="btn-secondary" onClick={handleDiscard}>
                Discard Change
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
