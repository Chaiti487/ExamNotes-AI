import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

export const getCurrentUser = async (dispatch) => {
  try {
    const result = await axios.get(serverUrl + "/api/user/currentuser", {
      withCredentials: true,
    });
    console.log(result.data);
    dispatch(setUserData(result.data));
  } catch (error) {
    console.log(error);
  }
};

export const generateNotes = async (payload) => {
  try {
    const result = await axios.post(
      serverUrl + "/api/notes/generate-notes",
      payload,
      {
        withCredentials: true,
      },
    );

    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Notes generation failed:", error);
    throw error;
  }
};

export const downloadPdf = async (result) => {
  try {
    const response = await axios.post(
      serverUrl + "/api/pdf/generate-pdf",
      { result },
      {
        responseType: "blob",
        withCredentials: true,
      },
    );
    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamNotesAI.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("PDF download failed");
  }
};

export const generateFlashcards = async (noteId) => {
  try {
    const response = await axios.post(
      serverUrl + `/api/flashcards/generate/${noteId}`,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Flashcard generation failed:", error);
    throw error;
  }
};

export const getFlashcards = async (noteId) => {
  try {
    const response = await axios.get(serverUrl + `/api/flashcards/${noteId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Flashcard retrieval failed:", error);
    throw error;
  }
};

// Generate or retrieve existing quiz
export const generateQuiz = async (noteId) => {
    try {
        const response = await axios.post(
            `${serverUrl}/api/quiz/generate/${noteId}`,
            {},
            { withCredentials: true }
        );

        return response.data;

    } catch (error) {
        console.error("Quiz generation failed:", error);
        throw error;
    }
};


// Retrieve existing quiz
export const getQuiz = async (noteId) => {
    try {
        const response = await axios.get(
            `${serverUrl}/api/quiz/${noteId}`,
            { withCredentials: true }
        );

        return response.data;

    } catch (error) {
        console.error("Quiz retrieval failed:", error);
        throw error;
    }
};


// Submit quiz answers
export const submitQuiz = async (quizId, answers) => {
    try {
        const response = await axios.post(
            `${serverUrl}/api/quiz/submit/${quizId}`,
            { answers },
            { withCredentials: true }
        );

        return response.data;

    } catch (error) {
        console.error("Quiz submission failed:", error);
        throw error;
    }
};


// Retrieve quiz attempt history
export const getQuizAttempts = async (quizId) => {
    try {
        const response = await axios.get(
            `${serverUrl}/api/quiz/attempts/${quizId}`,
            { withCredentials: true }
        );

        return response.data;

    } catch (error) {
        console.error("Quiz history retrieval failed:", error);
        throw error;
    }
};
