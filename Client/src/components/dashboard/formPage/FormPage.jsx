import "./FormPageStyle.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetFormsQuery,
  useCreateProjectMutation,
} from "../../../utils/redux/api/ProjectAPI";
import FormComponent from "../../common/FormComponent";

const FormPage = () => {
  const { projectId } = useParams();
  const { projectName } = useLocation().state;
  const navigate = useNavigate()

  const {
    data: forms,
    isLoading: loadingForms,
    isError: errorForms,
    refetch,
  } = useGetFormsQuery(`forms/projects/${projectId}/forms`);

  const [createProject, { isLoading, isError }] = useCreateProjectMutation();

  const handleCreateForm = async () => {
    const { data } = await createProject({
      action: `forms/project/${projectId}`,
      project: "",
    });
    console.log(data);

    if (data.success) {
      navigate(`/form-builder/${data.form._id}`);
      refetch();
      console.log("Form Inserted");
    }
  };

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
            <div className="formPage-recentWorks">
              {forms &&
                forms.map((form) => (
                  <FormComponent
                    key={form._id}
                    data={{ name: form.name, draft: form.draft, id: form._id }}
                  />
                ))}
            </div>
          </div>
        </div>

        <div className="formPage-createForm-container">
          <button
            className="formPage-createForm-btn"
            onClick={handleCreateForm}
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
