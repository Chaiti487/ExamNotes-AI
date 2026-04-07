import express from "express";
import { generateNotes } from "../controllers/generate.controller.js";

const notesRouter = express.Router();

// ✅ NO AUTH (for now)
notesRouter.post("/generate", generateNotes);

export default notesRouter;
