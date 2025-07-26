import { useGetProjectsQuery } from "../../../utils/redux/api/ProjectAPI";
import LoadingFallback from "../../common/LoadingFallback/LoadingFallback";
import ProjectComponent from "../../common/ProjectComponent";
import "./ProjectsPageStyle.css";

const ProjectsPage = () => {
  const {
    data: projects,
    isLoading,
    isError,
  } = useGetProjectsQuery("projects/projects");

  {isLoading && <LoadingFallback/>}
  return (
    <div className="projectsPage-body">
      <div className="projectsPage-container">
        <h1 className="projectsPage-title">Welcome to CANOVA</h1>
        <div className="projectsPage-inner-container">
          <div className="projectsPage-recentWorks">
            {projects?.length === 0 && (
              <div className="no-recentWorks">No Projects to display</div>
            )}
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
