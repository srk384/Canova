import { useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { lazy, Suspense } from "react";
import LoadingFallback from "../components/common/LoadingFallback/LoadingFallback";

const LazyComponent = lazy(() =>
  import("../components/dashboard/homePage/HomePage")
);

const Dashboard = ({ children }) => {
  const { pathname } = useLocation();
  const path = pathname.split("/")[2];

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <div className="dashboard-container" style={{ display: "flex" }}>
          {!children && (
            <>
              <Sidebar page={"homepage"} />
              <LazyComponent />
            </>
          )}

          {children && (
            <>
              <Sidebar page={path} />
              {children}
            </>
          )}
        </div>
      </Suspense>
    </>
  );
};

export default Dashboard;
