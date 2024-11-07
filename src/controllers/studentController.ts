import { NextApiRequest, NextApiResponse } from "next";
import Student from "../models/student";
import jwt from "jsonwebtoken";

export const registerStudent = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, exam_code, roll_number } = req.body;

    console.log("Gathered data:", { email, exam_code, roll_number });

    if (!email || !exam_code || !roll_number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if an exact match of email, exam_code, and roll_number exists
    const existingStudent = await Student.findOne({
      email,
      exam_code,
      roll_number,
    });
    
    if (existingStudent) {
      return res
        .status(409)
        .json({ message: "Student with this email, exam code, and roll number already exists" });
    }

    // If no exact match, proceed with registration
    const student = new Student({ email, exam_code, roll_number });
    await student.save();

    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    return res
      .status(201)
      .json({ message: "Student registered successfully", token });
  } catch (error: any) {
    console.error("Error in registerStudent:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const signInTeacher = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     res.status(400).json({ message: "All fields are required" });
//     return;
//   }
//   try {
//     const teacher = await Teacher.findOne({ email });
//     const decodedPass = await compare(password, teacher.password);
//     if (decodedPass) {
//       const token = jwt.sign(
//         { id: teacher._id },
//         process.env.JWT_SECRET || "",
//         { expiresIn: "1d" }
//       );
//       res
//         .status(200)
//         .json({ message: "Teacher have signed in successfully", token: token });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
