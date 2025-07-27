import "./PreviewFormStyle.css";
import { useSelector } from "react-redux";
import AddQuestionComponent from "./AddQuestionComponent";


const PreviewForm = () => {
  const { questions, sections } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);

  const grouped = questions
    .filter((q) => q.pageId === ui.activePageId)
    .reduce((acc, question) => {
      const section = sections.find((s) => s.sectionId === question.sectionId);
      if (section) {
        const existing = acc.find((g) => g.sectionId === section.sectionId);
        if (existing) existing.questions.push(question);
        else acc.push({ section, questions: [question] });
      } else {
        acc.push({ section: null, questions: [question] });
      }
      return acc;
    }, []);

  return (
    <div className="form-preview-container">
      <h1 className="form-title">{ui.formTitle}</h1>

      {grouped.map((group, idx) => (
        <div
          key={group.section?.sectionId || idx}
          className="preview-section"
          style={{
            backgroundColor: group.section?.sectionColor || "#e9ecef",
          }}
        >
          {group.questions.map((q, i) => (
            <AddQuestionComponent
              key={q.id}
              question={{ ...q, qno: i + 1 }}
              isPreview={true}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PreviewForm;
