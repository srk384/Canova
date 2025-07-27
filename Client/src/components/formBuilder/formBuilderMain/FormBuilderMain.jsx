import { useSelector } from "react-redux";
import AddQuestionComponent from "../sidebarRight/actionButtons/addQuestionComponent/AddQuestionComponent";
import "./formBuilderMainStyle.css";
import { useGetQuestionsQuery } from "../../../utils/redux/api/PageAPI";

const FormBuilderMain = () => {
  const { ui } = useSelector((state) => state.uiSlice);
  const { questions, sections } = useSelector((state) => state.questionsSlice);
  const rgba = ui?.pageColor;

  console.log(questions);
  // console.log(sections);
  // console.log(ui);

  const { data } = useGetQuestionsQuery("6884d18ad4bf6aed233ff47a");

  // console.log(data)

  return (
    <div
      className="formBuilder-main-content-body"
      style={{ backgroundColor: rgba }}
    >
      {questions
        .filter((q) => q.pageId === ui.activePageId)
        .reduce((acc, question) => {
          const section = sections.find(
            (s) =>
              s.sectionId === question.sectionId && s.pageId === ui.activePageId
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
  );
};

export default FormBuilderMain;
