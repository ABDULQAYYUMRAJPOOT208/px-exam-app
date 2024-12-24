import { NextApiRequest, NextApiResponse } from "next";
import Teacher from "../models/teacher";
import jwt from "jsonwebtoken";
import { genSaltSync, hashSync, compare } from "bcrypt-ts";

const saltRound = process.env.BCRYPT_SALT || "10";
const salt = genSaltSync(parseInt(saltRound));

export const registerTeacher = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPass = await hashSync(password, salt);
    const teacher = new Teacher({ name, email, password: hashedPass, examCodes: [] });
    await teacher.save();

    const token = jwt.sign(
      { id: teacher._id, email: teacher.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({ message: "Teacher registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addNewCodeToTeacher = async (req: NextApiRequest, res: NextApiResponse) => {
  // await dbConnect(); // Ensure the database is connected

  try {
    const { email, code } = req.body;
    console.log("Email of teacher sent is ", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    console.log("New Code of teacher sent is ", code);

    if (!code) {
      return res.status(400).json({ message: "New code is required" });
    }

    const existingTeacher = await Teacher.findOne({ email: email });

    if (!existingTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check for duplicate codes
    if (existingTeacher.examCodes.includes(code)) {
      return res.status(409).json({ message: "Code already exists for this teacher" });
    }

    // Add the new code and save
    existingTeacher.examCodes.push(code);
    await existingTeacher.save();

    res.status(200).json({ message: "Code added successfully", teacher: existingTeacher });
  } catch (error) {
    console.error("Error adding code:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTeacherExamCodes = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  if (!email) {
    console.log("Missing email in request");
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher exam codes", examCodes: teacher.examCodes });
  } catch (error) {
    console.error("Error fetching exam codes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const signInTeacher = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try {
    const teacher = await Teacher.findOne({ email });
    console.log(teacher);
    if (teacher) {

      const decodedPass = await compare(password, teacher.password);
      if (decodedPass) {
        const token = jwt.sign(
          { id: teacher._id },
          process.env.JWT_SECRET || "secret",
          { expiresIn: "1d" }
        );
        res
          .status(200)
          .json({ message: "Teacher have signed in successfully", token: token });
      }
    }
    res.status(404).json({ message: 'There is no teacher with this email' })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
