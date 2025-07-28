import "./PreviewFormStyle.css";
import { useDispatch, useSelector } from "react-redux";
import AddQuestionComponent from "../sidebarRight/actionButtons/addQuestionComponent/AddQuestionComponent";
import { setUi } from "../../../utils/redux/slices/uiSlice";

const PreviewForm = () => {
  const { questions, sections } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);
  const rgba = ui?.pageColor;
  const dispatch = useDispatch();

  return (
    <div className="form-preview-container" >
      <div className="previewFrom-left">
        <div className="sidebar-logo">
          <img alt="" src="/svgs/smallLogo.svg"></img>
        </div>
      </div>
      <div className="previewFrom-body"style={{ backgroundColor: rgba }}>
        <div className="previewForm-heading">
          <h1 className="form-title">{ui.formName}</h1>
        </div>
        <div className="previewForm-questions">
          {questions
            .filter((q) => q.pageId === ui.activePageId)
            .reduce((acc, question) => {
              const section = sections.find(
                (s) =>
                  s.sectionId === question.sectionId &&
                  s.pageId === ui.activePageId
              );

              if (section) {
                // Sectioned questions
                const existingSection = acc.find(
                  (item) => item.sectionId === section.sectionId
                );

                if (existingSection) {
                  existingSection.questions.push(question);
                } else {
                  acc.push({
                    sectionId: section.sectionId,
                    sectionColor: section.sectionColor,
                    questions: [question],
                  });
                }
              } else {
                // Unsectioned questions → group them together
                const unsectioned = acc.find((item) => item.sectionId === null);
                if (unsectioned) {
                  unsectioned.questions.push(question);
                } else {
                  acc.push({ sectionId: null, questions: [question] });
                }
              }

              return acc;
            }, [])
            .map((group) =>
              group.sectionId ? (
                <div
                  key={group.sectionId}
                  className="section"
                  style={{ backgroundColor: group.sectionColor }}
                >
                  {group.questions.map((question, qIndex) => (
                    <AddQuestionComponent
                      key={question.qId}
                      question={{ ...question, qno: qIndex + 1 }}
                    />
                  ))}
                </div>
              ) : (
                group.questions.map((question, qIndex) => (
                  <AddQuestionComponent
                    key={question.qId}
                    question={{ ...question, qno: qIndex + 1 }}
                  />
                ))
              )
            )}
        </div>
      </div>
      <div className="previewFrom-right"></div>
      <button
        className="back-to-editBtn"
        onClick={() => dispatch(setUi({ ...ui, previewMode: false }))}
      >
        Back to Edit
      </button>
    </div>
  );
};

export default PreviewForm;
