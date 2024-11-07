import { createObjProps, subjectProps } from "@/interfaces/interfaces";
import React, { useEffect, useState } from "react";
import Subjective from "./Subjective";
import { toast, ToastContainer } from "react-toastify";

const CreateSubjective: React.FC<createObjProps> = ({ number }) => {
  const [questions, setQuestions] = useState<subjectProps[]>([]);
  const [newQuestion, setNewQuestion] = useState<subjectProps>({
    question: "",
  });

  useEffect(() => {
    console.log(number);
  }, []);

  // Handle adding a new question
  const handleAddBtn = () => {
    if (questions.length < number) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({ question: "" });
    } else {
      toast.error(`You cannot add more than ${number} questions because you already have defined it`);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-4xl my-6 text-center">All Subjective Questions</h2>

      <div className="all-obj flex flex-col items-center space-y-10">
        {questions.length > 0 &&
          questions.map((q, idx) => (
            <Subjective key={idx} question={q.question} />
          ))}

        <button
          onClick={handleAddBtn}
          className="bg-blue-500 p-2 rounded-md mt-4"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default CreateSubjective;
