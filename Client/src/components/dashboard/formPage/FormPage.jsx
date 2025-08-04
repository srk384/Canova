import "./FormPageStyle.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetFormsQuery,
  useCreateProjectMutation,
} from "../../../utils/redux/api/ProjectAPI";
import FormComponent from "../../common/formComponent/FormComponent";
import SpinnerOverlay from "../../common/spinnerOverlay/SpinnerOverlay";
import { toast } from "react-toastify";
import {
  useDeleteFormMutation,
  useRenameFormMutation,
} from "../../../utils/redux/api/FormAPI";
import ShareModal from "../modal/shareModal/ShareModal";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const FormPage = () => {
  const { projectId } = useParams();
  const { projectName } = useLocation().state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.uiSlice);

  const {
    data: forms,
    isLoading: loadingForms,
    isError: errorForms,
    refetch,
  } = useGetFormsQuery(`forms/projects/${projectId}/forms`);

  const [createProject, { isLoading, isError }] = useCreateProjectMutation();

  const handleAddForm = async () => {
    const { data } = await createProject({
      action: `forms/project/${projectId}`,
      project: "",
    });

    if (data.success) {
      navigate(`/form-builder/${data.form._id}`);
      refetch();
      toast.success("Form Added");
      console.log("Form Inserted");
    }
  };

  const [deleteForm] = useDeleteFormMutation();

  const handleDeleteForm = async (id) => {
    try {
      if (confirm("Are you sure you want to Delete?")) {
        await deleteForm(id).unwrap();
        toast.success("Form deleted!");
        refetch();
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
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredForms = forms?.filter((form) =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="formPage-body">
        <div className="formPage-container">
          <div className="formPage-searchBar-container">
            <div className="formPage-searchBar">
              <input
                type="text"
                name=""
                id=""
                className="formPage-searchBar-input"
                placeholder="Search Forms"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img src="/svgs/search.svg" alt="" />
            </div>
          </div>
          <div className="formPage-projectName">
            <Link to={"/dashboard/projects"}>
              <img src="/svgs/backArrow.svg" alt="" />
            </Link>
            <h2>{projectName}</h2>
          </div>
          <div className="formPage-inner-container">
            <SpinnerOverlay input={loadingForms}>
              <div className="formPage-recentWorks">
                {filteredForms &&
                  filteredForms.map((form) => (
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
              </div>
            </SpinnerOverlay>
          </div>
        </div>

        <div className="formPage-createForm-container">
          <button
            className="formPage-createForm-btn"
            onClick={handleAddForm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div
                className="spinner"
                style={{
                  width: "20px",
                  height: "20px",
                  borderWidth: "3px",
                  margin: "auto",
                }}
              ></div>
            ) : (
              " Create New Form"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
