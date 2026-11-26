import mongoose from "mongoose";
import Notes from "../models/notes.model.js";
import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import { generateQuiz } from "../services/study.services.js";

// Remove correct answers before sending quiz to frontend
const sanitizeQuiz = (quiz) => ({
  _id: quiz._id,
  note: quiz.note,
  topic: quiz.topic,

  questions: quiz.questions.map((q) => ({
    _id: q._id,
    question: q.question,
    options: q.options,
  })),

  createdAt: quiz.createdAt,
});

// 1. GENERATE QUIZ
export const createQuiz = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    if (!mongoose.isValidObjectId(noteId)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    // Verify note ownership
    const note = await Notes.findOne({
      _id: noteId,
      user: userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Check whether quiz already exists
    const existingQuiz = await Quiz.findOne({
      user: userId,
      note: noteId,
    });

    if (existingQuiz) {
      return res.status(200).json({
        message: "Existing quiz retrieved",
        data: sanitizeQuiz(existingQuiz),
        cached: true,
      });
    }

    // Generate questions using Gemini
    const questions = await generateQuiz(note.topic, note.content);

    // Store quiz without creating duplicate records
    const quiz = await Quiz.findOneAndUpdate(
      {
        user: userId,
        note: noteId,
      },
      {
        $setOnInsert: {
          user: userId,
          note: noteId,
          topic: note.topic,
          questions,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "Quiz available successfully",
      data: sanitizeQuiz(quiz),
    });
  } catch (error) {
    console.error("Quiz generation error:", error.message);

    return res.status(500).json({
      message: "Failed to generate quiz",
    });
  }
};

// 2. GET EXISTING QUIZ
export const getQuiz = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    if (!mongoose.isValidObjectId(noteId)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    const note = await Notes.findOne({
      _id: noteId,
      user: userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const quiz = await Quiz.findOne({
      user: userId,
      note: noteId,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not generated yet",
      });
    }

    return res.status(200).json({
      data: sanitizeQuiz(quiz),
    });
  } catch (error) {
    console.error("Quiz retrieval error:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve quiz",
    });
  }
};

// 3. SUBMIT QUIZ AND CALCULATE SCORE
export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId;
    const { answers } = req.body || {};

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      user: userId,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const note = await Notes.findOne({
      _id: quiz.note,
      user: userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Associated note not found",
      });
    }

    const totalQuestions = quiz.questions.length;

    // Validate submitted answers
    if (
      !Array.isArray(answers) ||
      answers.length !== totalQuestions ||
      !answers.every(
        (answer) => Number.isInteger(answer) && answer >= -1 && answer <= 3,
      )
    ) {
      return res.status(400).json({
        message: "Invalid submitted answers",
      });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    // Evaluate answers on the server
    const results = quiz.questions.map((q, index) => {
      const selectedAnswer = answers[index];

      const isCorrect = selectedAnswer === q.correctAnswer;

      if (selectedAnswer === -1) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        question: q.question,
        options: q.options,
        selectedAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
      };
    });

    const score = correctCount;

    const percentage = Math.round((score / totalQuestions) * 100);

    // Save individual quiz attempt
    const attempt = await QuizAttempt.create({
      user: userId,
      quiz: quiz._id,
      note: quiz.note,
      answers,
      score,
      totalQuestions,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
    });

    return res.status(200).json({
      message: "Quiz submitted successfully",

      data: {
        attemptId: attempt._id,
        score,
        totalQuestions,
        percentage,
        correctCount,
        incorrectCount,
        unansweredCount,
        results,
      },
    });
  } catch (error) {
    console.error("Quiz submission error:", error.message);

    return res.status(500).json({
      message: "Failed to submit quiz",
    });
  }
};

// 4. GET QUIZ ATTEMPT HISTORY
export const getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId;

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      user: userId,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    const note = await Notes.findOne({
      _id: quiz.note,
      user: userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Associated note not found",
      });
    }

    const attempts = await QuizAttempt.find({
      user: userId,
      quiz: quizId,
    })
      .select("-answers -__v")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      data: attempts,
    });
  } catch (error) {
    console.error("Quiz history error:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve quiz attempts",
    });
  }
};
