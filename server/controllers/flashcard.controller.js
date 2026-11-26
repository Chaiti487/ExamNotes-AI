import mongoose from "mongoose";
import Notes from "../models/notes.model.js";
import Flashcard from "../models/flashcard.model.js";
import { generateFlashcards } from "../services/study.services.js";

export const createFlashcards = async (req, res) => {
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
        message: "Notes not found",
      });
    }

    const existing = await Flashcard.findOne({
      user: userId,
      note: noteId,
    });

    if (existing) {
      return res.status(200).json({
        message: "Existing flashcards retrieved",
        data: existing,
        cached: true,
      });
    }

    const cards = await generateFlashcards(note.topic, note.content);

    const flashcards = await Flashcard.findOneAndUpdate(
      {
        user: userId,
        note: noteId,
      },
      {
        $setOnInsert: {
          user: userId,
          note: noteId,
          topic: note.topic,
          cards,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "Flashcards available successfully",
      data: flashcards,
    });
  } catch (error) {
    console.error("Flashcard generation error:", error);

    return res.status(500).json({
      message: "Failed to generate flashcards",
    });
  }
};

export const getFlashcards = async (req, res) => {
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
        message: "Notes not found",
      });
    }

    const flashcards = await Flashcard.findOne({
      user: userId,
      note: noteId,
    });

    if (!flashcards) {
      return res.status(404).json({
        message: "Flashcards not generated yet",
      });
    }

    return res.status(200).json({
      data: flashcards,
    });
  } catch (error) {
    console.error("Flashcard retrieval error:", error);

    return res.status(500).json({
      message: "Failed to retrieve flashcards",
    });
  }
};
