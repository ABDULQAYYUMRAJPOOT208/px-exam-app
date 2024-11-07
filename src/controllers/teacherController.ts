import { NextApiRequest, NextApiResponse } from "next";
import Teacher from "../models/teacher";
import jwt from "jsonwebtoken";

import { genSaltSync, hashSync, compare } from "bcrypt-ts";
const saltRound = process.env.BCRYPT_SALT || "";
const salt = genSaltSync(parseInt(saltRound));

export const registerTeacher = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }
    const hashedPass = await hashSync(password, salt);
    const teacher = new Teacher({ name, email, password: hashedPass });
    await teacher.save();

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email },
      process.env.JWT_SECRET || "",
      { expiresIn: "1d" }
    );

    res
      .status(201)
      .json({ message: "Teacher registered successfully", token: token });
  } catch (error) {
    console.error(error);
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
    const decodedPass = await compare(password, teacher.password);
    if (decodedPass) {
      const token = jwt.sign(
        { id: teacher._id },
        process.env.JWT_SECRET || "",
        { expiresIn: "1d" }
      );
      res
        .status(200)
        .json({ message: "Teacher have signed in successfully", token: token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
