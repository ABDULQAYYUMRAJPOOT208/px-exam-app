import { signInTeacher } from "@/controllers/teacherController";
import { NextApiRequest, NextApiResponse } from "next";

export default async function hander(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await signInTeacher(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
