import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Question {
  _id: string;
  type: 'subjective' | 'objective';
  question: string;
  options?: string[];
  correctAnswer?: string;
}

interface CreateSubjectiveProps {
  number: number;
  code: String | null;
}

const CreateSubjective: React.FC<CreateSubjectiveProps> = ({ number, code }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editedQuestionText, setEditedQuestionText] = useState<string>('');

  // Handle adding a new question
  const handleAddBtn = async () => {
    if (newQuestion.trim() === '') {
      toast.error('Question cannot be empty.');
      return;
    }

    if (questions.length < number) {
      try {
        const response = await axios.post(`/api/questions/`, {
          type: 'subjective',
          question: newQuestion,
          examCode: code,
        });
        setQuestions([...questions, response.data]);
        setNewQuestion('');
        toast.success('Question added successfully');
      } catch (err) {
        toast.error('Error adding question');
      }
    } else {
      toast.error(`You cannot add more than ${number} questions.`);
    }
  };

  // Fetch all questions from the backend
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/questions/${code}`);
      if (response.status == 404)
        return;
      setQuestions(response.data);
    } catch (err) {
      toast.error('Error fetching questions');
    }
  };

  // Handle editing a question
  const handleEditBtn = (question: Question) => {
    setEditingQuestion(question);
    setEditedQuestionText(question.question);
  };

  // Handle saving the updated question
  const handleUpdateBtn = async () => {
    if (editedQuestionText.trim() === '') {
      toast.error('Updated question cannot be empty.');
      return;
    }

    if (editingQuestion) {
      try {
        const response = await axios.put(`/api/questions/${editingQuestion._id}`, {
          question: editedQuestionText,
        });
        const updatedQuestions = questions.map((q) =>
          q._id === editingQuestion._id ? response.data : q
        );
        setQuestions(updatedQuestions);
        setEditingQuestion(null);
        setEditedQuestionText('');
        toast.success('Question updated successfully');
      } catch (err) {
        toast.error('Error updating question');
      }
    }
  };

  // Handle deleting a question
  const handleDeleteBtn = async (id: string) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
      toast.success('Question deleted successfully');
    } catch (err) {
      toast.error('Error deleting question');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <h2 className="text-4xl my-6 text-center">All Subjective Questions</h2>

      <div className="all-obj flex flex-col items-center space-y-10">
        {questions.length > 0 &&
          questions.map((q) => (
            <div key={q._id} className="question-card p-4 border rounded-md">
              <p>{q.question}</p>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleEditBtn(q)}
                  className="bg-yellow-500 p-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBtn(q._id)}
                  className="bg-red-500 p-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        <div className="flex flex-col items-center">
          {editingQuestion ? (
            <div>
              <input
                type="text"
                value={editedQuestionText}
                onChange={(e) => setEditedQuestionText(e.target.value)}
                placeholder="Edit your question"
                className="p-2 rounded-md"
              />
              <button
                onClick={handleUpdateBtn}
                className="mt-4 bg-green-500 p-2 rounded-md"
              >
                Update Question
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter a subjective question"
                className="p-2 rounded-md"
              />
              <button
                onClick={handleAddBtn}
                className="mt-4 bg-blue-500 p-2 rounded-md"
              >
                Add Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSubjective;
