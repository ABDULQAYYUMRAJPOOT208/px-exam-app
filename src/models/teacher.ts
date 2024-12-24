import mongoose, { model, models } from "mongoose";

interface teacher {
  name: string;
  email: string;
  password: string;
  examCodes: string[];
}

const teacherSchema = new mongoose.Schema<teacher>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  examCodes: { type: [String], required: true },

});
const Teacher = models.Teacher || model<teacher>("Teacher", teacherSchema);

export default Teacher;
