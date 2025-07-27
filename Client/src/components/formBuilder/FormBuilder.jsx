import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetPagesQuery } from "../../utils/redux/api/FormAPI";
import { useGetFormsQuery } from "../../utils/redux/api/ProjectAPI";
import LoadingFallback from "../common/LoadingFallback/LoadingFallback";
import FormBuilderMain from "./formBuilderMain/FormBuilderMain";
import "./FormBuilderStyle.css";
import SidebarLeft from "./sidebarLeft/SidebarLeft";
import SidebarRight from "./sidebarRight/SidebarRight";
import { setUi } from "../../utils/redux/slices/uiSlice";

const FormBuilder = () => {
  const { id } = useParams();
  const { data, refetch, isLoading, isSuccess } = useGetFormsQuery(
    `/forms/form/${id}`
  );
  const { ui } = useSelector((state) => state.uiSlice);


  const dispatch = useDispatch();


  useEffect(() => {
    if (isSuccess) dispatch(setUi({ ...ui, formName: data?.form?.name }));
  }, []);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    dispatch(setUi({ ...ui, formName: value }));
  };

  const handleSave = () => {};

  {
    (isLoading || !data) && <LoadingFallback />;
  }
  return (
    <div className="formBuilder-layout">
      {isSuccess && <SidebarLeft data={{ ...data, refetch }} />}
      <div className="builder-tools-container">
        <div className="formBuilder-top">
          {isSuccess && (
            <input
              type="text"
              name="name"
              id=""
              value={ui.formName ?? data?.form?.name }
              onChange={handleChanges}
            />
          )}
          <div>
            <button
              onClick={() => {
                dispatch(setUi({ ...ui, previewMode: true }));
              }}
            >
              Preview
            </button>
            <button onClick={handleSave}>Save</button>
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
