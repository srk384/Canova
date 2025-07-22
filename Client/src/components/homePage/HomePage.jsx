import FormComponent from "../common/FormComponent";
import CreateProjectModal from "../modal/CreateProjectModal";
import ProjectComponent from "../common/ProjectComponent";
import "./HomePage.css";
import { useState, useEffect } from "react";
import {
  useCreateProjectMutation,
  useGetFormsQuery,
  useGetProjectsQuery,
} from "../../utils/redux/api/ProjectAPI";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isCreateProjectClicked, setIsCreateProjectClicked] = useState(false);
  const [createProject, { isLoading, isError, error }] =
    useCreateProjectMutation();
  const navigate = useNavigate();

  const {
    data: forms,
    isLoading: loadingForms,
    isError: errorForms,
  } = useGetFormsQuery("forms/forms");
  const {
    data: projects,
    isLoading: loadingProjects,
    isError: errorProjects,
  } = useGetProjectsQuery("projects/projects");

  // console.log(forms);
  // console.log(projects);

  const handleCreateForm = async () => {
    const { data } = await createProject({
      action: "create-form",
      project: "",
    });

    if (data.message.includes("Form created.")) {
      //   navigate(`/form-builder/${data.formId}`);
      console.log("Form created");
    }
  };

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
                <img src="../svgs/projectWhite.svg" alt="" />
              </div>
              <h3>Start From scratch</h3>
              <p>Create your first Project now</p>
            </div>

            <div className="homepage-form" onClick={handleCreateForm}>
              <div className="project-img-container">
                <img src="../svgs/form.svg" alt="" />
              </div>
              <h3>Create Form</h3>
              <p>create your first Form now</p>
            </div>
          </div>

          {/* recent Works */}

          <h3 className="homepage-recentWorks-title">Recent Works</h3>

          <div className="homepage-recentWorks">
            {forms &&
              forms.map((form) => (
                <FormComponent
                  key={form._id}
                  data={{
                    name: form.name,
                    draft: form.isDraft,
                    id: form._id,
                  }}
                />
              ))}

            {projects &&
              projects.map((project) => (
                <ProjectComponent
                  key={project._id}
                  data={{
                    name: project.name,
                    id:project._id
                  }}
                />
              ))}
          </div>

          {/* shared Works */}

          <h3 className="homepage-recentWorks-title">Shared Works</h3>

          <div className="homepage-recentWorks" style={{ marginBottom: "0px" }}>
            {/* <FormComponent /> */}
            {/* <FormComponent /> */}
            {/* <ProjectComponent />
            <ProjectComponent /> */}
          </div>
        </div>
      </div>
      {isCreateProjectClicked && (
        <CreateProjectModal onClose={() => setIsCreateProjectClicked(false)} />
      )}
    </div>
  );
};

export default HomePage;
