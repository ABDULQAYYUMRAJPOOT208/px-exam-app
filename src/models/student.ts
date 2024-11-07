import mongoose, { model, models } from "mongoose";

interface student {
  email: string;
  exam_code: string;
  roll_number: string;
}

const studentSchema = new mongoose.Schema<student>({
  email: { type: String, required: true },
  exam_code: { type: String, required: true },
  roll_number: { type: String, required: true },
});

const Student = models.Student || model("Student", studentSchema);

export default Student;
