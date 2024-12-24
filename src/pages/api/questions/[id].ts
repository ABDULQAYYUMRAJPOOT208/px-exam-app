import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import connectDb from '../../../utils/db';  // Adjust this according to your actual DB connection file
import Question from '../../../models/question';  // Adjust path to your actual model

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDb();  // Connect to the MongoDB database

    // const { code } = req.query;  // Extract the ID from the request query

    // Check if the ID is a valid MongoDB ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id as string)) {
    //     return res.status(400).json({ error: 'Invalid ID format' });
    // }
    if (req.method === 'POST') {
        try {
            const { type, question, examCode, options, correctAnswer } = req.body;

            console.log("add subject data : ", type, question, examCode, options, correctAnswer);
            // Validate required fields
            if (!type || !question || !examCode) {
                console.log('Type, question, and examCode are required subjective');
                return res.status(400).json({ error: 'Type, question, and examCode are required subjective' });
            }

            if (type === 'objective' && (!options || !correctAnswer)) {
                return res.status(400).json({ error: 'Options and correctAnswer are required for objective questions' });
            }

            // Create a new question
            const newQuestion = new Question({ type, question, options, correctAnswer, examCode });
            await newQuestion.save();

            res.status(201).json(newQuestion);
        } catch (error) {
            console.error('Error creating question:', error);
            res.status(500).json({ error: (error as Error).message });
        }
    }
    else if (req.method === 'GET') {
        const { id } = req.query;  // Extract the exam code from the query
        console.log("Getting Question with code", id);

        if (!id) {
            console.log("this block is running");
            return res.status(400).json({ error: 'Exam code is required' }); // Check if the examCode is missing
        }

        try {
            const questions = await Question.find({ examCode: id });
            console.log("Questions fetched", questions);
            // If no question is found, return 404
            if (!questions || questions.length === 0) {
                return res.status(200).json({ data: [] });
            }

            // Filter output to include only relevant fields
            const filteredQuestions = questions.map(q => ({
                id: q._id,
                type: q.type,
                question: q.question,
                options: q.options,  // Only include options for objective questions
                examCode: q.examCode,
                correctAnswer: q.correctAnswer
            }));

            console.log("Filtered Questions:", filteredQuestions);
            res.status(200).json({ data: filteredQuestions });  // Return filtered questions
        } catch (error) {
            console.error('Error fetching questions:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // } else if (req.method === 'PUT') {
    //     // Handle PUT request to update the question
    //     try {
    //         const { type, question, options, correctAnswer, examCode } = req.body;

    //         // Validate required fields
    //         if (!type || !question || !examCode) {
    //             return res.status(400).json({ error: 'Type, question, and examCode are required' });
    //         }

    //         if (type === 'objective' && (!options || !correctAnswer)) {
    //             return res.status(400).json({ error: 'Options and correctAnswer are required for objective questions' });
    //         }

    //         // Update the question in the database
    //         const updatedQuestion = await Question.findByIdAndUpdate(
    //             id,
    //             { type, question, options, correctAnswer, examCode },
    //             { new: true }
    //         );

    //         if (!updatedQuestion) {
    //             return res.status(404).json({ error: 'Question not found for update' });
    //         }

    //         res.status(200).json(updatedQuestion);  // Return the updated question
    //     } catch (error) {
    //         console.error('Error updating question:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }
    else if (req.method === 'DELETE') {
        // Handle DELETE request to delete the question
        const { id } = req.query;  // Get `id` from query parameters
        console.log("Deleting Question with id", id);

        if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ error: 'Invalid or missing ID' });
        }

        try {
            const deletedQuestion = await Question.findByIdAndDelete(id);

            if (!deletedQuestion) {
                return res.status(404).json({ error: 'Question not found for deletion' });
            }

            res.status(200).json({ message: 'Question deleted successfully' });
        } catch (error) {
            console.error('Error deleting question:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // else {
    //     // Return 405 Method Not Allowed if the request method is not supported
    //     res.status(405).json({ message: 'Method Not Allowed' });
    // }
};

export default handler;
