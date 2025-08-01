import { useEffect, useState } from "react";
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
import { setBuilderState } from "../../utils/redux/slices/builderStateSlice";
import {
  useSaveDraftMutation,
  useGetSavedDraftQuery,
} from "../../utils/redux/api/draftPublishAPI";
import { setQuestions } from "../../utils/redux/slices/questionsSlice";
import { toast } from "react-toastify";
import AddConditionComponent from "./sidebarRight/actionButtons/addConditionComponent/addConditionComponent";
import PageFlow from "./pageFlow/PageFlow";
import PublishModal from "../dashboard/modal/publishModal/PublishModal";

const FormBuilder = () => {
  const { id } = useParams();

  const { data, refetch, isLoading, isSuccess } = useGetSavedDraftQuery(id);

  const { ui } = useSelector((state) => state.uiSlice);
  const { questions } = useSelector((state) => state.questionsSlice);
  const { builderState } = useSelector((state) => state.builderState);
  const [saveDraft, { isLoading: formUpdating }] = useSaveDraftMutation();

  const dispatch = useDispatch();

  //fetching data from db
  console.log(questions);
  useEffect(() => {
    if (data) {
      // Flatten out the builderState if your editor uses a flat structure
      const builderState = data.form?.pages.flatMap((page) => {
        // include page meta and its questions
        return page.questions.map((q) => ({
          ...q,
          pageId: page._id, // ensure page reference
        }));
      });

      dispatch(setQuestions(builderState)); // push into Redux for editing
    }
  }, [data, dispatch]);

  // setting active page

  useEffect(() => {
    if (data) {
      dispatch(
        setUi({
          ...ui,
          formName: data?.form?.name,
          activePageId: data?.form?.pages[0]?._id,
        })
      );
    }
  }, [data, isSuccess]);

  function attachQuestionsToPages(form, questions) {
    return {
      ...form,
      name: ui.formName,
      pages: form.pages.map((page) => ({
        ...page,
        questions: questions.filter((q) => q.pageId === page._id),
      })),
    };
  }

  const notify = () => toast("Form Updated!");

  const handleChanges = (e) => {
    const { value } = e.target;
    dispatch(setUi({ ...ui, formName: value }));
  };

  const handleSave = async () => {
    const updatedForm = attachQuestionsToPages(data.form, questions);
    console.log(updatedForm);

    try {
      const { data } = await saveDraft({
        action: `${id}/save`,
        form: updatedForm,
      });
      if (data.message.includes("form updated")) {
        notify();
      }
      console.log(data);
    } catch (error) {
      toast.error("Oops! There is some error.");
      console.log(error);
    }
  };

  if (isLoading || !data) {
    return <LoadingFallback />;
  }
  return (
    <>
      {!ui.previewMode && (
        <div className="formBuilder-layout">
          <SidebarLeft id={id} />
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
                {!ui.showPageFlow && (
                  <>
                    <button
                      onClick={() => {
                        dispatch(
                          setUi({
                            ...ui,
                            previewMode: true,
                            addCondition: false,
                          })
                        );
                      }}
                    >
                      Preview
                    </button>
                    <button disabled={formUpdating} onClick={handleSave}>
                      {formUpdating ? (
                        <div
                          className="spinner"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderWidth: "3px",
                            margin: "auto",
                            backgroundColor: "transparent",
                          }}
                        ></div>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="builder-tools-inner-container">
              {ui.addCondition && <AddConditionComponent data={{ ...data }} />}
              {ui.showPageFlow ? (
                <PageFlow data={{ ...data }} />
              ) : (
                <>
                  <FormBuilderMain />
                  <SidebarRight />
                </>
              )}

              {ui.publish && (
                <PublishModal
                  onClose={() => {
                    dispatch(setUi({ ...ui, publish: false }));
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {ui.previewMode && <PreviewForm />}
    </>
  );
};

export default FormBuilder;
