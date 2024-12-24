import mongoose, { Document, Schema } from 'mongoose';

interface IQuestion extends Document {
    type: 'subjective' | 'objective';
    question: string;
    options?: string[];
    correctAnswer?: string;
    examCode: string;  // reference to which exam the question belongs to
    createdAt: Date;
    updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
    {
        type: {
            type: String,
            enum: ['subjective', 'objective'],
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        options: {

            type: [String],
            required: function () {
                return this.type === 'objective';
            },
        },
        correctAnswer: {
            type: String,
            required: function () {
                return this.type === 'objective';
            },
        },
        examCode: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
