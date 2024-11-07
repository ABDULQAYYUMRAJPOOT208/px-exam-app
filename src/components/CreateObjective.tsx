import Objective from '@/components/Objective';
import { createObjProps, objectiveProps } from '@/interfaces/interfaces';
import React, { useState , useEffect} from 'react'
import Exam from '../pages/exams';

const objective: React.FC<createObjProps> = ({number}) => {

    const [questions, setQuestions] = useState<objectiveProps[]>([]);
    const [newQuestion, setNewQuestion] = useState<objectiveProps>({
      question: "", // Initialize with an empty string
      options: ["", "", "", ""], // Initialize with empty options
      correctAnswer: "", // Initialize with an empty string
    });

 const handleAddBtn = () => {
    debugger;
    if (questions.length < number) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions, newQuestion];
        console.log("Updated Questions inside handleAddBtn:", updatedQuestions); // Log to see the new questions array
        return updatedQuestions;
      });

      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    }
  };

  useEffect(() => {
    console.log("Updated Questions:", questions); // Logs whenever questions array is updated
  }, [questions]); 


  return (
    <div className='w-full'>
      {/* <Exam/> */}
      <h2 className="text-4xl my-6 text-center">All Objectives</h2>

      <div className="all-obj flex flex-col items-center space-y-10">
        {questions.length > 0 &&
          questions.map((q, idx) => (
            <Objective
              key={idx} // Add a unique key for each mapped item
              question={q.question}
              options={q.options}
              correctAnswer={q.correctAnswer}
            />
          ))}
        <button
          onClick={handleAddBtn}
          className="bg-blue-500 p-2 rounded-md mt-4"
        >
          Add Question
        </button>
      </div>
    </div>
  )
}

export default objective
