import mongoose from "mongoose";

const irregularActivitySchema = new mongoose.Schema({
    examCode: { type: String, required: true },
    rollNumber: { type: String, required: true },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const IrregularActivity =
    mongoose.models.IrregularActivity || mongoose.model("IrregularActivity", irregularActivitySchema);

export default IrregularActivity;
