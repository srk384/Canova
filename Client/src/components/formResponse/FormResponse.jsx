import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { usePostUserResponseMutation } from "../../utils/redux/api/FormPublicAPI";
import { setQuestions } from "../../utils/redux/slices/questionsSlice";
import { setUi } from "../../utils/redux/slices/uiSlice";
import UploadModal from "../common/fileUploadModal/FileUploadModal";
import "../formBuilder/questionType/multipleChoice/MultipleChoice";
import AddImageComponent from "../formBuilder/sidebarRight/actionButtons/addImageComponent/AddImageComponent";
import AddQuestionComponent from "../formBuilder/sidebarRight/actionButtons/addQuestionComponent/AddQuestionComponent";
import AddTextComponent from "../formBuilder/sidebarRight/actionButtons/addTextComponent/AddTextComponent";
import AddVideoComponent from "../formBuilder/sidebarRight/actionButtons/addVideoComponent/AddVideoComponent";
import { getNextPageId } from "./getNextPageId";
import { setBuilderState } from "../../utils/redux/slices/builderStateSlice";
import { useEffect } from "react";

const FormResponse = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.uiSlice);
  const { builderState } = useSelector((state) => state.builderState);
  const { questions } = useSelector((state) => state.questionsSlice);
  const [postUserResponse, { isLoading: submittingResponse }] =
    usePostUserResponseMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length < 1) {
      navigate(`/forms/${formId}/verify`);
    }
  }, []);

  const handleNextPage = () => {
    const nextPageId = getNextPageId(
      builderState.activePage,
      questions,
      builderState.pages
    );

    if (nextPageId) {
      dispatch(setBuilderState({ ...builderState, activePage: nextPageId }));
    } else {
      console.log("No more pages");
    }
  };

  const handleUpload = async (files) => {
    const cloudName = "dfomcvlzc";
    const preset = "canova";

    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      // Determine resource type based on file type
      const resourceType = file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
        ? "video"
        : "raw";

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      urls.push(data.secure_url);
    }

    try {
      // Save URL in your questions array
      if (urls.length > 0) {
        const updated = questions.map((question) => {
          if (question.elements.length > 0) {
            return {
              ...question,
              elements: question.elements.map((el) =>
                el.elId === ui.activeQuestionId ? { ...el, response: urls } : el
              ),
            };
          }

          return question.qId === ui.activeQuestionId
            ? { ...question, response: urls }
            : question;
        });
        dispatch(setQuestions(updated));

        dispatch(setUi({ ...ui, uploadModal: false, uploadType: null }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSubmit = async () => {
    const finalState = questions;

    const answers = finalState.flatMap((item) => {
      // If item is a normal question (qId exists)
      if (item.qId) {
        return item.response !== undefined
          ? [
              {
                questionId: item.qId,
                questionText: item.text,
                type: item.type,
                answer: item.response,
              },
            ]
          : [];
      }

      // If it's a section (has elements)
      if (item.sectionId && Array.isArray(item.elements)) {
        return item.elements
          .filter((el) => el.response !== undefined)
          .map((el) => ({
            questionId: el.elId,
            questionText: el.text || el.src || "(No text)",
            type: el.type,
            answer: el.response,
          }));
      }

      return [];
    });

    try {
      const { data } = await postUserResponse({
        action: `/form/${formId}/response`,
        body: {
          userEmail: ui.userEmail,
          answers,
        },
      });
      if (data.message.includes("Form Submitted Successfully!")) {
        toast.success("Form Submitted Sucessfully!");
        dispatch(
          setUi({
            ...ui,
            userEmail: null,
            uploadType: null,
            publicWelcomeScreen: true,
          })
        );
        navigate(`/forms/${formId}/verify`);
      }
    } catch (error) {
      toast.error("Oops! something went wrong.");
      console.log("Form submit error: ", error);
    }
  };

  console.log(questions);
  return (
    <div className="form-preview-container">
      <div className="previewFrom-left">
        <div className="sidebar-logo">
          <img alt="" src="/svgs/smallLogo.svg" />
        </div>
      </div>

      <div
        className="previewFrom-body"
        style={{
          backgroundColor:
            questions.find((q) => q.pageId === builderState
            .activePage && q.pageColor)
              ?.pageColor || "#ffffff",
        }}
      >
        <div className="previewForm-heading">
          <h1 className="form-title">{builderState?.form?.name}</h1>
        </div>
        <div
          style={{
            margin: "20px 0 0 40px",
            fontSize: "22px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {
            builderState.pages?.find((p) => p._id === builderState.activePage)
              ?.title
          }
        </div>
        <div className="previewForm-questions">
          {questions
            .filter((q) => q?.pageId === builderState.activePage)
            .map((question) => {
              if (question.qId) {
                switch (question.type) {
                  case "textBlock":
                    return (
                      <AddTextComponent
                        key={question.qId}
                        question={question}
                      />
                    );
                  default:
                    return (
                      <AddQuestionComponent
                        key={question.qId}
                        preview={true}
                        question={{
                          ...question,
                          qno: question.questionOrder,
                        }}
                      />
                    );
                }
              } else if (question.sectionId) {
                return (
                  question.elements.length > 0 && (
                    <div
                      key={question.sectionId}
                      className="section"
                      style={{ backgroundColor: question.sectionColor }}
                    >
                      {question?.elements?.map((el) => {
                        switch (el.type) {
                          case "textBlock":
                            return (
                              <AddTextComponent
                                preview={true}
                                key={el.elId}
                                question={el}
                              />
                            );
                          case "image":
                            return (
                              <AddImageComponent
                                preview={true}
                                key={el.elId}
                                src={el.src || ""}
                              />
                            );
                          case "video":
                            return (
                              <AddVideoComponent
                                preview={true}
                                key={el.elId}
                                src={el.src || ""}
                              />
                            );
                          default:
                            return (
                              <AddQuestionComponent
                                key={el.elId}
                                preview={true}
                                question={{
                                  ...el,
                                  qno: el.elementsOrder,
                                }}
                              />
                            );
                        }
                      })}
                    </div>
                  )
                );
              }

              return null;
            })}
        </div>
      </div>

      <div className="previewFrom-right"></div>

      <button
        className="back-to-editBtn"
        onClick={() => {
          builderState.pages.findIndex(
            (el) => el._id === builderState.activePage
          ) ===
          builderState.pages.length - 1
            ? handleSubmit()
            : handleNextPage();
        }}
        disabled={submittingResponse}
      >
        {submittingResponse ? (
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
        ) : builderState?.pages?.findIndex(
            (el) => el._id === builderState.activePage
          ) ===
          builderState?.pages?.length - 1 ? (
          "Submit"
        ) : (
          "Next"
        )}
      </button>

      <UploadModal
        isOpen={ui?.uploadModal}
        type={ui?.uploadType}
        fileTypes={ui?.uploadType}
        onClose={() =>
          dispatch(setUi({ ...ui, uploadModal: false, uploadType: null }))
        }
        onUpload={handleUpload}
      />
    </div>
  );
};

export default FormResponse;
