import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPagesQuery } from "../../utils/redux/api/FormAPI";
import { useGetFormsQuery } from "../../utils/redux/api/ProjectAPI";
import LoadingFallback from "../common/LoadingFallback/LoadingFallback";
import FormBuilderMain from "./formBuilderMain/FormBuilderMain";
import "./FormBuilderStyle.css";
import SidebarLeft from "./sidebarLeft/SidebarLeft";
import SidebarRight from "./sidebarRight/SidebarRight";

const FormBuilder = () => {
  const { id } = useParams();
  const { data } = useGetFormsQuery(`/forms/form/${id}`);

  const [form, setForm] = useState();

  const { data: pagesData, refetch , isLoading} = useGetPagesQuery(`pages/${form?._id}`, {
    skip: !form?._id,
  });

  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: "shortAnswer",
      text: "New Question",
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const setFormData = () => {
    setForm(data?.form);
    // console.log(data?.form)
  };

  useEffect(setFormData, [data]);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // console.log(form);
  };

  {
    (isLoading || !pagesData) && <LoadingFallback />;
  }
  return (
    <div className="formBuilder-layout">
      <SidebarLeft data={{ form, pagesData, refetch }} />
      <div className="builder-tools-container">
        <div className="formBuilder-top">
          {form && (
            <input
              type="text"
              name="name"
              id=""
              value={form.name}
              onChange={handleChanges}
            />
          )}
          <div>
            <button>Preview</button>
            <button>Save</button>
          </div>
        </div>
        <div className="builder-tools-inner-container">
          <FormBuilderMain questions={questions} />
          <SidebarRight onAddQuestion={addQuestion} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
