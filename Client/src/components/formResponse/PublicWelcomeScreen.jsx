import React, { useEffect, useState } from "react";
import AuthWrapper from "../auth/AuthWrapper/AuthWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setUi } from "../../utils/redux/slices/uiSlice";
import { useGetFormPublicMutation } from "../../utils/redux/api/FormPublicAPI";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setBuilderState } from "../../utils/redux/slices/builderStateSlice";
import { setQuestions } from "../../utils/redux/slices/questionsSlice";
import LoadingFallback from "../common/LoadingFallback/LoadingFallback";

const PublicWelcomeScreen = () => {
  const { formId } = useParams();
  const { ui } = useSelector((state) => state.uiSlice);
  const { builderState } = useSelector((state) => state.builderState);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [getFormPublic, { isLoading, isError }] = useGetFormPublicMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await getFormPublic({
        action: `/form/${formId}`,
        email: email,
      });

      if (data.form.pages.length > 0) {
        dispatch(
          setBuilderState({
            ...builderState,
            activePage: data.form.pages[0]._id,
            pages: data.form.pages,
          })
        );
      }

      const questionsBD = data.form?.pages.flatMap((page) => {
        return page.questions.map((q) => ({
          ...q,
          pageId: page._id, // ensure page reference
          pageTitle: page.title, // ensure page reference
        }));
      });

      dispatch(setQuestions(questionsBD));

      dispatch(
        setUi({ ...ui, userEmail: email, previewMode: true, data: data })
      );

      console.log(data);
      if (data) {
        navigate(`/forms/${formId}/respond`);
        toast.success(`Welcome!, ${email}`);
      }
      console.log(data);
    } catch (error) {
      toast.error(`Oops!, something went wrong.`);
      console.log(error);
    }
  };

  if (isLoading) return <LoadingFallback />;

  return (
    <div>
      <AuthWrapper>
        <h2 className="login-title">Welcome CANOVA 👋</h2>
        <p className="login-subtitle">
          Today is a new day. It's your day. You shape it.
          <br />
          Sign in to start managing your projects.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Example@email.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <p
            style={{
              fontSize: "12px",
              color: "#777676ff",
              marginBottom: "10px",
            }}
          >
            We’ll only use your email for form-related updates 🔒
          </p>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <div
                className="spinner"
                style={{
                  width: "16px",
                  height: "16px",
                  borderWidth: "3px",
                  margin: "auto",
                }}
              ></div>
            ) : (
              " Continue"
            )}
          </button>
        </form>
      </AuthWrapper>
    </div>
  );
};

export default PublicWelcomeScreen;
