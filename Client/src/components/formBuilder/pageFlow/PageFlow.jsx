import { useDispatch, useSelector } from "react-redux";
import "./PageFlow.css";
import { useState } from "react";
import { setUi } from "../../../utils/redux/slices/uiSlice";
import { useParams } from "react-router-dom";
import { useGetPagesQuery } from "../../../utils/redux/api/PageAPI";

const PageFlow = () => {
  const { questions } = useSelector((state) => state.questionsSlice);
  const { ui } = useSelector((state) => state.uiSlice);
  const [activePage, setActivePage] = useState("");
  const dispatch = useDispatch();

  const { id } = useParams();

  const { data } = useGetPagesQuery(`/get/${id}`);
  const pages = data?.form?.pages;

  // Build tree data
  const buildTree = () => {
    let tree = [];

    questions?.forEach((q) => {
      // Case 1: Direct questions with conditions
      if (q.qId && q.conditions) {
        tree.push({
          questionId: q.qId,
          text: q.text,
          pageId: q.pageId,
          truePageId: q.conditions?.truePage,
          falsePageId: q.conditions?.falsePage,
        });
      }

      // Case 2: Nested elements with conditions
      if (q.elements && q.elements.length > 0) {
        q.elements.forEach((el) => {
          if (el.conditions) {
            tree.push({
              questionId: el.elId,
              text: el.text,
              pageId: el.pageId,
              truePageId: el.conditions?.truePage,
              falsePageId: el.conditions?.falsePage,
            });
          }
        });
      }
    });

    return tree;
  };

  const treeData = buildTree();

  console.log(treeData);
  console.log(pages);

  return (
    <div className="page-flow-container">
      <select
        className="select-page-modal-input"
        required
        onChange={(e) => {
          setActivePage(e.target.value);
        }}
      >
        <option value="">Select Page</option>
        {pages.map((page) => (
          <option key={page._id} value={page._id}>
            {page.title}
          </option>
        ))}
      </select>

      {treeData
        .filter((t) => t.pageId === activePage)
        .map((node) => (
          <div key={node.questionId} className="page-node-wrapper">

            <div className="branches">
              {/* True branch */}
              {node.truePageId && (
                <div className="branch">
                  <span className="branch-label">
                    <img src="/svgs/true.svg" alt="" />
                  </span>

                  <div className="page-box-container">
                    <div className="page-box">
                      {pages.find((p) => p._id === node.truePageId)?.title ||
                        "Page"}
                    </div>

                    {pages
                      .filter(
                        (page, index) =>
                          index >
                          pages.findIndex(
                            (page) => page._id === node.truePageId
                          )
                      )
                      .map((page) => (
                        <div className="page-box">{page.title}</div>
                      ))}
                  </div>
                </div>
              )}

              {/* False branch */}
              {node.falsePageId && (
                <div className="branch">
                  <span className="branch-label">
                    <img src="/svgs/false.svg" alt="" />
                  </span>
                  <div className="page-box-container">
                    <div className="page-box">
                      {pages.find((p) => p._id === node.falsePageId)?.title ||
                        "Page"}
                    </div>

                    {pages
                      .filter(
                        (page, index) =>
                          index >
                          pages.findIndex(
                            (page) => page._id === node.falsePageId
                          )
                      )
                      .map((page) => (
                        <div className="page-box">{page.title} </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

      <button
        className="pageflow-next-btn"
        onClick={() => {
          dispatch(setUi({ ...ui, publish: true }));
        }}
      >
        Next
      </button>
    </div>
  );
};

export default PageFlow;
