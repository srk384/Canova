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

const FormBuilder = () => {
  const { id } = useParams();
  // const { data, refetch, isLoading, isSuccess } = useGetFormsQuery(
  //   `/forms/form/${id}`
  // );

  const { data, refetch, isLoading, isSuccess } = useGetSavedDraftQuery(id);
  console.log(data);

  const { ui } = useSelector((state) => state.uiSlice);
  const { questions } = useSelector((state) => state.questionsSlice);
  const { builderState } = useSelector((state) => state.builderState);
  const [saveDraft] = useSaveDraftMutation();

  const dispatch = useDispatch();

  //fetching data from db

  console.log(questions)
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

  // console.log(builderState);

  // setting active page

  useEffect(() => {
    if (data) {
      dispatch(
        setUi({
          ...ui,
          formName: data?.form?.name,
          activePageId: data?.form?.pages[0]._id,
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

      // console.log(data);
    } catch (error) {
      console.log(error);
    }

    // const builderState = {
    //   activePageId: ui.activePageId,
    //   pageColor: ui.pageColor,
    //   formName: ui.formName,
    //   questions: questions,
    // };

    //     {
    //   "builderState": {
    //     "activePageId": "6881e6fb27b9d1a656c7aebb",
    //     "pageColor": "rgba(248,227,227,1)",
    //     "formName": "My Survey",
    //     "questions": [
    //       {
    //         "qId": 1753725373702,
    //         "pageId": "6881e6fb27b9d1a656c7aebb",
    //         "type": "multipleChoice",
    //         "text": "What does this image contain?",
    //         "options": ["option 1", "option 2"]
    //       }
    //     ]
    //   }
    // }
  };

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
