import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001'); // Connect to your custom server

const AttemptExam = () => {
    const router = useRouter();
    const { email, rollNumber, examCode } = router.query; // Get query params

    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);
    const [isExamActive, setIsExamActive] = useState(true); // To track if the exam is still active
    useEffect(() => {
        console.log("Answers: ", answers);
    }, [answers])
    useEffect(() => {
        // Make sure we have the query parameters available
        if (!examCode || !email || !rollNumber) return;

        // Fetch questions by examCode
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/api/questions?examCode=${examCode}`);
                const data = await response.json();
                setQuestions(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };

        fetchQuestions();

        // Detect tab changes
        const handleTabChange = () => {
            if (document.hidden) {
                // Notify server about tab-switch and stop the exam
                socket.emit('tab-changed', {
                    rollNumber,
                    email,
                    event: 'tab-switch',
                });

                // Stop the exam and redirect to the main page
                setIsExamActive(false);  // Update exam status
                router.push('/');  // Redirect to the main page
            }
        };

        document.addEventListener('visibilitychange', handleTabChange);

        // Listen for teacher's permission to allow the student to resume
        socket.on('allow-resume', (data) => {
            if (data.rollNumber === rollNumber) {
                setIsExamActive(true);  // Allow the student to resume the exam
            }
        });

        // Cleanup event listener
        return () => {
            document.removeEventListener('visibilitychange', handleTabChange);
            socket.off('allow-resume');
        };
    }, [examCode, email, rollNumber, router]);

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const submitAnswers = async () => {
        try {
            const response = await axios.post('/api/answers', { examCode, answers, studentId: rollNumber, email })
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!isExamActive) return <div>Your exam has been stopped. Please wait for the teacher's permission to resume.</div>;

    // return (
    //     <div>
    //         <h1>Attempt Exam: {examCode}</h1>
    //         <p>Email: {email}</p>
    //         <p>Roll Number: {rollNumber}</p>
    //         <form onSubmit={(e) => e.preventDefault()}>
    //             {questions.map((q) => (
    //                 <div key={q._id}>
    //                     <p>{q.question}</p>
    //                     {q.type === 'objective' ? (
    //                         q.options.map((opt: string, i: number) => (
    //                             <div key={i}>
    //                                 <input
    //                                     type="radio"
    //                                     name={`question-${q._id}`}
    //                                     value={opt}
    //                                     onChange={(e) => handleAnswerChange(q._id, e.target.value)}
    //                                 />
    //                                 <label>{opt}</label>
    //                             </div>
    //                         ))
    //                     ) : (
    //                         <textarea
    //                             rows={3}
    //                             onChange={(e) => handleAnswerChange(q._id, e.target.value)}
    //                             placeholder="Write your answer here..."
    //                         />
    //                     )}
    //                 </div>
    //             ))}
    //             <button onClick={submitAnswers}>Submit Answers</button>
    //         </form>
    //     </div>
    // );


    return (
        <div className="min-h-screen flex flex-col bg-gray-800 py-12 px-6">
            <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 flex flex-col grow">
                <h1 className="text-3xl font-semibold text-zinc-800 mb-4">Attempt Exam: <span className="text-blue-600">{examCode}</span></h1>
                <p className="text-lg text-zinc-600">Email: <span className="text-blue-600">{email}</span></p>
                <p className="text-lg text-zinc-600 mb-6">Roll Number: <span className="text-blue-600">{rollNumber}</span></p>

                {/* Form for Questions */}
                <form className="space-y-6 flex-grow">
                    {questions.map((q) => (
                        <div key={q._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                            <p className="text-xl font-medium text-zinc-800 mb-4">{q.question}</p>

                            {q.type === 'objective' ? (
                                <div className="space-y-3">
                                    {q.options.map((opt: string, i: number) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`question-${q._id}`}
                                                value={opt}
                                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                className="h-5 w-5 text-blue-600"
                                            />
                                            <label className="text-lg text-zinc-700">{opt}</label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    rows={4}
                                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                    placeholder="Write your answer here..."
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}
                </form>
            </div>

            {/* Submit Button at the bottom */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={submitAnswers}
                    // className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 duration-200"
                    className="mx-auto px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-red-400 dark:focus:ring-red-800"
                >
                    Submit Answers
                </button>
            </div>
        </div>
    );

};

export default AttemptExam;
