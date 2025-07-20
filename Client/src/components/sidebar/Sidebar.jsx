import "./SidebarStyle.css";

const Sidebar = () => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <img src="../public/svgs/smallLogo.svg" alt="" />
      </div>
      <ul className="sidebar-ul">
        <li>
          <img src="../public/svgs/home.svg" alt="" />
          <span>Home</span>
        </li>
        <li>
          <img src="../public/svgs/analysis.svg" alt="" />
          <span>Analysis</span>
        </li>
        <li>
          <img src="../public/svgs/project.svg" alt="" />
          <span>Projects</span>
        </li>
      </ul>
      <div className="sidebar-profile">
        <img src="../public/svgs/profile.svg" alt="" />
        <span>Profile</span>
      </div>
    </aside>
  );
};

export default Sidebar;
