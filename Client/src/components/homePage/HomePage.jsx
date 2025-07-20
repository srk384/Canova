import FormComponent from "../FormComponent";
import ProjectComponent from "../ProjectComponent";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-body">
      <div className="homepage-container">
        <h1 className="homepage-title">Welcome to CANOVA</h1>
        <div className="homepage-inner-container">
          <div className="homepage-action">
            <div className="homepage-project">
              <div className="project-img-container">
                <img src="../svgs/projectWhite.svg" alt="" />
              </div>
              <h3>Start From scratch</h3>
              <p>Create your first Project now</p>
            </div>
            <div className="homepage-form">
              <div className="project-img-container">
                <img src="../svgs/form.svg" alt="" />
              </div>
              <h3>Create Form</h3>
              <p>create your first Form now</p>
            </div>
          </div>

          {/* recent Works */}

          <h3 className="homepage-recentWorks-title">Recent Works</h3>

          <div className="homepage-recentWorks">
            {/* <FormComponent prop ={{name:"Form 1", draft:true, analysis:"abc", action:true}}/> */}
            <ProjectComponent />
            <ProjectComponent />
          </div>

          {/* shared Works */}

          <h3 className="homepage-recentWorks-title">Shared Works</h3>

          <div className="homepage-recentWorks" style={{ marginBottom: "0px" }}>
            {/* <FormComponent /> */}
            {/* <FormComponent /> */}
            <ProjectComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
