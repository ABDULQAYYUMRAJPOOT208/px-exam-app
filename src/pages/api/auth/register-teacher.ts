import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../utils/db";
import { registerTeacher } from "@/controllers/teacherController";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();
    console.log("connection established");
    await registerTeacher(req, res);
  } catch (err) {
    console.log("error in register file...", err);
  }
}
