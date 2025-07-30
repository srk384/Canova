import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../utils/redux/slices/questionsSlice";
import dayjs from "dayjs";

const Date = ({ question }) => {
  const { qId, elId, value } = question;
  const { questions } = useSelector((state) => state.questionsSlice);
  const dispatch = useDispatch();

  const handleChange = (newValue) => {
    const dateValue = newValue ? newValue.toISOString() : null;

    if (qId) {
      const updated = questions.map((q) =>
        q.qId === qId ? { ...q, value: dateValue } : q
      );
      dispatch(setQuestions(updated));
    } else if (elId) {
      const updated = questions.map((q) => {
        if (q.elements) {
          return {
            ...q,
            elements: q.elements.map((el) =>
              el.elId === elId ? { ...el, value: dateValue } : el
            ),
          };
        }
        return q;
      });
      dispatch(setQuestions(updated));
    }
  };

  return (
    <div style={{ padding: "0px 30px" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker  value={value ? dayjs(value) : null} onChange={handleChange} />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default Date;
