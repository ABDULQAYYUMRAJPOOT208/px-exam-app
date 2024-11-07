import React, { useState } from "react";
import InputText from "./InputText";

interface SubjectiveProps {
  question: string;
}

const Subjective: React.FC<SubjectiveProps> = ({ question }) => {


  const [optionsState, setOptionsState] = useState<string[]>([""]); // Initialize with passed options or a default option
  const [questionText, setQuestionText] = useState<string>(question || ""); // Initialize with passed question or empty string

    // Handle question text change
    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionText(e.target.value);
      };  
    
    
    
    
    
  return (
    <div className="flex flex-col justify-center rounded-xl border-2 p-10 mx-auto w-[80vw]">
        {/* Question Input */}
        <div className="form__group field">
          <input
            type="input"
            className="form__field"
            placeholder="Enter Question"
            value={questionText}
            onChange={handleQuestionChange}
            required
          />
          <label htmlFor="question" className="form__label">
            Enter Question
          </label>
        </div>
      </div>
  );
};

export default Subjective;
