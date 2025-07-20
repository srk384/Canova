import HomePage from "../components/homePage/HomePage"
import Sidebar from "../components/sidebar/Sidebar"

const Dashboard = () => {
  return (
    <div className="dashboard-container" style={{display:"flex"}}>
       <Sidebar/>
       <HomePage/>
    </div>
  )
}

export default Dashboard
