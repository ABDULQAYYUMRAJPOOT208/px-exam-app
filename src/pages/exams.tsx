import React, { useState } from "react";
import CreateObjective from "@/components/CreateObjective";
import CreateSubjective from "@/components/CreateSubjective";
import { toast, ToastContainer } from "react-toastify";

const Exam = () => {
  const [code, setCode] = useState("");
  const [number, setNumber] = useState(0);
  const [examType, setExamType] = useState("");
  const [tempstate, setTempState] = useState("");

  function generateRandomCode(length = 8) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const allCharacters = upper + lower + numbers;
    let randomCode = "";

    randomCode += upper.charAt(Math.floor(Math.random() * upper.length));
    randomCode += lower.charAt(Math.floor(Math.random() * lower.length));
    randomCode += numbers.charAt(Math.floor(Math.random() * numbers.length));

    for (let i = 3; i < length; i++) {
      randomCode += allCharacters.charAt(
        Math.floor(Math.random() * allCharacters.length)
      );
    }

    return randomCode
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setExamType(tempstate);
    if (tempstate === "") {
      toast.error("Please choose exam type from dropdown in choose exam type section", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setCode(generateRandomCode(8));
    const btn = document.getElementById("createNow");
    btn?.setAttribute("disabled", "disabled");
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col justify-center items-center ">
        <div className="exam-header flex flex-col justify-center items-center">
          <h1 className="my-20 text-4xl font-bold text-zinc-800 dark:text-white text-center">
            Create Exam's Question according to your will!
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400 w-1/2">
            Choose the type of the exam you want to conduct now, You have two
            options either subjective or objective. You have to choose the
            number of questions you want to conduct in this exam. After filling
            information you will get an exam code with which your students will
            attempt this exam.
          </p>
        </div>

        <form
          className="bg-zinc-800 p-4 my-10 rounded-lg justify-center flex flex-col min-w-80"
          onSubmit={handleSubmit}
        >
          <label className="text-white text-sm">Choose the exam type</label>
          <div className="relative mt-2 max-w-xs text-gray-500">
            <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
              <select
                className="text-sm outline-none rounded-lg h-full text-white bg-zinc-800"
                onChange={(e) => setTempState(e.target.value)}
              >
                <option value="">Exam Type</option>
                <option value="subjective">Subjective</option>
                <option value="objective">Objective</option>
              </select>
            </div>
            <input
              type="number"
              min={1}
              max={100}
              required
              placeholder="No of Questions"
              className="w-full pl-[8rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-slate-600 shadow-sm rounded-lg text-white"
              onChange={(e) => setNumber(parseInt(e.target.value))}
            />
          </div>
          <button
            className="mt-10 bg-red-600 p-2 rounded-lg"
            id="createNow"
            type="submit"
          >
            Create Now!
          </button>
        </form>
      </div>

      {code !== "" && (
        <>
          <p className="text-3xl text-center">
            Your code is: <span className="text-green-500">{code}</span>
          </p>
        </>
      )}
      <div className="flex flex-col justify-center items-center mt-10 allQuestions">
        {examType === "objective" ? (
          <CreateObjective number={number} />
        ) : examType === "subjective" ? (
          <CreateSubjective number={number} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Exam;
