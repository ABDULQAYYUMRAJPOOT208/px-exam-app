import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../utils/db";
import { registerStudent } from "@/controllers/studentController";
export default async function hander(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();
    console.log("connection established");
    await registerStudent(req, res);
  } catch (err) {
    console.log("error in register file...", err);
  }
}
