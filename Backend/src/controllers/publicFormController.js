const Form = require("../models/formModel");
const Response = require("../models/responseModel");

const getPublishedForm = async (req, res) => {
  const { formId } = req.params;
  const { email } = req.body;


  try {
    // 1. Find form by ID
    const form = await Form.findById(formId);

    if (!form || form.isDraft) {
      return res.status(403).json({ message: "This form is not accessible" });
    }

    const publicData = {
      _id: form._id,
      name: form.name,
      pages: form.pages,
      owner: form.owner,
    };

    // 2. Check if access array is empty (open for all)
    if (!form.access || form.access.length === 0) {
      return res
        .status(200)
        .json({ message: "Access granted (open for all)", form: publicData });
    }

    // 3. Check if email exists in access array
    const isAllowed = form.access.some(
      (acc) => acc.email?.toLowerCase() === email.toLowerCase()
    );

    if (!isAllowed) {
      return res
        .status(403)
        .json({ error: "Access denied. Email not allowed." });
    }

    // 4. If allowed, return form data
    return res
      .status(200)
      .json({ message: "Access granted", form: publicData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const postPublicResponse = async (req, res) => {
  const { formId } = req.params;
  const { userEmail, answers } = req.body.body;

  try {
    const form = await Form.findById(formId);

    const resp = await Response.create({
      form: form._id,
      answers: answers,
      userEmail: userEmail,
    });

    res.status(201).json({
      message: "Form Submitted Successfully!",
      success: true,
      response: resp,
    });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPublishedForm, postPublicResponse };
