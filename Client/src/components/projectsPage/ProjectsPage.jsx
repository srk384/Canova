import "./ProjectsPageStyle.css";
import { useGetProjectsQuery } from "../../utils/redux/api/ProjectAPI";
import ProjectComponent from "../common/ProjectComponent";

const ProjectsPage = () => {
  const {
    data: projects,
    isLoading: loadingProjects,
    isError: errorProjects,
  } = useGetProjectsQuery("projects/projects");
  return (
    <div className="projectsPage-body">
      <div className="projectsPage-container">
        <h1 className="projectsPage-title">Welcome to CANOVA</h1>
        <div className="projectsPage-inner-container">
          <div className="projectsPage-recentWorks">
            {projects &&
              projects.map((project) => (
                <ProjectComponent
                  key={project._id}
                  data={{
                    name: project.name,
                    id: project._id,
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
