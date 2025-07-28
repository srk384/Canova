import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetFormsQuery } from "../../utils/redux/api/ProjectAPI";
import { setUi } from "../../utils/redux/slices/uiSlice";
import LoadingFallback from "../common/LoadingFallback/LoadingFallback";
import FormBuilderMain from "./formBuilderMain/FormBuilderMain";
import "./FormBuilderStyle.css";
import SidebarLeft from "./sidebarLeft/SidebarLeft";
import SidebarRight from "./sidebarRight/SidebarRight";
import PreviewForm from "./previewForm/PreviewForm";

const FormBuilder = () => {
  const { id } = useParams();
  const { data, refetch, isLoading, isSuccess } = useGetFormsQuery(
    `/forms/form/${id}`
  );
  // console.log(data.form.name)
  const { ui } = useSelector((state) => state.uiSlice);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(
        setUi({
          ...ui,
          formName: data.form.name,
          activePageId: data.form.pages[0]._id,
        })
      );
    }
  }, [data, isSuccess]);

  const handleChanges = (e) => {
    const { value } = e.target;
    dispatch(setUi({ ...ui, formName: value }));
  };

  const handleSave = () => {};

  if (isLoading || !data) {
    return <LoadingFallback />;
  }
  return (
    <>
      {!ui.previewMode && (
        <div className="formBuilder-layout">
          <SidebarLeft data={{ ...data, refetch }} />
          <div className="builder-tools-container">
            <div className="formBuilder-top">
              {isSuccess && (
                <input
                  type="text"
                  name="name"
                  id=""
                  value={ui.formName ?? data?.form?.name}
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
      )}
      {ui.previewMode && <PreviewForm />}
    </>
  );
};

export default FormBuilder;
