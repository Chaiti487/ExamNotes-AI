import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notes",
      required: true,
    },

    answers: {
      type: [Number],
      required: true,
      validate: {
        validator: (answers) =>
          answers.length === 10 &&
          answers.every(
            (answer) => Number.isInteger(answer) && answer >= -1 && answer <= 3,
          ),
        message: "Invalid quiz answers",
      },
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    correctCount: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    incorrectCount: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    unansweredCount: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true },
);

quizAttemptSchema.index({
  user: 1,
  quiz: 1,
  createdAt: -1,
});

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;
