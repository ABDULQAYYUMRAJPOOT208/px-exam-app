import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { IQuestionProps } from "@/interfaces/interfaces";
import Subjective from "@/components/Subjective";
import Objective from "@/components/Objective";
import { v4 } from 'uuid'

const Exam = () => {
  const [code, setCode] = useState<String | null>(null);
  const [number, setNumber] = useState(0);
  const [tempstate, setTempState] = useState("");
  const [email, setEmail] = useState<string>(""); // For teacher email
  const [examType, setExamType] = useState<string>(""); // Selected exam type
  const [examCodes, setExamCodes] = useState<{ code: string; type: string }[]>([]);
  const [questions, setQuestions] = useState<IQuestionProps[]>([]); // Ensure it's an array
  const [loading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [shouldAddNewQuestion, setShouldAddNewQuestion] = useState<boolean>(false);
  // Function to generate a random exam code
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
      randomCode += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }

    return randomCode.split("").sort(() => Math.random() - 0.5).join("");
  }
  const handleAddSubjective = async () => {
    setQuestions([...questions, { id: '', question: '', type: 'subjective', examCode: selectedCode }]);
  };
  const handleAddObjective = async () => {
    setQuestions([...questions, { id: '', question: '', options: [], type: 'objective', examCode: selectedCode }]);
  }

  useEffect(() => {
    const fetchTeacherEmail = () => {
      if (typeof window !== "undefined") {
        const storedEmail = localStorage.getItem("teacherEmail");
        if (storedEmail) {
          setEmail(storedEmail); // Correctly set the state
        } else {
          toast.error("Teacher email is missing. Please log in.");
        }
      }
    };

    fetchTeacherEmail();
  }, []);

  // Function to fetch exam codes from the API
  const fetchExamCodes = async () => {
    try {
      const response = await axios.post(`/api/exam/getTeacherExamCodes/`, { email: email });
      setExamCodes(response.data.examCodes || []);
    } catch (error) {
      toast.error("Failed to fetch exam codes.");
    }
  };

  // Function to handle form submission for creating a new exam
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

    const newCode = generateRandomCode(8);
    setCode(newCode);

    // Disable the button
    const btn = document.getElementById("createNow");
    btn?.setAttribute("disabled", "disabled");

    // Call postNewCode to save the exam code to the database
    postNewCode();
  };

  const postNewCode = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/exam/addNewCode/`, { email: email, code: code });
      toast.success("New exam code created successfully!");
      setTempState("");
      fetchExamCodes();
    } catch (error) {
      toast.error("Failed to create new exam code.");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {

      const response = await axios.get(`/api/questions/${selectedCode}`);
      // Check if questions are returned, else display a message
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setQuestions(response.data.data);
      } else {
        setQuestions([]);
        setShouldAddNewQuestion(true);
        toast.info('No questions found for this exam code');
      }
    } catch (error: unknown) {
      console.error('Error fetching questions', error);

      // Check if the error is an instance of AxiosError
      if (axios.isAxiosError(error)) {
        // AxiosError, so we can safely access .response
        if (error.response) {
          // HTTP error response from the server (like 400 or 500)
          toast.error(`Error: ${error.response.data.error || 'An error occurred'}`);
        } else if (error.request) {
          // No response was received from the server
          toast.error('No response from the server. Please try again.');
        }
      } else {
        // Other types of errors (e.g., non-Axios errors)
        toast.error(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("added questions", questions);
  }, [questions])
  useEffect(() => {
    if (selectedCode) {
      fetchQuestions();
    }
  }, [selectedCode]);

  useEffect(() => {
    if (code) {
      postNewCode();
    }
  }, [code]);

  useEffect(() => {
    if (email) {
      fetchExamCodes();
    }
  }, [email]);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col justify-center items-center">
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
          <button className="mt-10 bg-red-600 p-2 rounded-lg" id="createNow" type="submit">
            Create Now!
          </button>
        </form>
      </div>

      <div className="flex flex-col items-center">
        {examCodes.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl text-zinc-800 dark:text-white">
              Available {examType} Exam Codes:
            </h2>
            <ul className="mt-1">
              {examCodes.map((code, index) => (
                <li key={index} className="text-white">
                  <button onClick={() => {
                    setSelectedCode(code.toString());
                  }}>
                    {code.toString()}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {code !== "" && (
          <p className="text-3xl text-center">
            Your code is: <span className="text-green-500">{code}</span>
          </p>
        )}

        {/* <div className="flex flex-col justify-center items-center mt-10 allQuestions">
          {shouldAddNewQuestion ? questions.map((q, idx) => (
            <Subjective question={""} id={q.id} fetchQuestions={function (): void {
              throw new Error("Function not implemented.");
            }} />
          )) : null}
        </div> */}
      </div>

      <div className="flex flex-col items-center">
        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <div key={idx}>
              {q.type === 'subjective' ? <Subjective question={q.question}
                id={q.id} code={selectedCode}
                fetchQuestions={fetchQuestions} /> : <Objective id={q.id} question={q.question} options={q.options || []} correctAnswer={q.correctAnswer || ''} examCode={selectedCode} />}
            </div>
          ))
        ) : (
          <p>No questions available for this exam.</p>
        )}
      </div>
      {selectedCode && (

        <div className="flex justify-center">
          <button className="hover:bg-green-800" onClick={handleAddSubjective}>Add Subjective</button>
          <button className="hover:bg-green-800" onClick={handleAddObjective}>Add Objective</button>
        </div>
      )}
    </>
  );
};

export default Exam;
