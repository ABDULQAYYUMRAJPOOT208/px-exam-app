import axios from "axios";

// Fetch Exam Codes
export const fetchExamCodes = async (email: string) => {
    try {
        const response = await axios.post(`/api/exam/getTeacherExamCodes/`, { email });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch exam codes.");
    }
};

// Fetch Questions for a specific exam code
export const fetchQuestions = async (examCode: string) => {
    try {
        const response = await axios.get(`/api/questions/${examCode}`);
        return response.data.data || [];
    } catch (error) {
        throw new Error("Failed to fetch questions.");
    }
};

// Post New Exam Code
export const postNewCode = async (data: { email: string; code: string }) => {
    try {
        await axios.post(`/api/exam/addNewCode/`, data);
    } catch (error) {
        throw new Error("Failed to post new exam code.");
    }
};

// Generate Random Code
export const generateRandomCode = (length = 8) => {
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
};
