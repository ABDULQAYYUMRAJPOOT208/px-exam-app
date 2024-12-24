import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../utils/db";
import Answer from "../../../models/answer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        await connectDB();
        const { examCode, answers, studentId } = req.body;

        if (!examCode || !answers || !studentId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Save answers to the database
        const answerEntry = new Answer({
            examCode,
            studentId,
            answers,
        });
        await answerEntry.save();

        res.status(201).json({ message: "Answers submitted successfully" });
    } catch (error) {
        console.error("Error saving answers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
