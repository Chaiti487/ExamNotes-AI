import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import img from "../assets/img1.png";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📘",
      title: "AI Exam Notes",
      des: "Generate structured, exam-oriented notes with important concepts and quick revision points.",
    },
    {
      icon: "🗂️",
      title: "AI Flashcards",
      des: "Master important concepts with 10 interactive AI-generated flashcards.",
    },
    {
      icon: "🧠",
      title: "AI Practice Quiz",
      des: "Test your knowledge with AI-generated MCQs, instant scores and detailed explanations.",
    },
    {
      icon: "📈",
      title: "Performance Tracking",
      des: "Review previous quiz attempts, scores and percentages to track your learning progress.",
    },
    {
      icon: "📂",
      title: "Project Notes",
      des: "Generate well-structured documentation for assignments and academic projects.",
    },
    {
      icon: "📊",
      title: "Diagrams & Charts",
      des: "Understand complex topics through AI-generated diagrams and visual charts.",
    },
    {
      icon: "📚",
      title: "Personal Study Library",
      des: "Access saved notes, flashcards and practice quizzes anytime from your study history.",
    },
    {
      icon: "⬇️",
      title: "PDF Download",
      des: "Download clean, printable study notes for offline preparation and revision.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-white text-black">
      <Navbar />

      {/* ================= HERO SECTION ================= */}

      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LEFT SECTION */}

        <div>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ rotateX: 6, rotateY: -6 }}
            className="transform-gpu"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Hero Label */}

            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2 mb-6 text-xs sm:text-sm font-medium text-gray-700">
              ✨ Your AI-Powered Study Companion
            </div>

            {/* Hero Heading */}

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-br from-black/90 via-black/60 to-black/90 bg-clip-text text-transparent"
              whileHover={{ y: -4 }}
              style={{
                transform: "translateZ(40px)",
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
            >
              Study Smarter.
              <br />
              Learn Faster with AI.
            </motion.h1>

            {/* Hero Description */}

            <motion.p
              whileHover={{ y: -2 }}
              className="mt-6 max-w-xl text-lg text-gray-600 leading-relaxed"
              style={{
                transform: "translateZ(40px)",
              }}
            >
              Transform any topic into structured study notes, interactive
              flashcards and AI-powered practice quizzes. Revise important
              concepts, test your understanding and prepare for exams with
              confidence.
            </motion.p>

            {/* Hero Buttons */}

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <motion.button
                onClick={() => navigate("/notes")}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-xl flex items-center gap-3 bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/10 text-white font-semibold text-lg shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
              >
                Get Started →
              </motion.button>

              <motion.button
                onClick={() => navigate("/history")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-semibold text-lg hover:bg-gray-100 transition"
              >
                My Study Library
              </motion.button>
            </div>

            {/* Feature Highlights */}

            <div className="flex flex-wrap gap-4 mt-8 text-sm text-gray-600">
              <span>✓ AI Study Notes</span>

              <span>✓ Interactive Flashcards</span>

              <span>✓ Practice Quizzes</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SECTION */}

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{
            y: -12,
            rotateX: 8,
            rotateY: -8,
            scale: 1.05,
          }}
          className="transform-gpu"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div className="overflow-hidden">
            <img
              src={img}
              alt="ExamNotes AI study and learning illustration"
              className="w-full object-contain"
              style={{
                transform: "translateZ(35px)",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* ================= FEATURES SECTION ================= */}

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 lg:py-32">
        {/* Section Heading */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-gray-100 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 mb-5">
            Powerful Learning Features
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Everything You Need to Study Smarter
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-gray-500 text-lg leading-relaxed">
            From generating personalized notes to testing your knowledge,
            ExamNotes AI brings your essential study tools together in one
            platform.
          </p>
        </motion.div>

        {/* Feature Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              des={feature.des}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="bg-gray-50 border-y border-gray-200 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold">
              How It Works
            </h2>

            <p className="mt-4 text-gray-500">
              Your personalized learning journey in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StudyStep
              number="01"
              icon="✍️"
              title="Enter Your Topic"
              description="Choose any subject, topic or concept you want to learn."
            />

            <StudyStep
              number="02"
              icon="✨"
              title="Generate Study Material"
              description="Let AI create structured notes, revision points, diagrams and flashcards."
            />

            <StudyStep
              number="03"
              icon="🎯"
              title="Practice & Improve"
              description="Attempt quizzes, review explanations and track your previous scores."
            />
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}

      <section className="max-w-6xl mx-auto px-6 md:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-black via-gray-900 to-black text-white p-10 md:p-16 text-center shadow-2xl"
        >
          <div className="text-5xl mb-5">🚀</div>

          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Transform Your Learning?
          </h2>

          <p className="mt-5 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Generate notes, revise with flashcards and challenge yourself with
            AI-powered quizzes — all in one place.
          </p>

          <motion.button
            onClick={() => navigate("/notes")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 rounded-xl bg-white px-8 py-4 font-semibold text-black hover:bg-gray-200 transition"
          >
            Start Learning Now →
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

// ================= REUSABLE FEATURE CARD =================

function Feature({ icon, title, des, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -12,
        rotateX: 8,
        rotateY: -8,
        scale: 1.05,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        delay: (index % 4) * 0.08,
      }}
      className="group relative h-full rounded-2xl p-6 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-white"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div
        className="relative z-10"
        style={{
          transform: "translateZ(30px)",
        }}
      >
        <div className="text-4xl mb-4">{icon}</div>

        <h3 className="text-lg font-semibold mb-3">{title}</h3>

        <p className="text-gray-300 text-sm leading-relaxed">{des}</p>
      </div>
    </motion.div>
  );
}

// ================= REUSABLE STUDY STEP =================

function StudyStep({ number, icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <span className="absolute top-5 right-6 text-4xl font-extrabold text-gray-100">
        {number}
      </span>

      <div className="text-4xl mb-5">{icon}</div>

      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>

      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default Home;
