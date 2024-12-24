import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../utils/db';
import Question from '../../../models/question';
import { v4 as uuid } from 'uuid';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDb();

    try {
        const { id, type, question, options, correctAnswer, examCode } = req.body;

        if (req.method === 'POST') {
            // Validate required fields for subjective and objective questions
            console.log({ id, type, question, options, correctAnswer, examCode })
            if (!type || !question || !examCode) {
                return res.status(400).json({ error: 'Type, question, and examCode are required' });
            }

            if (type === 'objective' && (!options || !correctAnswer)) {
                return res.status(400).json({ error: 'Options and correctAnswer are required for objective questions' });
            }

            // Check if a question with the same id already exists
            const existingQuestion = await Question.findOne({ id });

            if (existingQuestion) {
                console.log('Question already exists');
                // If question content has changed, update the question
                const hasContentChanged =
                    existingQuestion.question !== question ||
                    (existingQuestion.options !== options || existingQuestion.correctAnswer !== correctAnswer);

                if (hasContentChanged) {
                    console.log('Question already exists has changed');
                    const updatedQuestion = await Question.findByIdAndUpdate(
                        id,
                        { type, question, options, correctAnswer, examCode },
                        { new: true }
                    );
                    return res.status(200).json(updatedQuestion); // Return the updated question
                } else {
                    // If content is the same, do not update or save again
                    console.log('Question already exists has not changed');

                    return res.status(200).json(existingQuestion); // Return the existing question
                }
            } else {
                // If no question exists with the given id, create a new question
                const newQuestion = new Question({ id: id || uuid(), type, question, options, correctAnswer, examCode });
                await newQuestion.save();
                return res.status(201).json(newQuestion); // Return the newly created question
            }
        }

        else if (req.method === 'GET') {
            // Get all questions
            const questions = await Question.find();
            return res.status(200).json(questions);
        }

        else if (req.method === 'DELETE') {
            // Handle DELETE request to delete the question
            const questionId = req.query.id;

            const deletedQuestion = await Question.findByIdAndDelete(questionId);

            if (!deletedQuestion) {
                return res.status(404).json({ error: 'Question not found for deletion' });
            }

            return res.status(200).json({ message: 'Question deleted successfully' });
        }

        else {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default handler;
