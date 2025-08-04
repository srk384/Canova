const Form = require("../models/formModel");
const Project = require("../models/projectModel");
const Page = require("../models/pageModel");

const createProjectAndForm = async (req, res) => {
  const { projectName, formName } = req.body.project;
  const userId = req.user._id;
  // const userId = "687bf646dcd817e431c27af1";

  if (!projectName || !formName) {
    return res.status(400).json({ message: "Both fields are required." });
  }

  try {
    const project = await Project.create({
      name: projectName,
      owner: userId,
    });

    const form = await Form.create({
      name: formName,
      owner: userId,
      project: project._id,
      pages: [], // start empty
    });

    project.forms.push(form._id);
    await project.save();

    const page = await Page.create({ form: form._id });

    form.pages.push(page._id);
    await form.save();

    return res.status(201).json({
      message: "Project and form created.",
      projectId: project._id,
      formId: form._id,
    });
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ owner: userId }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;
  try {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project by Id" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    // First, delete the project
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Find all forms associated with this project
    const forms = await Form.find({ project: id });

    // Collect form IDs
    const formIds = forms.map((form) => form._id);

    // Delete all pages associated with the forms
    await Page.deleteMany({ form: { $in: formIds } });

    // Delete all forms associated with this project
    await Form.deleteMany({ _id: { $in: formIds } });

    res.json({
      message:
        "Project, associated forms, and their pages deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const renameProject = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project renamed successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
  createProjectAndForm,
  getUserProjects,
  getProjectById,
  deleteProject,
  renameProject,
};
