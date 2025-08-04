import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../utils/redux/slices/questionsSlice";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import FileUploadModal from "../../common/fileUploadModal/FileUploadModal";
import AddImageComponent from "../sidebarRight/actionButtons/addImageComponent/AddImageComponent";
import AddQuestionComponent from "../sidebarRight/actionButtons/addQuestionComponent/AddQuestionComponent";
import AddTextComponent from "../sidebarRight/actionButtons/addTextComponent/AddTextComponent";
import AddVideoComponent from "../sidebarRight/actionButtons/addVideoComponent/AddVideoComponent";
import "./formBuilderMainStyle.css";
import { useEffect, useState } from "react";

const FormBuilderMain = () => {
  const { ui } = useSelector((state) => state.uiSlice);
  const { questions, sections } = useSelector((state) => state.questionsSlice);
  const rgba = ui?.pageColor;
  const dispatch = useDispatch();
  const [pageBgColor, setPageBgColor] = useState("");

  useEffect(() => {
    document.querySelector(".formBuilder-main-content-body").scrollTop = 0;
  }, [ui.uploadModal]);

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
                    type: resourceType,
                    src: data.secure_url,
                  },
                ],
              }
            : question
        );
        dispatch(setQuestions(updated));

        dispatch(setUi({ ...ui, uploadModal: false, uploadType: null }));
      }
    }
  };

  return (
    <div
      className="formBuilder-main-content-body"
      style={{
        backgroundColor:
          questions.find((q) => q.pageId === ui.activePageId && q.pageColor)
            ?.pageColor || "#ffffff",
        overflowY: ui.uploadModal ? "hidden" : "auto",
      }}
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
                  style={{
                    backgroundColor:
                      question?.sectionColor || ui.sectionColor || "#ffffff",
                  }}
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
    </div>
  );
};

export default FormBuilderMain;
