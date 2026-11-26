import express from "express";
import isAuth from "../middleware/isAuth.js";

import {
  createFlashcards,
  getFlashcards,
} from "../controllers/flashcard.controller.js";

const flashcardRouter = express.Router();

flashcardRouter.post("/generate/:noteId", isAuth, createFlashcards);

flashcardRouter.get("/:noteId", isAuth, getFlashcards);

export default flashcardRouter;
