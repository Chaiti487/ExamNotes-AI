import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notes",
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    cards: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },

        answer: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true },
);

flashcardSchema.index({ user: 1, note: 1 }, { unique: true });

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

export default Flashcard;
