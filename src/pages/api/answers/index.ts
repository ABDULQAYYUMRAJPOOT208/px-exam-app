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

        // Find existing answer entry for the student and exam
        let answerEntry = await Answer.findOne({ examCode, studentId });

        // If an entry exists, overwrite the answers
        if (answerEntry) {
            answerEntry.answers = answers;
        } else {
            // If no entry exists, create a new one
            answerEntry = new Answer({
                examCode,
                studentId,
                answers,
            });
        }

        // Save the answer entry
        await answerEntry.save();

        res.status(201).json({ message: "Answers submitted successfully" });
    } catch (error) {
        console.error("Error saving answers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}