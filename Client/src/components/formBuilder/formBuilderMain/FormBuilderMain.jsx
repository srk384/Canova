import { useDispatch, useSelector } from "react-redux";
import { useGetQuestionsQuery } from "../../../utils/redux/api/PageAPI";
import { setQuestions } from "../../../utils/redux/slices/questionsSlice";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import FileUploadModal from "../../common/fileUploadModal/FileUploadModal";
import AddImageComponent from "../sidebarRight/actionButtons/addImageComponent/AddImageComponent";
import AddQuestionComponent from "../sidebarRight/actionButtons/addQuestionComponent/AddQuestionComponent";
import AddTextComponent from "../sidebarRight/actionButtons/addTextComponent/AddTextComponent";
import AddVideoComponent from "../sidebarRight/actionButtons/addVideoComponent/AddVideoComponent";
import AddConditionComponent from "../sidebarRight/actionButtons/addConditionComponent/addConditionComponent";
import "./formBuilderMainStyle.css";

const FormBuilderMain = () => {
  const { ui } = useSelector((state) => state.uiSlice);
  const { questions, sections } = useSelector((state) => state.questionsSlice);
  const rgba = ui?.pageColor;
  const dispatch = useDispatch();

  const { data } = useGetQuestionsQuery("6884d18ad4bf6aed233ff47a");

  const handleUpload = async (file) => {
    const type = file.type.split("/")[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "canova");

    const endpoint =
      type === "video"
        ? `https://api.cloudinary.com/v1_1/dfomcvlzc/video/upload`
        : `https://api.cloudinary.com/v1_1/dfomcvlzc/image/upload`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Cloudinary URL:", data.secure_url);

      // Save URL in your questions array
      if (data.secure_url) {
        const updated = questions.map((question) =>
          question.sectionId === ui.activeSectionId
            ? {
                ...question,
                elements: [
                  ...question.elements,
                  {
                    elId: Date.now(),
                    type: type,
                    src: data.secure_url,
                  },
                ],
              }
            : question
        );
        dispatch(setQuestions(updated));

        dispatch(setUi({ ...ui, uploadModal: false, uploadType: null }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div
      className="formBuilder-main-content-body"
      style={{ backgroundColor: rgba }}
    >
      {questions
        .filter((q) => q?.pageId === ui?.activePageId)
        .map((question, qIndex) => {
          if (question.qId) {
            switch (question.type) {
              case "textBlock":
                return (
                  <AddTextComponent key={question.qId} question={question} />
                );
              default:
                return (
                  <AddQuestionComponent
                    key={question.qId}
                    question={{ ...question, qno: question.questionOrder }}
                  />
                );
            }
          } else if (question.sectionId) {
            return (
              question.elements.length > 0 && (
                <div
                  key={question.sectionId}
                  className={`section ${
                    question.sectionId === ui.activeSectionId
                      ? "activeSection"
                      : ""
                  }`}
                  style={{ backgroundColor: question.sectionColor }}
                  onClick={() =>
                    dispatch(
                      setUi({ ...ui, activeSectionId: question.sectionId })
                    )
                  }
                >
                  {question?.elements?.map((el) => {
                    switch (el.type) {
                      case "textBlock":
                        return <AddTextComponent key={el.elId} question={el} />;
                      case "image":
                        return (
                          <AddImageComponent
                            key={el.elId}
                            src={el.src ? el.src : ""}
                          />
                        );
                      case "video":
                        return (
                          <AddVideoComponent
                            key={el.elId}
                            src={el.src ? el.src : ""}
                          />
                        );
                      default:
                        return (
                          <AddQuestionComponent
                            key={el.elId}
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
        })}

      {/* ----------------------------------------------------file upload--------------------------------------- */}

      <FileUploadModal
        isOpen={ui?.uploadModal}
        type={ui?.uploadType}
        onClose={() =>
          dispatch(setUi({ ...ui, uploadModal: false, uploadType: null }))
        }
        onUpload={handleUpload}
      />

      {ui.addCondition && <AddConditionComponent/> }
    </div>
  );
};

export default FormBuilderMain;
