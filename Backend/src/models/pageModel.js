const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Page",
    },
    pageColor: { type: String, default: "#ffffff" },
    // order: {
    //   type: Number,
    //   default: 1,
    // },
    questions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
