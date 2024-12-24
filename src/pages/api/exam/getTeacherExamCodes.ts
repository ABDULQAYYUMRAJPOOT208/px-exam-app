import { getTeacherExamCodes } from "@/controllers/teacherController";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        console.log("request received");
        await getTeacherExamCodes(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
