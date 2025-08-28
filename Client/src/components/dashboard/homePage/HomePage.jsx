import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeleteFormMutation,
  useRenameFormMutation,
} from "../../../utils/redux/api/FormAPI";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useDeleteSharedAccessMutation,
  useGetFormsQuery,
  useGetProjectsQuery,
  useGetSharedFormsQuery,
  useRenameProjectMutation,
} from "../../../utils/redux/api/ProjectAPI";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import FormComponent from "../../common/formComponent/FormComponent";
import ProjectComponent from "../../common/projectComponent/ProjectComponent";
import SharedFormComponent from "../../common/sharedFormComponent/SharedFormComponent";
import SpinnerOverlay from "../../common/spinnerOverlay/SpinnerOverlay";
import CreateProjectModal from "../modal/createProject/CreateProjectModal";
import ShareModal from "../modal/shareModal/ShareModal";
import "./HomePage.css";

const HomePage = () => {
  const [isCreateProjectClicked, setIsCreateProjectClicked] = useState(false);
  const [createProject, { isLoading, isError, error }] =
    useCreateProjectMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ui } = useSelector((state) => state.uiSlice);

  const {
    data: forms,
    isLoading: loadingForms,
    isError: errorForms,
    refetch: refetchForms,
  } = useGetFormsQuery("forms/forms");

  const {
    data: sharedforms,
    isLoading: loadingsharedforms,
    isError: errorsharedforms,
    refetch: refetchsharedforms,
  } = useGetSharedFormsQuery("forms/sharedforms");

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

  const [deleteSharedAccess] = useDeleteSharedAccessMutation();

  const handleRemoveSharedAccess = async (formId) => {
    try {
      if (confirm("Are you sure to remove access?")) {
        await deleteSharedAccess(formId).unwrap();
        toast.success("Access removed successfully!");
        refetchsharedforms();
      }
    } catch (error) {
      console.error("Failed to remove access:", error);
      toast.error("Failed to remove access");
    }
  };

  const [deleteForm] = useDeleteFormMutation();

  const handleDeleteForm = async (id) => {
    try {
      if (confirm("Are you sure you want to Delete?")) {
        await deleteForm(id).unwrap();
        toast.success("Form deleted!");
        refetchForms();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete form");
    }
  };

  const [renameForm] = useRenameFormMutation();

  const handleRenameForm = async (id, newName) => {
    try {
      await renameForm({ id, name: newName }).unwrap();
      toast.success("Form renamed!");
      refetchForms();
    } catch (error) {
      console.error(error);
    }
  };

  const [deleteProject] = useDeleteProjectMutation();
  const [renameProject] = useRenameProjectMutation();

  const handleProjectDelete = async (id) => {
    if (confirm("Are you sure, you want to delete?"))
      await deleteProject(id).unwrap();
    toast.success("Project deleted");
    refetchProjects();
  };

  const handleProjectRename = async (id, newName) => {
    await renameProject({ id, name: newName }).unwrap();
    toast.success("Project renamed");
    refetchProjects();
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
          <SpinnerOverlay loading={loadingForms}>
            {forms?.length === 0 && projects?.length === 0 && (
              <div className="no-recentWorks">No recent work to display</div>
            )}
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
                    onShare={(id) => {
                      <ShareModal
                        publishedLink={`${
                          import.meta.env.VITE_API_URL
                        }/forms/${id}/verify`}
                      />;

                      dispatch(
                        setUi({
                          ...ui,
                          showShareModal: true,
                          publishedLink: `${
                            import.meta.env.VITE_API_URL_FRONTEND
                          }/forms/${id}/verify`,
                        })
                      );
                    }}
                    onDelete={(id) => {
                      handleDeleteForm(id);
                    }}
                    onRename={(id, newName) => {
                      handleRenameForm(id, newName);
                    }}
                  />
                ))}

              {projects &&
                projects.slice(0, 2).map((project) => (
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

          {/* shared Works */}

          <h3 className="homepage-recentWorks-title">Shared Works</h3>

          <div className="homepage-recentWorks" style={{ marginBottom: "0px" }}>
            {sharedforms?.length === 0 && (
              <div className="no-recentWorks">No Shared work to display</div>
            )}
            <SpinnerOverlay loading={loadingsharedforms}>
              <div className="homepage-recentWorks">
                {sharedforms &&
                  sharedforms.map((form) => (
                    <SharedFormComponent
                      key={form._id}
                      data={{
                        name: form.name,
                        draft: form.isDraft,
                        id: form._id,
                      }}
                      onShare={(id) => {
                        <ShareModal
                          publishedLink={`${
                            import.meta.env.VITE_API_URL
                          }/forms/${id}/verify`}
                        />;

                        dispatch(
                          setUi({
                            ...ui,
                            showShareModal: true,
                            publishedLink: `${
                              import.meta.env.VITE_API_URL_FRONTEND
                            }/forms/${id}/verify`,
                          })
                        );
                      }}
                      onDelete={(id) => {
                        handleRemoveSharedAccess(id);
                      }}
                    />
                  ))}
              </div>
            </SpinnerOverlay>
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
      {ui.showShareModal && (
        <ShareModal
          publishedLink={ui.publishedLink}
          onClose={() => {
            navigate("/dashboard");
            dispatch(setUi({ ...ui, showShareModal: false }));
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
