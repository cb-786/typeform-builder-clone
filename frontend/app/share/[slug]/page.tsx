"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { api } from "@/lib/api";
import { PublicForm, PublicQuestion } from "@/lib/types";
import {
  ChevronUp,
  ChevronDown,
  Check,
  CornerDownLeft,
  AlertCircle,
  Star,
  Sparkles,
  ArrowRight
} from "lucide-react";

function ShareRespondentContent() {
  const routeParams = useParams();
  const slug = routeParams?.slug as string;

  const [form, setForm] = useState<PublicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [shake, setShake] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Load public form
  useEffect(() => {
    async function fetchPublicForm() {
      try {
        setLoading(true);
        const data = await api.getPublicForm(slug);
        setForm(data);
      } catch (err: any) {
        setError(err.message || "Failed to load form. It may be in draft mode or deleted.");
      } finally {
        setLoading(false);
      }
    }
    fetchPublicForm();
  }, [slug]);

  const questions = form?.questions || [];
  const currentQ = questions[currentIndex] || null;

  // Auto focus active input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isSubmitted]);

  // Trigger error shake animation
  const triggerShake = (msg: string) => {
    setValidationError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Validate current question answer
  const validateCurrent = (): boolean => {
    if (!currentQ) return true;
    const val = (answers[currentQ.id] || "").trim();

    if (currentQ.is_required && !val) {
      triggerShake("Please answer this question to proceed.");
      return false;
    }

    if (currentQ.question_type === "email" && val) {
      const emailRegex = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(val)) {
        triggerShake("Please enter a valid email address.");
        return false;
      }
    }

    if (currentQ.question_type === "number" && val) {
      if (isNaN(Number(val))) {
        triggerShake("Please enter a valid numeric value.");
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  // Submit whole form
  const handleSubmit = async () => {
    if (!validateCurrent()) return;
    if (!form) return;

    try {
      setIsSubmitting(true);
      const formattedAnswers = Object.entries(answers).map(([qId, text]) => ({
        question_id: qId,
        answer_text: text,
      }));

      await api.submitForm(slug, formattedAnswers);
      setIsSubmitted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a855f7", "#ec4899", "#3b82f6", "#10b981"]
      });
    } catch (err: any) {
      triggerShake(err.message || "Failed to submit response.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Advance to next question
  const handleNext = () => {
    if (!validateCurrent()) return;

    if (currentIndex < questions.length - 1) {
      setDirection("up");
      setCurrentIndex((prev) => prev + 1);
      setValidationError(null);
    } else {
      handleSubmit();
    }
  };

  // Move to previous question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection("down");
      setCurrentIndex((prev) => prev - 1);
      setValidationError(null);
    }
  };

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted || !currentQ) return;

      // Enter advances
      if (e.key === "Enter" && !e.shiftKey) {
        // Prevent default form submit behaviors
        if (currentQ.question_type !== "long_text") {
          e.preventDefault();
          handleNext();
        }
      }

      // Hotkey for multiple choice (A, B, C...)
      if (
        (currentQ.question_type === "multiple_choice" || currentQ.question_type === "dropdown") &&
        currentQ.options_json
      ) {
        try {
          const opts: string[] = JSON.parse(currentQ.options_json);
          const pressedLetter = e.key.toUpperCase();
          const targetIndex = pressedLetter.charCodeAt(0) - 65;

          if (targetIndex >= 0 && targetIndex < opts.length && !e.ctrlKey && !e.metaKey && !e.altKey) {
            setAnswers((prev) => ({ ...prev, [currentQ.id]: opts[targetIndex] }));
            setValidationError(null);
            setTimeout(() => handleNext(), 200);
          }
        } catch {}
      }

      // Hotkey for Yes/No (Y / N)
      if (currentQ.question_type === "yes_no") {
        if (e.key.toLowerCase() === "y") {
          setAnswers((prev) => ({ ...prev, [currentQ.id]: "Yes" }));
          setTimeout(() => handleNext(), 200);
        } else if (e.key.toLowerCase() === "n") {
          setAnswers((prev) => ({ ...prev, [currentQ.id]: "No" }));
          setTimeout(() => handleNext(), 200);
        }
      }

      // Hotkey for Rating (1 - 9)
      if (currentQ.question_type === "rating") {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          setAnswers((prev) => ({ ...prev, [currentQ.id]: num.toString() }));
          setTimeout(() => handleNext(), 200);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, answers, currentQ, isSubmitted]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Loading form...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-[#141418] border border-white/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-white">Form Not Available</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
          <Link
            href="/"
            className="inline-block rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Progress percentage
  const progressPercent = Math.round(((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100);

  // Thank You Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex flex-col items-center justify-center p-6 text-center select-none animate-slide-up">
        <div className="relative max-w-lg p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#181822] to-[#121218] border border-purple-500/20 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <Check className="w-8 h-8" />
          </div>

          <h2 className="serif-headline text-3xl sm:text-4xl font-normal text-white">
            Thank you!
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
            Your response has been saved successfully. We appreciate you taking the time to share your feedback!
          </p>

          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors"
            >
              Create your own Typeform
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => {
                setAnswers({});
                setCurrentIndex(0);
                setIsSubmitted(false);
              }}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Submit another response
            </button>
          </div>
        </div>
      </div>
    );
  }

  const parsedOptions: string[] = (() => {
    if (!currentQ?.options_json) return [];
    try {
      return JSON.parse(currentQ.options_json);
    } catch {
      return [];
    }
  })();

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Brand Tag */}
      <header className="p-6 sm:p-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-white text-black font-black text-[10px]">
            //
          </div>
          <span className="font-semibold text-sm tracking-tight">typeform</span>
        </Link>

        <span className="text-[11px] font-mono text-zinc-500">
          {currentIndex + 1} of {questions.length}
        </span>
      </header>

      {/* Main Center Conversational Question Stage */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 max-w-3xl w-full mx-auto">
        {currentQ && (
          <div
            key={currentQ.id}
            className={`w-full space-y-8 ${
              direction === "up" ? "animate-slide-up" : "animate-slide-down"
            } ${shake ? "animate-shake" : ""}`}
          >
            {/* Question Index & Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-400 font-mono">
                <span>{currentIndex + 1}</span>
                <span>→</span>
                {currentQ.is_required && (
                  <span className="text-zinc-500 text-xs font-normal">* required</span>
                )}
              </div>

              <h2 className="serif-headline text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight">
                {currentQ.title}
              </h2>

              {currentQ.description && (
                <p className="text-sm sm:text-base text-zinc-400 font-light">
                  {currentQ.description}
                </p>
              )}
            </div>

            {/* Validation Alert */}
            {validationError && (
              <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Question Inputs */}
            <div className="pt-2">
              {/* Short Text */}
              {currentQ.question_type === "short_text" && (
                <div className="space-y-4">
                  <input
                    ref={inputRef as any}
                    type="text"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentQ.id]: e.target.value });
                      setValidationError(null);
                    }}
                    placeholder="Type your answer here..."
                    className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-purple-400 pb-3 text-xl sm:text-2xl text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-600/20"
                    >
                      OK <Check className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      press <CornerDownLeft className="w-3 h-3" /> <strong>Enter</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Long Text */}
              {currentQ.question_type === "long_text" && (
                <div className="space-y-4">
                  <textarea
                    ref={inputRef as any}
                    rows={4}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentQ.id]: e.target.value });
                      setValidationError(null);
                    }}
                    placeholder="Type your answer here..."
                    className="w-full bg-zinc-900/60 border border-zinc-700 focus:border-purple-400 p-4 rounded-2xl text-base sm:text-lg text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-600/20"
                    >
                      OK <Check className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-zinc-500">
                      Shift + Enter for new line
                    </span>
                  </div>
                </div>
              )}

              {/* Email */}
              {currentQ.question_type === "email" && (
                <div className="space-y-4">
                  <input
                    ref={inputRef as any}
                    type="email"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentQ.id]: e.target.value });
                      setValidationError(null);
                    }}
                    placeholder="name@example.com"
                    className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-purple-400 pb-3 text-xl sm:text-2xl text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-600/20"
                    >
                      OK <Check className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      press <CornerDownLeft className="w-3 h-3" /> <strong>Enter</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Number */}
              {currentQ.question_type === "number" && (
                <div className="space-y-4">
                  <input
                    ref={inputRef as any}
                    type="number"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentQ.id]: e.target.value });
                      setValidationError(null);
                    }}
                    placeholder="Enter a number..."
                    className="w-full bg-transparent border-b-2 border-zinc-700 focus:border-purple-400 pb-3 text-xl sm:text-2xl text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-600/20"
                    >
                      OK <Check className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      press <CornerDownLeft className="w-3 h-3" /> <strong>Enter</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Multiple Choice & Dropdown */}
              {(currentQ.question_type === "multiple_choice" || currentQ.question_type === "dropdown") && (
                <div className="space-y-2.5 max-w-lg">
                  {parsedOptions.map((opt, optIndex) => {
                    const isSelected = answers[currentQ.id] === opt;
                    const letter = String.fromCharCode(65 + optIndex);

                    return (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => {
                          setAnswers({ ...answers, [currentQ.id]: opt });
                          setValidationError(null);
                          setTimeout(() => handleNext(), 200);
                        }}
                        className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10 scale-[1.01]"
                            : "bg-[#16161b] border-white/10 hover:border-purple-500/40 hover:bg-[#1a1a22] text-zinc-300"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center font-bold border transition-colors ${
                            isSelected
                              ? "bg-purple-600 border-purple-500 text-white"
                              : "bg-black/30 border-white/10 text-zinc-400"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-sm font-medium flex-1">{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Yes / No */}
              {currentQ.question_type === "yes_no" && (
                <div className="flex items-center gap-4 max-w-sm">
                  {["Yes", "No"].map((choice) => {
                    const isSelected = answers[currentQ.id] === choice;
                    const letter = choice === "Yes" ? "Y" : "N";

                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => {
                          setAnswers({ ...answers, [currentQ.id]: choice });
                          setValidationError(null);
                          setTimeout(() => handleNext(), 200);
                        }}
                        className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? "bg-purple-600/20 border-purple-500 text-white shadow-lg"
                            : "bg-[#16161b] border-white/10 hover:border-purple-500/40 hover:bg-[#1a1a22] text-zinc-300"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center font-bold bg-black/30 border border-white/10 text-zinc-400">
                          {letter}
                        </span>
                        <span className="text-base font-semibold">{choice}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Rating Scale */}
              {currentQ.question_type === "rating" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isSelected = answers[currentQ.id] === num.toString();

                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, [currentQ.id]: num.toString() });
                            setValidationError(null);
                            setTimeout(() => handleNext(), 200);
                          }}
                          className={`w-11 h-12 rounded-2xl border flex items-center justify-center text-sm font-bold transition-all hover:scale-110 ${
                            isSelected
                              ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30"
                              : "bg-[#16161b] border-white/10 hover:border-purple-500/50 hover:bg-[#1a1a22] text-zinc-300"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-500 font-medium px-1">
                    <span>1 (Poor)</span>
                    <span>10 (Exceptional)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer Controls & Progress Bar */}
      <footer className="p-6 sm:p-8 flex items-center justify-between border-t border-white/5 bg-[#0e0e11]/50 backdrop-blur-sm">
        {/* Progress bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xs">
          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {progressPercent}%
          </span>
        </div>

        {/* Up / Down Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-[#181820] border border-white/10 rounded-xl p-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function ShareRespondentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-zinc-400">Loading form...</div>}>
      <ShareRespondentContent />
    </Suspense>
  );
}
