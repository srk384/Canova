const Form = require("../models/formModel");
const Project = require("../models/projectModel");
const Page = require("../models/pageModel");
const Question = require("../models/questionModel");

const addQuestions = async (req, res) => {
  try {
    const page = await Page.findOne({ _id: req.params.id });
    // console.log(req.body)

    // console.log(await Question.create(req.body));

    res.send(page);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add questions" });
  }
};
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ page: req.params.id });
    // console.log(req.body)

    // console.log(await Question.create(req.body))

    res.status(200).json({
      message: "Questions fetched",
      success: true,
      questions: questions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get questions" });
  }
};

const getPages = async (req, res) => {
  const { formId } = req.params;
  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({
      message: "Pages fetched from Form.",
      success: true,
      form: form,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get pages" });
  }
};

const renamePage = async (req, res) => {
  const { pageId, pageName } = req.body;
  const { formId } = req.params;

  try {
    const updatedForm = await Form.findOneAndUpdate(
      { _id: formId, "pages._id": pageId },
      {
        $set: {
          "pages.$.title": pageName,
        },
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form or Page not found" });
    }

    res.status(200).json({
      message: "Page renamed successfully",
      success: true,
      form: updatedForm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update page",
      error: error.message,
    });
  }
};

const deletePage = async (req, res) => {
  const { pageId } = req.body;
  const { formId } = req.params;

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      {
        $pull: {
          pages: { _id: pageId },
        },
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form or Page not found" });
    }

    res.status(200).json({
      message: "Page deleted successfully",
      success: true,
      form: updatedForm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete page",
      error: error.message,
    });
  }
};
const addPage = async (req, res) => {
  const { formId } = req.params;
  const userId = req.user._id;

  try {
    const form = await Form.findOne({ _id: formId, owner: userId });

    const newPage = await Page.create({
      form: formId,
    });

    form.pages.push(newPage._id);
    await form.save();

    res.status(200).json({ message: "Page Added", success: true, form: form });
  } catch (err) {
    res.status(500).json({ message: "Failed to add Page" });
  }
};


const colorUpdate = async (req, res) => {
  const { pageId, pageColor } = req.body.updateData;
  const { formId } = req.params;

  try {
    // Step 1: Update the page color in the Page collection (if exists)
    const updatedPage = await Page.findByIdAndUpdate(
      pageId,
      { pageColor },
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Page not found in Page collection" });
    }

    // Step 2: Also update it inside Form.pages array
    const updatedForm = await Form.findOneAndUpdate(
      { _id: formId, "pages._id": pageId },
      {
        $set: {
          "pages.$.pageColor": pageColor,
        },
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form or Page not found inside Form" });
    }

    res.status(200).json({
      message: "Page color updated successfully",
      success: true,
      form: updatedForm,
    });

  } catch (error) {
    console.error("Color update error:", error);
    res.status(500).json({
      message: "Failed to update page color",
      error: error.message,
    });
  }
};


module.exports = {
  addQuestions,
  getQuestions,
  renamePage,
  deletePage,
  addPage,
  getPages,
  colorUpdate
};
