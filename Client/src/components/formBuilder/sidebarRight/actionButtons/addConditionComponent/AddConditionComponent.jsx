import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../../utils/redux/slices/questionsSlice";
import SelectPageModal from "../../../../dashboard/modal/SelectPageModal/SelectPageModal";
import { toast } from "react-toastify";

const AddConditionComponent = () => {
  const [openSelectPageModal, setOpenSelectPageModal] = useState(false);
  const { ui } = useSelector((state) => state.uiSlice);
  const { questions } = useSelector((state) => state.questionsSlice);
  const { conditions } = useSelector((state) => state.conditions);
  const dispatch = useDispatch();
  // console.log(conditions);
  // console.log(questions);

  return (
    <div>
      <button
        className="addCondition-btn"
        onClick={() => setOpenSelectPageModal(true)}
      >
        Add Condition
      </button>
      {openSelectPageModal && (
        <SelectPageModal
          onClose={() => setOpenSelectPageModal(false)}
          onContinue={({ truePage, falsePage }) => {
            const updatedQuestions = questions.map((q) => {
              // Check if condition exists for this question's qId
              const condition = conditions.find((c) => c.questionId === q.qId);

              if (condition) {
                // Attach condition directly to the top-level question
                return { ...q, conditions: condition };
              }

              // If question has elements, check inside them
              if (q.elements) {
                return {
                  ...q,
                  elements: q.elements.map((el) => {
                    const elCondition = conditions.find(
                      (c) => c.questionId === el.elId
                    );

                    return elCondition
                      ? { ...el, conditions: elCondition }
                      : el;
                  }),
                };
              }

              // No condition for this question
              return q;
            });

            // Dispatch updated questions to Redux
            dispatch(setQuestions(updatedQuestions));
            toast.success("Conditions Applied!")
          }}
        />
      )}
    </div>
  );
};

export default AddConditionComponent;
