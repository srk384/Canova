import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProjectMutation,
  useGetFormsQuery,
  useGetProjectsQuery,
} from "../../../utils/redux/api/ProjectAPI";
import FormComponent from "../../common/FormComponent";
import LoadingFallback from "../../common/LoadingFallback/LoadingFallback";
import ProjectComponent from "../../common/ProjectComponent";
import CreateProjectModal from "../modal/CreateProjectModal";
import "./HomePage.css";

const HomePage = () => {
  const [isCreateProjectClicked, setIsCreateProjectClicked] = useState(false);
  const [createProject, { isLoading, isError, error }] =
    useCreateProjectMutation();
  const navigate = useNavigate();

  const {
    data: forms,
    isLoading: loadingForms,
    isError: errorForms,
    refetch: refetchForms,
  } = useGetFormsQuery("forms/forms");
  const {
    data: projects,
    isLoading: loadingProjects,
    isError: errorProjects,
    refetch: refetchProjects,
  } = useGetProjectsQuery("projects/projects");

  const handleCreateForm = async () => {
    const { data } = await createProject({
      action: "forms/create-form",
      project: "",
    });

    if (data.success) {
      navigate(`/form-builder/${data.form._id}`);
      console.log("Form created");
      refetchForms();
    }
  };

  //  if (loadingProjects || loadingForms || !projects || !forms) {
  //     return <LoadingFallback />;
  //   }

  

  return (
    <div
      className="homepage-body"
      style={
        isCreateProjectClicked ? { overflowY: "hidden" } : { overflowY: "auto" }
      }
    >
      <div className="homepage-container">
        <h1 className="homepage-title">Welcome to CANOVA</h1>
        <div className="homepage-inner-container">
          <div className="homepage-action">
            <div
              className="homepage-project"
              onClick={() => setIsCreateProjectClicked(true)}
            >
              <div className="project-img-container">
                <img src="/svgs/projectWhite.svg" alt="" />
              </div>
              <h3>Start From scratch</h3>
              <p>Create your first Project now</p>
            </div>

            <div className="homepage-form" onClick={handleCreateForm}>
              <div className="project-img-container">
                <img src="/svgs/form.svg" alt="" />
              </div>
              <h3>Create Form</h3>
              <p>create your first Form now</p>
            </div>
          </div>

          {/* recent Works */}

          <h3 className="homepage-recentWorks-title">Recent Works</h3>

          <div className="homepage-recentWorks">
            {forms &&
              forms.slice(0, 4).map((form) => (
                <FormComponent
                  key={form._id}
                  data={{
                    name: form.name,
                    draft: form.isDraft,
                    id: form._id,
                  }}
                />
              ))}
            {forms?.length === 0 && projects?.length === 0 && (
              <div className="no-recentWorks">No recent work to display</div>
            )}
            {projects &&
              projects.slice(0, 4).map((project) => (
                <ProjectComponent
                  key={project._id}
                  data={{
                    name: project.name,
                    id: project._id,
                  }}
                />
              ))}
          </div>

          {/* shared Works */}

          <h3 className="homepage-recentWorks-title">Shared Works</h3>

          <div className="homepage-recentWorks" style={{ marginBottom: "0px" }}>
            <div className="no-recentWorks">No Shared work to display</div>

            {/* <FormComponent /> */}
            {/* <FormComponent /> */}
            {/* <ProjectComponent />
            <ProjectComponent /> */}
          </div>
        </div>
      </div>
      {isCreateProjectClicked && (
        <CreateProjectModal
          onClose={() => {
            setIsCreateProjectClicked(false);
            refetchProjects();
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
