import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { serverUrl } from "../App";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import FinalResult from "../components/FinalResult";

function History() {
  const [topics, setTopics] = useState([]);

  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);

  const credits = userData?.credits || 0;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeNoteId, setActiveNoteId] = useState(null);

  const [selectedNote, setSelectedNote] = useState(null);

  const [loading, setLoading] = useState(false);

  const [topicsLoading, setTopicsLoading] = useState(true);

  const [error, setError] = useState("");

  const [topicsError, setTopicsError] = useState("");

  const requestId = useRef(0);

  // ================= FETCH SAVED NOTES =================

  useEffect(() => {
    const controller = new AbortController();

    const myNotes = async () => {
      setTopicsLoading(true);
      setTopicsError("");

      try {
        const res = await axios.get(serverUrl + "/api/notes/getnotes", {
          withCredentials: true,
          signal: controller.signal,
        });

        setTopics(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        if (axios.isCancel(error)) return;

        console.error("Failed to fetch notes:", error);

        setTopicsError("Failed to load your saved notes.");
      } finally {
        if (!controller.signal.aborted) {
          setTopicsLoading(false);
        }
      }
    };

    myNotes();

    return () => controller.abort();
  }, []);

  // ================= OPEN SELECTED NOTE =================

  const openNotes = async (noteId) => {
    if (!noteId) return;

    const currentRequest = ++requestId.current;

    setLoading(true);
    setError("");
    setSelectedNote(null);
    setActiveNoteId(noteId);

    // Close sidebar on mobile devices

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    try {
      const res = await axios.get(serverUrl + `/api/notes/${noteId}`, {
        withCredentials: true,
      });

      // Ignore outdated responses

      if (currentRequest !== requestId.current) {
        return;
      }

      if (!res.data?.content) {
        throw new Error("Invalid note content");
      }

      setSelectedNote(res.data.content);
    } catch (error) {
      if (currentRequest !== requestId.current) {
        return;
      }

      console.error("Failed to open note:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load the selected note. Please try again.",
      );
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  };

  // ================= RESPONSIVE SIDEBAR =================

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 md:px-6 py-8">
      {/* ================= HEADER ================= */}

      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
                    mb-10
                    rounded-2xl
                    bg-black/80 backdrop-blur-xl
                    border border-white/10
                    px-6 md:px-8 py-6
                    items-start
                    flex justify-between
                    md:items-center gap-4
                    flex-wrap md:flex-row
                    shadow-[0_20px_45px_rgba(0,0,0,0.6)]
                "
      >
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            ExamNotes AI
          </h1>

          <p className="text-sm text-gray-300 mt-1">
            AI-powered notes, flashcards & quizzes
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Credits Button */}

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm"
            onClick={() => navigate("/pricing")}
          >
            <span className="text-xl">🔷</span>

            <span>{credits}</span>

            <motion.span
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.97 }}
              className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold"
            >
              ➕
            </motion.span>
          </button>

          {/* Mobile Menu Button */}

          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-white text-2xl"
              aria-label="Open saved notes"
            >
              <GiHamburgerMenu />
            </button>
          )}
        </div>
      </motion.header>

      {/* ================= MAIN LAYOUT ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mobile Sidebar Overlay */}

        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}

        {/* ================= SIDEBAR ================= */}

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
              className="
                                fixed lg:static
                                top-0 left-0
                                z-50 lg:z-auto
                                w-72 lg:w-auto
                                h-full lg:h-[75vh]
                                lg:rounded-3xl
                                lg:col-span-1
                                bg-black/90 lg:bg-black/80
                                backdrop-blur-xl
                                border border-white/10
                                shadow-[0_20px_45px_rgba(0,0,0,0.6)]
                                p-5
                                overflow-y-auto
                            "
            >
              {/* Mobile Close Button */}

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white mb-4"
              >
                ⬅️ Back
              </button>

              <div className="mb-4 space-y-1">
                {/* Create New Notes */}

                <button
                  onClick={() => navigate("/notes")}
                  className="w-full px-3 py-2 rounded-lg text-sm text-gray-200 bg-white/10 text-start hover:bg-white/20"
                >
                  ➕ New Notes
                </button>

                <hr className="border-white/10 mb-4" />

                <h2 className="mb-4 text-lg font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  📚 Your Notes
                </h2>

                {/* Loading Saved Notes */}

                {topicsLoading && (
                  <p className="text-sm text-gray-400 animate-pulse">
                    Loading saved notes...
                  </p>
                )}

                {/* Saved Notes Error */}

                {topicsError && (
                  <p className="text-sm text-red-400">{topicsError}</p>
                )}

                {/* Empty State */}

                {!topicsLoading && !topicsError && topics.length === 0 && (
                  <p className="text-sm text-gray-400">No notes created yet.</p>
                )}

                {/* Saved Notes List */}

                <ul className="space-y-3">
                  {topics.map((t) => (
                    <li key={t._id}>
                      <button
                        onClick={() => openNotes(t._id)}
                        className={`w-full text-left cursor-pointer rounded-xl p-3 border transition-all ${
                          activeNoteId === t._id
                            ? "bg-indigo-500/30 border-indigo-400 shadow-[0_0_0_1px_rgba(99,102,241,0.6)]"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {/* Topic Name */}

                        <p className="text-sm font-semibold text-white">
                          {t.topic}
                        </p>

                        {/* Topic Information */}

                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          {t.classLevel && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                              Class Level: {t.classLevel}
                            </span>
                          )}

                          {t.examType && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                              {t.examType}
                            </span>
                          )}
                        </div>

                        {/* Additional Features */}

                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-300">
                          {t.revisionMode && <span>⚡ Revision</span>}

                          {t.includeDiagram && <span>📊 Diagram</span>}

                          {t.includeChart && <span>📈 Chart</span>}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= NOTES CONTENT ================= */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
                        lg:col-span-3
                        min-w-0
                        rounded-2xl
                        bg-white
                        shadow-[0_15px_40px_rgba(0,0,0,0.15)]
                        p-4 md:p-6
                        min-h-[75vh]
                    "
        >
          {/* Loading State */}

          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />

              <p className="text-gray-500">Loading your study notes...</p>
            </div>
          )}

          {/* Error State */}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
              <p className="text-red-700">{error}</p>

              <button
                onClick={() => openNotes(activeNoteId)}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Initial Empty State */}

          {!loading && !error && !selectedNote && (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-4">
              <div className="text-6xl">📚</div>

              <h2 className="text-xl font-bold text-gray-700">
                Your Personal Study Library
              </h2>

              <p className="max-w-md text-sm text-gray-500">
                Select a saved topic from the sidebar to access your study
                notes, AI flashcards and practice quizzes.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                  📘 Study Notes
                </span>

                <span className="rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-700">
                  🗂️ Flashcards
                </span>

                <span className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  🧠 AI Quiz
                </span>
              </div>
            </div>
          )}

          {/* ================= FINAL RESULT ================= */}

          {!loading && !error && selectedNote && (
            <FinalResult
              key={activeNoteId}
              result={selectedNote}
              noteId={activeNoteId}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default History;
