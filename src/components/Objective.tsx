import React, { useState } from "react";
import InputText from "./InputText";
import { toast, ToastContainer } from "react-toastify";
import { notifyProps, objectiveProps } from "@/interfaces/interfaces";
import axios from "axios";
import { v4 } from "uuid";

const Objective: React.FC<objectiveProps> = ({
  id,
  question,
  options,
  correctAnswer,
  examCode
}) => {
  const [optionsState, setOptionsState] = useState<string[]>(options || [""]);
  const [trueAnswer, setTrueAnswer] = useState<string>(correctAnswer || "");
  const [questionText, setQuestionText] = useState<string>(question || "");

  const notifySuccsess = ({ text }: notifyProps) => {
    toast.info(text);
  };

  const handleAddBtn = () => {
    if (optionsState.length < 6) {
      setOptionsState([...optionsState, ""]);
    } else {
      notifySuccsess({ text: "You cannot add more than 6 options..." });
    }
  };

  const handleInputChange = (idx: number, value: string) => {
    const updatedOptions = [...optionsState];
    updatedOptions[idx] = value;
    setOptionsState(updatedOptions);

    // If the current option is the selected answer, update it
    if (trueAnswer === optionsState[idx]) {
      setTrueAnswer(value);
    }
  };

  const handleRadioSelect = (selectedValue: string) => {
    setTrueAnswer(selectedValue);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!questionText) {
      notifySuccsess({ text: "Question is required!" });
      return;
    }
    if (optionsState.length < 2) {
      notifySuccsess({ text: "You must have at least two options!" });
      return;
    }
    if (!trueAnswer) {
      notifySuccsess({ text: "You must select a correct answer!" });
      return;
    }
    debugger;


    try {
      const response = await axios.post("/api/questions", {
        id: v4(),
        type: "objective",
        question: questionText,
        options: optionsState,
        correctAnswer: trueAnswer,
        examCode, // Replace with actual exam code

      });

      const data = await response;

      if (response.status === 201) {
        notifySuccsess({ text: "Question saved successfully!" });
        console.log("Saved Question:", data);
      } else {
        notifySuccsess({ text: response.data || "Failed to save question!" });
      }
    } catch (error) {
      console.error("Error saving question:", error);
      notifySuccsess({ text: "An error occurred while saving the question." });
    }
  };


  return (
    <div className="full-objection w-full flex flex-col items-center justify-center content-center">
      <ToastContainer />
      <div className="flex flex-col justify-center rounded-xl border-2 p-10 mx-auto w-[80vw]">
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

        <div className="options-obj flex flex-col space-y-4 py-4">
          {optionsState.map((option, idx) => (
            <InputText
              key={idx}
              value={option}
              isSelected={trueAnswer === option} // Check if the option is the selected one
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onRadioSelect={() => handleRadioSelect(option)} // Update selected answer
            />
          ))}
        </div>

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
              className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
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

      <div className="dc-obj space-x-4 mx-auto">
        <button
          onClick={handleSubmit}
          className="bg-zinc-800 rounded-md py-1 px-2 m-2 hover:bg-green-500"
        >
          Save
        </button>
        <button className="bg-zinc-900 rounded-md py-1 px-2 m-2 hover:bg-red-500">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Objective;
