import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },

  options: {
    type: [String],
    required: true,
    validate: {
      validator: (options) => options.length === 4,
      message: "Each question must have exactly four options",
    },
  },

  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
    validate: {
      validator: Number.isInteger,
      message: "Correct answer must be an integer",
    },
  },

  explanation: {
    type: String,
    required: true,
    trim: true,
  },
});

const quizSchema = new mongoose.Schema(
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

    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (questions) => questions.length === 10,
        message: "A quiz must contain exactly 10 questions",
      },
    },
  },
  { timestamps: true },
);

quizSchema.index({ user: 1, note: 1 }, { unique: true });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
