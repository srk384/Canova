import { useLocation } from "react-router-dom";
import HomePage from "../components/dashboard/homePage/HomePage";
import Sidebar from "../components/dashboard/sidebar/Sidebar";

const Dashboard = ({ children }) => {

  const { pathname } = useLocation();
  const path = pathname.split("/")[2];

  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      {!children && (
        <>
          <Sidebar page={"homepage"} />
          <HomePage />
        </>
      )}

      {children && (
        <>
          <Sidebar page={path} />
          {children}
        </>
      )}
    </div>
  );
};

export default Dashboard;
