import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to your custom server

const AttemptExam = () => {
    const router = useRouter();
    const { email, rollNumber, examCode } = router.query; // Get query params

    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);
    const [isExamActive, setIsExamActive] = useState(true); // To track if the exam is still active

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
            const response = await fetch('/api/submit-answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ examCode, answers, rollNumber, email }),
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!isExamActive) return <div>Your exam has been stopped. Please wait for the teacher's permission to resume.</div>;

    return (
        <div>
            <h1>Attempt Exam: {examCode}</h1>
            <p>Email: {email}</p>
            <p>Roll Number: {rollNumber}</p>
            <form onSubmit={(e) => e.preventDefault()}>
                {questions.map((q) => (
                    <div key={q._id}>
                        <p>{q.question}</p>
                        {q.type === 'objective' ? (
                            q.options.map((opt: string, i: number) => (
                                <div key={i}>
                                    <input
                                        type="radio"
                                        name={`question-${q._id}`}
                                        value={opt}
                                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                    />
                                    <label>{opt}</label>
                                </div>
                            ))
                        ) : (
                            <textarea
                                rows={3}
                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                placeholder="Write your answer here..."
                            />
                        )}
                    </div>
                ))}
                <button onClick={submitAnswers}>Submit Answers</button>
            </form>
        </div>
    );
};

export default AttemptExam;
