import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetSavedDraftQuery,
  useSaveDraftMutation,
} from "../../utils/redux/api/draftPublishAPI";
import { setQuestions } from "../../utils/redux/slices/questionsSlice";
import { setUi } from "../../utils/redux/slices/uiSlice";
import LoadingFallback from "../common/LoadingFallback/LoadingFallback";
import PublishModal from "../dashboard/modal/publishModal/PublishModal";
import ShareModal from "../dashboard/modal/shareModal/ShareModal";
import FormBuilderMain from "./formBuilderMain/FormBuilderMain";
import "./FormBuilderStyle.css";
import PageFlow from "./pageFlow/PageFlow";
import PreviewForm from "./previewForm/PreviewForm";
import SidebarLeft from "./sidebarLeft/SidebarLeft";
import AddConditionComponent from "./sidebarRight/actionButtons/addConditionComponent/AddConditionComponent";
import SidebarRight from "./sidebarRight/SidebarRight";
import { useGetPagesQuery } from "../../utils/redux/api/PageAPI";

const FormBuilder = () => {
  const { id } = useParams();

  const { data, isLoading, isSuccess, refetch } = useGetSavedDraftQuery(id);

  const { data: pagesData, refetch: refetchPages } = useGetPagesQuery(
    `/get/${id}`
  );

  const { ui } = useSelector((state) => state.uiSlice);
  const { questions } = useSelector((state) => state.questionsSlice);
  const [saveDraft, { isLoading: formUpdating }] = useSaveDraftMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const builderState = data.form?.pages.flatMap((page) => {
        return page.questions.map((q) => ({
          ...q,
          pageId: page._id,
        }));
      });

      dispatch(setQuestions(builderState));
    }
  }, [
    data,
    //  dispatch
  ]);

  useEffect(() => {
    if (data) {
      dispatch(
        setUi({
          ...ui,
          activePageId: data?.form?.pages[0]?._id,
          formName: data?.form?.name,
        })
      );
      console.log(ui);
    }
  }, [data, isSuccess]);

  function attachQuestionsToPages(form, questions) {
    return {
      ...form,
      name: ui.formName ?? data?.form?.name,
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
    try {
      const { data: refetchedData } = await refetch();

      const updatedForm = attachQuestionsToPages(refetchedData.form, questions);

      // console.log(updatedForm);

      const { data } = await saveDraft({
        action: `${id}/save`,
        form: updatedForm,
      });

      refetch();

      if (data.message.includes("form updated")) {
        notify();
      }
    } catch (error) {
      toast.error("Oops! There is some error.");
      console.log(error);
    }
  };

  // if (isLoading || formUpdating) <LoadingFallback />;

  return (
    <>
      {!ui.previewMode && (
        <div className="formBuilder-layout">
          
            <SidebarLeft
              onLoad={{ data: pagesData, refetch: refetchPages, id }}
            />
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
                    <button
                      className="formBuilder-save-button"
                      disabled={
                        formUpdating || questions.length < 1 || ui.addCondition
                      }
                      onClick={handleSave}
                    >
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
              {ui.addCondition && <AddConditionComponent />}
              {ui.showPageFlow ? (
                <PageFlow />
              ) : (
                <>
                  <FormBuilderMain />
                  <SidebarRight />
                </>
              )}

              {ui.publish && (
                <PublishModal
                  id={id}
                  onClose={() => {
                    dispatch(setUi({ ...ui, publish: false }));
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
          </div>
        </div>
      )}
      {ui.previewMode && <PreviewForm />}
    </>
  );
};

export default FormBuilder;
