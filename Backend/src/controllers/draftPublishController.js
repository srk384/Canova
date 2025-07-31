const Form = require("../models/formModel");
const Project = require("../models/projectModel");
const Page = require("../models/pageModel");

const saveDraft = async (req, res) => {
  const { formId } = req.params;
  const { name, pages, isDraft } = req.body.form;
  console.log(pages);

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { $set: { name, pages: pages, isDraft } },
      {
        new: true, // return the updated document
        runValidators: true, // validate against schema
      }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ message: "form updated", success: true, form: updatedForm });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update form", error: err.message });
  }
};

const getSavedDraft = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    res.status(200).json({ message: "form fetched", success: true, form: form });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching form", error: err.message });
  }
};

module.exports = { saveDraft, getSavedDraft };
