import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAddPagesMutation,
  useUpdatePagesMutation,
} from "../../../utils/redux/api/PageAPI";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import "./SidebarLeftStyle.css";
import { useGetPagesQuery } from "../../../utils/redux/api/PageAPI";

const SidebarLeft = ({ id }) => {
  const [updatePages] = useUpdatePagesMutation();
  const [addPages, { isLoading }] = useAddPagesMutation();
  const { data, refetch, isSuccess } = useGetPagesQuery(`/get/${id}`);

  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.uiSlice);
  const { questions } = useSelector((state) => state.questionsSlice);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingPageId, setEditingPageId] = useState(null);
  const [pageNames, setPageNames] = useState({});

  const inputRefs = useRef({});

  useEffect(() => {
    if (data) {
      dispatch(
        setUi({
          ...ui,

          activePageId: ui.activePageId ?? data?.form?.pages[0]?._id,
        })
      );
    }
  }, [data, isSuccess]);

  // Initialize page names
  useEffect(() => {
    if (data?.form?.pages) {
      const names = {};
      data.form.pages.forEach((p, i) => {
        names[p._id] = p.title || `Untitled Page`;
      });
      setPageNames(names);
    }
  }, [data]);

  const addPage = async () => {
    try {
      await addPages({
        action: `add/${id}`,
        pageAction: "add",
      });

      toast.success("Page Added!");
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Oops! someting went wrong.");
    }
  };

  const handlePageChange = (newPageId) => {
    const sectionOnPage = questions.find(
      (q) => q.pageId === newPageId && q.sectionId
    );

    dispatch(
      setUi({
        ...ui,
        activePageId: newPageId,
        activeSectionId: sectionOnPage ? sectionOnPage.sectionId : null,
        activeQuestionId: null,
      })
    );
  };

  const handleDelete = async (pageId) => {
    try {
      await updatePages({
        action: `update/${data?.form._id}/delete`,
        pageAction: "delete",
        pageId,
      });
      refetch();
      toast.success("Page Deleted!");
      setMenuOpenId(null);
    } catch (error) {
      console.log(error);
      toast.error("Oops! someting went wrong.");
    }
  };

  const enableRename = (pageId) => {
    setEditingPageId(pageId);
    setMenuOpenId(null);

    // Focus input after enabling
    setTimeout(() => {
      inputRefs.current[pageId]?.focus();
    }, 0);
  };

  const handleRenameSubmit = async (pageId) => {
    if (!pageNames[pageId]) return;
    try {
      await updatePages({
        action: `/update/${data?.form._id}/rename`,
        pageId,
        pageName: pageNames[pageId],
        pageAction: "rename",
      });
      refetch();
      toast.success("Page Renamed!");
      setEditingPageId(null);
    } catch (error) {
      console.log(error);
      toast.error("Oops! someting went wrong.");
    }
  };

  return (
    <div className="formBuilder-left-sidebar">
      <Link
        to={"/dashboard"}
        onClick={() => dispatch(setUi({ ...ui, showPageFlow: false }))}
      >
        <div className="sidebar-logo">
          <img src="/svgs/smallLogo.svg" alt="" />
        </div>
      </Link>
      <ul>
        {data?.form &&
          data?.form.pages.map((page, index) => {
            const isEditing = editingPageId === page._id;

            return (
              <li
                key={page._id}
                className={`${
                  page._id === ui.activePageId ? "selected-li" : ""
                }`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  cursor: isEditing ? "default" : "pointer",
                }}
                onClick={(e) => {
                  handlePageChange(page._id);
                  setEditingPageId(null);
                  if (ui.showPageFlow)
                    dispatch(setUi({ ...ui, showPageFlow: false }));
                }}
              >
                {/* Input behaves like button when disabled */}
                {isEditing && (
                  <input
                    ref={(el) => (inputRefs.current[page._id] = el)}
                    type="text"
                    className="page-name-input"
                    value={pageNames[page._id] || ""}
                    onChange={(e) =>
                      setPageNames({ ...pageNames, [page._id]: e.target.value })
                    }
                    onBlur={() => {
                      if (isEditing) handleRenameSubmit(page._id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.key === "Enter" && handleRenameSubmit(page._id);
                    }}
                  />
                )}
                {!isEditing && <span>{pageNames[page._id] || ""}</span>}
                {page._id === ui.activePageId && (
                  <>
                    <div
                      className="moreSvg-container"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(
                          menuOpenId === page._id ? null : page._id
                        );
                      }}
                    >
                      <img src="/svgs/more.svg" width={5} />
                    </div>
                    {menuOpenId === page._id && (
                      <div className="page-menu-popup">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            enableRename(page._id);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (data?.form.pages.length === 1) {
                              alert(
                                "You cannot delete the only page in the form."
                              );
                              setMenuOpenId(null);
                              return;
                            } else if (confirm("Are you sure?"))
                              handleDelete(page._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}

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
