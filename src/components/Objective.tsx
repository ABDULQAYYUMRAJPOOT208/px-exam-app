import React, { useState } from "react";
import InputText from "./InputText";
import { toast, ToastContainer } from "react-toastify";
import { notifyProps, objectiveProps } from "@/interfaces/interfaces";

// Objective component expects an object as its props, including the `question` and `options`.
const Objective: React.FC<objectiveProps> = ({
  question,
  options,
  correctAnswer,
}) => {
  // Now `question`, `options`, and `correctAnswer` are available as strings/arrays

  const [optionsState, setOptionsState] = useState<string[]>(options || [""]); // Initialize with passed options or a default option
  const [questionText, setQuestionText] = useState<string>(question || ""); // Initialize with passed question or empty string

  // Function to handle form submission
  const handleSubmit = () => {
    // Validate and process the question and options here
    if (questionText === "") {
      notifySuccsess({ text: "Question is required!" });
      return;
    }

    if (optionsState.length < 2) {
      notifySuccsess({ text: "You must have at least two options!" });
      return;
    }

    // You can handle saving the question and options here
    console.log("Submitted Question:", questionText);
    console.log("Options:", optionsState);
    console.log("Correct Answer:", correctAnswer);
  };

  // Toast notification for success messages
  const notifySuccsess = ({ text }: notifyProps) => {
    toast.info(text);
  };

  // Add new option functionality
  const handleAddBtn = () => {
    if (optionsState.length < 6) {
      setOptionsState([...optionsState, ""]);
    } else {
      notifySuccsess({ text: "You cannot add more than 6 options..." });
    }
  };

  // Handle input change for options
  const handleInputChange = (idx: number, value: string) => {
    const updatedOptions = [...optionsState];
    updatedOptions[idx] = value;
    setOptionsState(updatedOptions);
  };

  // Handle question text change
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
  };

  return (
    <div className="full-objection w-full flex flex-col items-center justify-center content-center">
      <ToastContainer />
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

        {/* Options Inputs */}
        <div className="options-obj flex flex-col space-y-4 py-4">
          {optionsState.map((option, idx) => (
            <InputText
              key={idx}
              value={option}
              onChange={(e) => handleInputChange(idx, e.target.value)}
            />
          ))}
        </div>

        {/* Add Button */}
        <div className="add-btn flex flex-col items-center">
          <button
            title="Add New"
            className="group cursor-pointer outline-none hover:rotate-90 duration-300 bg-transparent"
            onClick={handleAddBtn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50px"
              height="50px"
              viewBox="0 0 24 24"
              className="stroke-zinc-400 fill-none 
               group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
            >
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                strokeWidth="1.5"
              />
              <path d="M8 12H16" strokeWidth="1.5" />
              <path d="M12 16V8" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Save and Delete Buttons */}
      <div className="dc-obj space-x-4 mx-auto">
        <button
          onClick={handleSubmit}
          className="bg-zinc-800 rounded-md py-1 px-2 m-2 hover:bg-green-500"
        >
          Save
        </button>
        <button
          // You can add the logic for deleting the question here
          className="bg-zinc-900 rounded-md py-1 px-2 m-2 hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Objective;
