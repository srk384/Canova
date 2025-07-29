import "./PreviewFormStyle.css";
import { useDispatch, useSelector } from "react-redux";
import AddQuestionComponent from "../sidebarRight/actionButtons/addQuestionComponent/AddQuestionComponent";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import AddTextComponent from "../sidebarRight/actionButtons/addTextComponent/AddTextComponent";
import AddImageComponent from "../sidebarRight/actionButtons/addImageComponent/AddImageComponent";
import AddVideoComponent from "../sidebarRight/actionButtons/addVideoComponent/AddVideoComponent";

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
                  .filter((q) => q?.pageId === ui?.activePageId)
                  .map((question, qIndex) => {
                    if (question.qId) {
                      switch (question.type) {
                        case "textBlock":
                          return <AddTextComponent key={question.qId} question={question}/>;
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
                            className={`section`}
                            style={{ backgroundColor: question.sectionColor} }
                           
                          >
                            {question?.elements?.map((el) => {
                              switch (el.type) {
                                case "textBlock":
                                  return <AddTextComponent key={el.elId} question={el}/>;
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
