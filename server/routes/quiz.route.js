import express from "express";
import isAuth from "../middleware/isAuth.js";

import {
  createQuiz,
  getQuiz,
  submitQuiz,
  getQuizAttempts,
} from "../controllers/quiz.controller.js";

const quizRouter = express.Router();

// Generate or retrieve existing quiz
quizRouter.post("/generate/:noteId", isAuth, createQuiz);

// Retrieve quiz attempt history
quizRouter.get("/attempts/:quizId", isAuth, getQuizAttempts);

// Submit answers and calculate score
quizRouter.post("/submit/:quizId", isAuth, submitQuiz);

// Retrieve existing quiz
quizRouter.get("/:noteId", isAuth, getQuiz);

export default quizRouter;
