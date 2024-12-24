import { signInTeacher } from "@/controllers/teacherController";
import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "../../../utils/db";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDb();
    await signInTeacher(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
