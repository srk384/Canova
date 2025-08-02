const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: Number,
    questionText: String, // snapshot of the question text
    type: String,
    answer: mongoose.Schema.Types.Mixed, // string, array, file url etc.
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  answers: [answerSchema],
  userEmail: String,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Response", responseSchema);
