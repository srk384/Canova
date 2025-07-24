const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    order: {
      type: String,
      required: true,
    },
    questions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
