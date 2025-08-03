import { useState } from "react";
import "./CreateProjectModalStyle.css";
import {
  useCreateProjectMutation,
  useGetProjectsQuery,
} from "../../../../utils/redux/api/ProjectAPI";
import { useNavigate } from "react-router-dom";

const CreateProjectModal = ({ onClose }) => {
  const [createProjectForm, setCreateProjectForm] = useState({});
  const [createProject, { isLoading, isError, error }] =
    useCreateProjectMutation();
  const { refetch } = useGetProjectsQuery("projects/projects");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await createProject({
      action: "projects/create-project",
      project: createProjectForm,
    });

    if (data.message.includes("Project and form created.")) {
      navigate(`/form-builder/${data.formId}`);
      console.log("Project created");
      refetch();
    }
  };

  return (
    <div className="create-project-modal-body" onClick={onClose}>
      <div
        className="create-project-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-header">
          <img
            src="../svgs/cube.svg"
            alt="Project Icon"
            className="modal-icon"
          />
          <button className="modal-close-btn" onClick={onClose}>
            <img src="../svgs/close.svg" alt="Close" />
          </button>
        </div>

        <h2 className="modal-title">Create Project</h2>
        <p className="modal-subtitle">
          Provide your project a name and start with your journey
        </p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label">Project Name</label>
          <input
            name="projectName"
            type="text"
            placeholder="Project Name"
            className="modal-input"
            required
            onChange={(e) =>
              setCreateProjectForm({
                ...createProjectForm,
                [e.target.name]: e.target.value,
              })
            }
          />

          <label className="modal-label">Form Name</label>
          <input
            name="formName"
            type="text"
            placeholder="Form Name"
            className="modal-input"
            required
            onChange={(e) =>
              setCreateProjectForm({
                ...createProjectForm,
                [e.target.name]: e.target.value,
              })
            }
          />
          <button className="modal-create-btn" disabled={isLoading}>
            {isLoading ? (
              <div
                className="spinner"
                style={{
                  width: "18px",
                  height: "18px",
                  borderWidth: "3px",
                  margin: "auto",
                }}
              ></div>
            ) : (
              " Create"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
