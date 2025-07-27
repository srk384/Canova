import "./SidebarLeftStyle.css";
import { useUpdateFormMutation } from "../../../utils/redux/api/FormAPI";
import { Link } from "react-router-dom";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const SidebarLeft = ( {data} ) => {
  const [updateForm, { error, isLoading, isError, isSuccess }] =
    useUpdateFormMutation();

  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.uiSlice);

  useEffect(() => {
    dispatch(
      setUi({
        ...ui,
        activePageId: data?.form?.pages[0]._id,
        activeQuestionId: null,
      })
    );
  }, []);

  const addPage = async () => {
    const res = await updateForm({
      action: `update/${data?.form._id}`,
      // pageOrder: "blank",
      // pageOrder: `Page ${
      //   pagesData?.pages.length + 1 < 10
      //     ? String(pagesData?.pages.length + 1).padStart(2, "0")
      //     : pagesData?.pages.length + 1
      // }`,
    });
    data?.refetch();
    console.log(res);
  };

  return (
    <div className="formBuilder-left-sidebar">
      <Link to={"/dashboard"}>
        <div className="sidebar-logo">
          <img src="/svgs/smallLogo.svg" alt="" />
        </div>
      </Link>
      <ul>
        {data?.form &&
          data?.form.pages.map((page, index) => (
            // <Link to={`/form-builder/page/${page._id}`} key={page._id}>
            <li
              key={page._id}
              className={`${page._id === ui.activePageId ? "selected-li" : ""}`}
              onClick={() => {
                // setSelectedPage(index);
                dispatch(
                  setUi({
                    ...ui,
                    activePageId: page._id,
                    activeQuestionId: null,
                  })
                );
              }}
            >{`Page ${
              index + 1 < 10 ? String(index + 1).padStart(2, "0") : index + 1
            }`}</li>
            // </Link>
          ))}

        <button
          className="formBuilder-left-sidebar-addbtn"
          onClick={addPage}
          disabled={isLoading}
        >
          {isLoading ? (
            <div
              className="spinner"
              style={{
                width: "20px",
                height: "20px",
                borderWidth: "3px",
                margin: "auto",
              }}
            ></div>
          ) : (
            <>
              <img src="/svgs/add.svg" alt="" />
              <span>Add new Page</span>
            </>
          )}
        </button>
      </ul>
      <div className="sidebar-profile">
        <img src="/svgs/profile.svg" alt="" />
        <span>Profile</span>
      </div>
    </div>
  );
};

export default SidebarLeft;
