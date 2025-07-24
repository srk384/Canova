import "./SidebarLeftStyle.css";
import {
  useUpdateFormMutation,
  useGetPagesQuery,
} from "../../../utils/redux/api/FormAPI";
import { Link } from "react-router-dom";

const SidebarLeft = ({ form }) => {
  // console.log(form?.pages);

  const [updateForm] = useUpdateFormMutation();
  const { data: pagesData, refetch } = useGetPagesQuery(`pages/${form?._id}`);

  const addPage = async () => {
    const data = await updateForm({
      action: `update/${form?._id}`,
      pageOrder: `Page ${
        pagesData?.pages.length + 1 < 10
          ? String(pagesData?.pages.length + 1).padStart(2, "0")
          : pagesData?.pages.length + 1
      }`,
    });
    refetch();
  };

  return (
    <div className="formBuilder-left-sidebar">
      <div className="sidebar-logo">
        <img src="/svgs/smallLogo.svg" alt="" />
      </div>
      <ul>
        {pagesData &&
          pagesData?.pages.map((page) => (
            <Link to={`/form-builder/page/${page._id}`} key={page._id}>
              <li>{page.order}</li>
            </Link>
          ))}

        <div className="formBuilder-left-sidebar-addbtn" onClick={addPage}>
          <img src="/svgs/add.svg" alt="" />
          <button>Add new Page</button>
        </div>
      </ul>
      <div className="sidebar-profile">
        <img src="/svgs/profile.svg" alt="" />
        <span>Profile</span>
      </div>
    </div>
  );
};

export default SidebarLeft;
