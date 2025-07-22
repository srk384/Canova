import "./FormPageStyle.css";
import { useParams } from "react-router-dom";
import { useGetFormsQuery } from "../../utils/redux/api/ProjectAPI";
import FormComponent from "../common/FormComponent";

const FormPage = () => {
  const { projectId } = useParams();
  const {
    data: forms,
    isLoading: loadingForms,
    isError: errorForms,
  } = useGetFormsQuery(`forms/projects/${projectId}/forms`);
  console.log(forms);
  return (
    <div>
      <div className="formPage-body">
        <div className="formPage-container">
          <h1 className="formPage-title">Welcome to CANOVA</h1>
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
      </div>
    </div>
  );
};

export default FormPage;
