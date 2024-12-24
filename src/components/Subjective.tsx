import { v4 as uuid } from 'uuid';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface SubjectiveProps {
  question: string;
  id: string;
  code: string | null;
  fetchQuestions: () => void;
}

const Subjective: React.FC<SubjectiveProps> = ({ question = "", id, code, fetchQuestions }) => {
  const [questionText, setQuestionText] = useState<string>(question);
  const [newQuestion, setNewQuestion] = useState<string>(""); // For new question input
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
  };

  // Add new question
  const handleAddBtn = async () => {
    if (newQuestion.trim() === "") {
      toast.error("Question cannot be empty.");
      return;
    }

    const uniqueId = uuid(); // Generate a UUID if no id is provided

    try {
      const response = await axios.post("/api/questions", {
        id,  // Use generated UUID
        type: "subjective",
        question: newQuestion,
        examCode: code,
      });
      fetchQuestions(); // Re-fetch questions after adding
      toast.success("Question saved successfully!");
    } catch (err) {
      toast.error("Error adding question");
    }
  };

  // Update existing question
  const handleUpdateBtn = async () => {
    if (questionText.trim() === "") {
      toast.error("Updated question cannot be empty.");
      return;
    }

    try {
      await axios.put(`/api/questions/${id}`, { question: questionText });
      fetchQuestions(); // Re-fetch questions after update
      toast.success("Question updated successfully!");
    } catch (err) {
      toast.error("Error updating question");
    }
  };

  // Delete the question
  const handleDeleteBtn = async () => {
    try {
      await axios.delete(`/api/questions/${id}`);
      fetchQuestions(); // Re-fetch questions after deletion
      toast.success("Question deleted successfully!");
    } catch (err) {
      toast.error("Error deleting question");
    }
  };

  useEffect(() => {
    if (question) {
      setIsEditing(true);
      setQuestionText(question);
    }
  }, [question]);

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-lg w-[80vw] mx-auto my-2">
      <div className="form__group field">
        <input
          type="input"
          id="question"
          className="form__field"
          placeholder="Enter Question"
          value={isEditing ? questionText : newQuestion}
          onChange={(e) => {
            if (isEditing) {
              setQuestionText(e.target.value);
            } else {
              setNewQuestion(e.target.value);
            }
          }}
          required
        />
        <label htmlFor="question" className="form__label">
          {isEditing ? "Update Question" : "Enter Question"}
        </label>
      </div>

      <div>
        <button onClick={handleAddBtn} className="mt-4 bg-blue-500 p-2 rounded-md">
          Save Question
        </button>
        <button onClick={handleDeleteBtn} className="mt-4 bg-red-500 p-2 rounded-md">
          Delete Question
        </button>
      </div>
    </div>
  );
};

export default Subjective;
