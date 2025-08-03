import "./SidebarStyle.css";
import { Link } from "react-router-dom";

const Sidebar = ({ page }) => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <img src="/svgs/smallLogo.svg" alt="" />
      </div>
      <ul className="sidebar-ul">
        <Link to={"/dashboard/homepage"}>
          <li className={page === "homepage" ? "selected-li" : ""}>
            <img src="/svgs/home.svg" alt="" />
            <span>Home</span>
          </li>
        </Link>
        <li className={page === "AnalysisPage" ? "selected-li" : ""}>
          <img src="/svgs/analysis.svg" alt="" />
          <span>Analysis</span>
        </li>
        <Link to={"/dashboard/projects"}>
          <li className={page === "projects" ? "selected-li" : ""}>
            <img src="/svgs/project.svg" alt="" />
            <span>Projects</span>
          </li>
        </Link>
      </ul>
      <Link to={"/profile"}>
        <div className="sidebar-profile">
          <img src="/svgs/profile.svg" alt="" />
          <span>Profile</span>
        </div>
      </Link>
    </aside>
  );
};

export default Sidebar;
