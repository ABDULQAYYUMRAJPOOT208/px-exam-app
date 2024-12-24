import { Request, Response } from "express";

import ObjectiveQuestion from "../models/objective";
import SubjectiveQuestion from "../models/subjective";

// Create Objective Question
export const createObjectiveQuestion = async (req: Request, res: Response) => {
    const { examCode, question, options, correctAnswer } = req.body;

    try {
        const newQuestion = new ObjectiveQuestion({
            question,
            options,
            correctAnswer,
            examCode,
        });

        await newQuestion.save();
        res.status(201).json({ message: "Objective question created successfully", data: newQuestion });
    } catch (error) {
        console.error("Error creating objective question:", error);
        res.status(500).json({ message: "Failed to create objective question", error });
    }
};

// Get all Objective Questions for an Exam
export const getObjectiveQuestions = async (req: Request, res: Response) => {
    const { examCode } = req.params;

    try {
        const questions = await ObjectiveQuestion.find({ examCode });
        res.status(200).json({ data: questions });
    } catch (error) {
        console.error("Error fetching objective questions:", error);
        res.status(500).json({ message: "Failed to fetch objective questions", error });
    }
};

// Create Subjective Question
export const createSubjectiveQuestion = async (req: Request, res: Response) => {
    const { examCode, question } = req.body;

    try {
        const newQuestion = new SubjectiveQuestion({
            question,
            examCode,
        });

        await newQuestion.save();
        res.status(201).json({ message: "Subjective question created successfully", data: newQuestion });
    } catch (error) {
        console.error("Error creating subjective question:", error);
        res.status(500).json({ message: "Failed to create subjective question", error });
    }
};

// Get all Subjective Questions for an Exam
export const getSubjectiveQuestions = async (req: Request, res: Response) => {
    const { examCode } = req.params;

    try {
        const questions = await SubjectiveQuestion.find({ examCode });
        res.status(200).json({ data: questions });
    } catch (error) {
        console.error("Error fetching subjective questions:", error);
        res.status(500).json({ message: "Failed to fetch subjective questions", error });
    }
};

// Update an Objective Question
export const updateObjectiveQuestion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { question, options, correctAnswer } = req.body;

    try {
        const updatedQuestion = await ObjectiveQuestion.findByIdAndUpdate(
            id,
            { question, options, correctAnswer, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Objective question not found" });
        }

        res.status(200).json({ message: "Objective question updated successfully", data: updatedQuestion });
    } catch (error) {
        console.error("Error updating objective question:", error);
        res.status(500).json({ message: "Failed to update objective question", error });
    }
};

// Update a Subjective Question
export const updateSubjectiveQuestion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { question } = req.body;

    try {
        const updatedQuestion = await SubjectiveQuestion.findByIdAndUpdate(
            id,
            { question, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Subjective question not found" });
        }

        res.status(200).json({ message: "Subjective question updated successfully", data: updatedQuestion });
    } catch (error) {
        console.error("Error updating subjective question:", error);
        res.status(500).json({ message: "Failed to update subjective question", error });
    }
};

// Delete an Objective Question
export const deleteObjectiveQuestion = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedQuestion = await ObjectiveQuestion.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: "Objective question not found" });
        }

        res.status(200).json({ message: "Objective question deleted successfully" });
    } catch (error) {
        console.error("Error deleting objective question:", error);
        res.status(500).json({ message: "Failed to delete objective question", error });
    }
};

// Delete a Subjective Question
export const deleteSubjectiveQuestion = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedQuestion = await SubjectiveQuestion.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: "Subjective question not found" });
        }

        res.status(200).json({ message: "Subjective question deleted successfully" });
    } catch (error) {
        console.error("Error deleting subjective question:", error);
        res.status(500).json({ message: "Failed to delete subjective question", error });
    }
};
