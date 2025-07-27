const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "shortAnswer",
        "longAnswer",
        "multipleChoice",
        "checkbox",
        "dropdown",
        "fileUpload",
        "date",
        "linearScale",
        "rating",
      ], // allowed types
      required: true,
    },
    options: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
