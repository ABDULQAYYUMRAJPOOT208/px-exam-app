import React, { useState } from "react";
import { toast } from "react-toastify";
import Objective from "./Objective";

interface ObjectiveProps {
  number: number;
}

const CreateObjective: React.FC<ObjectiveProps> = ({ number }) => {
  const [questions, setQuestions] = useState<{ question: string; options: string[]; correctAnswer: string }[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const handleAddBtn = () => {
    const { question, options, correctAnswer } = newQuestion;
    if (question.trim() === "" || correctAnswer.trim() === "") {
      toast.error("Please fill in all fields.");
      return;
    }

    if (questions.length < number) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    } else {
      toast.error(`You cannot add more than ${number} questions.`);
    }
  };

  return (
    <div>
      <h2 className="text-4xl my-6 text-center">All Objective Questions</h2>

      <div className="all-obj flex flex-col items-center space-y-10">
        {questions.length > 0 &&
          questions.map((q, idx) => (
            <Objective key={idx} question={q.question} options={q.options} correctAnswer={q.correctAnswer} />
          ))}

        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            className="input-field p-2 rounded-lg w-full max-w-xs"
            placeholder="Enter objective question"
          />
          <div className="flex space-x-2">
            {newQuestion.options.map((option, idx) => (
              <input
                key={idx}
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...newQuestion.options];
                  newOptions[idx] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: newOptions });
                }}
                className="input-field p-2 rounded-lg w-1/4"
                placeholder={`Option ${idx + 1}`}
              />
            ))}
          </div>
          <input
            type="text"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            className="input-field p-2 rounded-lg w-full max-w-xs"
            placeholder="Correct Answer"
          />
          <button
            onClick={handleAddBtn}
            className="bg-blue-500 p-2 rounded-md mt-4"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateObjective;
