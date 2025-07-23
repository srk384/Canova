const Form = require("../models/formModel");
const Project = require("../models/projectModel");

const createForm = async (req, res) => {
  try {
    const userId = req.user._id;

    const newForm = await Form.create({
      name: "Untitled Form",
      owner: userId,
    });

    res
      .status(201)
      .json({ message: "Form created.", success: true, form: newForm });
  } catch (err) {
    console.error("Create form error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getUserForms = async (req, res) => {
  try {
    const userId = req.user._id;
    const forms = await Form.find({ owner: userId, project: null }).sort({
      createdAt: -1,
    });

    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

const getFormsByProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;
  try {
    const forms = await Form.find({ project: projectId, owner: userId });
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

const insertFormInProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;
  try {
     const project = await Project.findOne({ _id: projectId, owner: userId });

    const newForm = await Form.create({
      name: "Untitled Form",
      project: projectId,
      owner: userId,
    });

    project.forms.push(newForm._id);
    await project.save();

    res
      .status(200)
      .json({
        message: "Form added in the project.",
        success: true,
        form: newForm,
      });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project by Id" });
  }
};
module.exports = {
  createForm,
  getUserForms,
  getFormsByProject,
  insertFormInProject,
};
