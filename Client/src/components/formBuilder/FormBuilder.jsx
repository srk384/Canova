import { useParams } from "react-router-dom";
import FormBuilderMain from "./formBuilderMain/formBuilderMain";
import "./FormBuilderStyle.css";
import SidebarLeft from "./sidebarLeft/SidebarLeft";
import SidebarRight from "./sidebarRight/SidebarRight";
import { useGetFormsQuery } from "../../utils/redux/api/ProjectAPI";
import { useEffect, useState } from "react";

const FormBuilder = () => {
  const { id } = useParams();
  const { data } = useGetFormsQuery(`/forms/form/${id}`);

  const [form, setForm] = useState();

  const setFormData = () => {
    setForm(data?.form);
  };

  useEffect(setFormData, [data]);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    console.log(form);
  };
  return (
    <div className="formBuilder-layout">
      <SidebarLeft form= {form}/>
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
          <FormBuilderMain />
          <SidebarRight />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
