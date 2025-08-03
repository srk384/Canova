import { toast } from "react-toastify";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useRenameProjectMutation,
} from "../../../utils/redux/api/ProjectAPI";
import ProjectComponent from "../../common/projectComponent/ProjectComponent";
import SpinnerOverlay from "../../common/spinnerOverlay/SpinnerOverlay";
import "./ProjectsPageStyle.css";

const ProjectsPage = () => {
  const {
    data: projects,
    isLoading,
    isError,
    refetch
  } = useGetProjectsQuery("projects/projects");

  const [deleteProject] = useDeleteProjectMutation();
  const [renameProject] = useRenameProjectMutation();

  const handleProjectDelete = async (id) => {
    if (confirm("Are you sure, you want to delete?"))
      await deleteProject(id).unwrap();
    toast.success("Project deleted");
    refetch()
  };

  const handleProjectRename = async (id, newName) => {
    await renameProject({ id, name: newName }).unwrap();
    toast.success("Project renamed");
    refetch()
  };

  return (
    <div className="projectsPage-body">
      <div className="projectsPage-container">
        <h1 className="projectsPage-title">Welcome to CANOVA</h1>
        <div className="projectsPage-inner-container">
          <SpinnerOverlay loading={isLoading}>
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
                    onDelete={(id) => {
                      handleProjectDelete(id);
                    }}
                    onRename={(id, newName) => {
                      handleProjectRename(id, newName);
                    }}
                  />
                ))}
            </div>
          </SpinnerOverlay>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
