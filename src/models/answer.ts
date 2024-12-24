import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    examCode: { type: String, required: true },
    studentId: { type: String, required: true },
    answers: { type: Object, required: true }, // Object with questionId as key and answer as value
    submittedAt: { type: Date, default: Date.now },
});

const Answer = mongoose.models.Answer || mongoose.model("Answer", answerSchema);

export default Answer;
