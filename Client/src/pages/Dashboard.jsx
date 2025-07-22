import FormPage from "../components/formPage/FormPage"
import HomePage from "../components/homePage/HomePage"
import ProjectsPage from "../components/projectsPage/ProjectsPage"
import Sidebar from "../components/sidebar/Sidebar"

const Dashboard = ({children}) => {
        console.log(children?.type.name)

  return (
    <div className="dashboard-container" style={{display:"flex"}}>
       <Sidebar page = {children?.type.name}/>
       {/* <HomePage/> */}
      {/* <ProjectsPage/> */}
      {children}
      {/* <FormPage/> */}

      
    </div>
  )
}

export default Dashboard
