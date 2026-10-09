"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Form, Question, QuestionType } from "@/lib/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft,
  Eye,
  Share2,
  Trash2,
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Check,
  Type,
  AlignLeft,
  List,
  ChevronDown as DropdownIcon,
  Mail,
  Hash,
  ToggleLeft,
  Star,
  ExternalLink,
  Sparkles,
  BarChart2
} from "lucide-react";

const QUESTION_TYPE_LABELS: Record<QuestionType, { label: string; icon: any; defaultTitle: string }> = {
  short_text: { label: "Short Text", icon: Type, defaultTitle: "What is your name?" },
  long_text: { label: "Long Text", icon: AlignLeft, defaultTitle: "Tell us more details:" },
  multiple_choice: { label: "Multiple Choice", icon: List, defaultTitle: "Select an option:" },
  dropdown: { label: "Dropdown", icon: DropdownIcon, defaultTitle: "Choose from list:" },
  email: { label: "Email", icon: Mail, defaultTitle: "What is your email address?" },
  number: { label: "Number", icon: Hash, defaultTitle: "Enter a number:" },
  yes_no: { label: "Yes / No", icon: ToggleLeft, defaultTitle: "Do you agree with this?" },
  rating: { label: "Rating", icon: Star, defaultTitle: "How would you rate this?" },
};

interface SortableQuestionItemProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}

function SortableQuestionItem({ question, index, isSelected, onSelect, onMove }: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const info = QUESTION_TYPE_LABELS[question.question_type] || QUESTION_TYPE_LABELS.short_text;
  const Icon = info.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(question.id)}
      className={`group relative flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-grab active:cursor-grabbing transition-all ${
        isSelected
          ? "bg-purple-950/20 border-purple-500/40 text-white shadow-sm"
          : "bg-[#18181d] border-transparent text-zinc-400 hover:bg-[#1f1f26] hover:text-zinc-200"
      }`}
    >
      <div className="p-1 text-zinc-600 hover:text-zinc-400">
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      <span className="w-5 text-center text-xs font-bold text-zinc-500">
        {index + 1}
      </span>

      <div
        className={`p-1.5 rounded-lg ${
          isSelected ? "bg-purple-500/20 text-purple-300" : "bg-black/30 text-zinc-400"
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      <span className="flex-1 text-xs font-medium truncate">
        {question.title || "Untitled question"}
      </span>

      <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove(index, "up");
          }}
          className="p-1 hover:text-white"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove(index, "down");
          }}
          className="p-1 hover:text-white"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function FormBuilderContent() {
  const routeParams = useParams();
  const formId = routeParams?.formId as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"build" | "preview">("build");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving">("saved");

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await api.getForm(formId);
      setForm(data);
      if (data.questions.length > 0 && !selectedQuestionId) {
        setSelectedQuestionId(data.questions[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!form || !over) return;

    if (active.id !== over.id) {
      const oldIndex = form.questions.findIndex((q) => q.id === active.id);
      const newIndex = form.questions.findIndex((q) => q.id === over.id);

      const list = [...form.questions];
      const reordered = arrayMove(list, oldIndex, newIndex).map((q, idx) => ({
        ...q,
        order_index: idx,
      }));

      setForm({ ...form, questions: reordered });

      try {
        await api.reorderQuestions(
          formId,
          reordered.map((q) => ({ id: q.id, order_index: q.order_index }))
        );
      } catch (err) {
        console.error("Reorder failed", err);
      }
    }
  };

  useEffect(() => {
    loadForm();
  }, [formId]);

  const activeQuestion = form?.questions.find((q) => q.id === selectedQuestionId) || null;

  // Title update
  const handleUpdateFormTitle = async (newTitle: string) => {
    if (!form || !newTitle.trim()) return;
    setForm({ ...form, title: newTitle });
    setSavingStatus("saving");
    try {
      await api.updateForm(formId, { title: newTitle });
      setSavingStatus("saved");
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle publish
  const handleTogglePublish = async () => {
    if (!form) return;
    try {
      const updated = await api.togglePublish(formId);
      setForm({ ...form, status: updated.status });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Add Question
  const handleAddQuestion = async (type: QuestionType) => {
    if (!form) return;
    const defaultInfo = QUESTION_TYPE_LABELS[type];
    const initialOptions =
      type === "multiple_choice" || type === "dropdown"
        ? JSON.stringify(["Option 1", "Option 2", "Option 3"])
        : null;

    try {
      setSavingStatus("saving");
      const created = await api.addQuestion(formId, {
        title: defaultInfo.defaultTitle,
        question_type: type,
        is_required: false,
        options_json: initialOptions,
      });

      const updatedQuestions = [...form.questions, created];
      setForm({ ...form, questions: updatedQuestions });
      setSelectedQuestionId(created.id);
      setIsAddModalOpen(false);
      setSavingStatus("saved");
    } catch (err) {
      alert("Failed to add question");
    }
  };

  // Update Active Question
  const handleUpdateQuestion = async (updates: Partial<Question>) => {
    if (!form || !activeQuestion) return;
    const updatedQ = { ...activeQuestion, ...updates };

    const updatedQuestions = form.questions.map((q) =>
      q.id === activeQuestion.id ? updatedQ : q
    );
    setForm({ ...form, questions: updatedQuestions });

    setSavingStatus("saving");
    try {
      await api.updateQuestion(formId, activeQuestion.id, updates);
      setSavingStatus("saved");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (qId: string) => {
    if (!form) return;
    if (form.questions.length <= 1) {
      alert("A form must have at least one question.");
      return;
    }
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await api.deleteQuestion(formId, qId);
      const remaining = form.questions.filter((q) => q.id !== qId);
      setForm({ ...form, questions: remaining });
      if (selectedQuestionId === qId) {
        setSelectedQuestionId(remaining[0]?.id || null);
      }
    } catch (err) {
      alert("Failed to delete question");
    }
  };

  // Move Question Order
  const handleMoveQuestion = async (index: number, direction: "up" | "down") => {
    if (!form) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= form.questions.length) return;

    const list = [...form.questions];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const reordered = list.map((q, idx) => ({ ...q, order_index: idx }));
    setForm({ ...form, questions: reordered });

    try {
      await api.reorderQuestions(
        formId,
        reordered.map((q) => ({ id: q.id, order_index: q.order_index }))
      );
    } catch (err) {
      console.error("Reorder failed", err);
    }
  };

  // Multiple Choice Options helper
  const parsedOptions: string[] = (() => {
    if (!activeQuestion?.options_json) return ["Option 1", "Option 2"];
    try {
      return JSON.parse(activeQuestion.options_json);
    } catch {
      return ["Option 1", "Option 2"];
    }
  })();

  const handleUpdateOptions = (newOpts: string[]) => {
    handleUpdateQuestion({ options_json: JSON.stringify(newOpts) });
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-[#111114] flex items-center justify-center text-zinc-400 text-sm">
        Loading builder...
      </div>
    );
  }

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/share/${form.share_slug}`;

  return (
    <div className="h-screen flex flex-col bg-[#0f0f12] text-zinc-100 overflow-hidden select-none">
      {/* ---------------- TOP NAVBAR ---------------- */}
      <header className="h-14 border-b border-white/5 bg-[#141418] px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Form Title (Inline editable) */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleUpdateFormTitle(e.target.value)}
            className="bg-transparent font-medium text-sm text-white hover:bg-zinc-900 focus:bg-zinc-900 focus:outline-none px-2.5 py-1 rounded-md border border-transparent focus:border-purple-500/50 max-w-xs sm:max-w-md"
          />

          <span className="text-[11px] text-zinc-500">
            {savingStatus === "saving" ? "Saving..." : "Saved"}
          </span>
        </div>

        {/* Center Tabs: Build vs Preview */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab("build")}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === "build"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Build
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href={`/forms/${form.id}/results`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800"
          >
            <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
            Results
          </Link>

          {/* Publish Toggle Button */}
          <button
            onClick={handleTogglePublish}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              form.status === "published"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                form.status === "published" ? "bg-emerald-400" : "bg-zinc-500"
              }`}
            />
            {form.status === "published" ? "Published" : "Publish"}
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </header>

      {/* ---------------- 3-COLUMN BUILDER WORKSPACE ---------------- */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= LEFT PANE: QUESTIONS LIST ================= */}
        <aside className="w-72 border-r border-white/5 bg-[#121216] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Content ({form.questions.length})
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={form.questions.map(q => q.id)}
                strategy={verticalListSortingStrategy}
              >
                {form.questions.map((q, idx) => (
                  <SortableQuestionItem
                    key={q.id}
                    question={q}
                    index={idx}
                    isSelected={q.id === selectedQuestionId}
                    onSelect={setSelectedQuestionId}
                    onMove={handleMoveQuestion}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Add question footer button */}
          <div className="p-3 border-t border-white/5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 text-xs font-medium text-zinc-400 hover:text-purple-300 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add new question
            </button>
          </div>
        </aside>

        {/* ================= CENTER PANE: QUESTION EDITOR / PREVIEW ================= */}
        <main className="flex-1 flex flex-col bg-[#0f0f12] overflow-y-auto">
          {activeTab === "build" ? (
            activeQuestion ? (
              <div className="max-w-2xl w-full mx-auto p-10 space-y-8 my-auto">
                <div className="space-y-4">
                  {/* Question Order & Type Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-400 font-mono">
                      {form.questions.findIndex((q) => q.id === activeQuestion.id) + 1} →
                    </span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                      {QUESTION_TYPE_LABELS[activeQuestion.question_type]?.label}
                    </span>
                  </div>

                  {/* Big Editable Question Title */}
                  <textarea
                    rows={2}
                    value={activeQuestion.title}
                    onChange={(e) => handleUpdateQuestion({ title: e.target.value })}
                    placeholder="Type your question prompt here..."
                    className="w-full bg-transparent text-2xl sm:text-3xl font-medium text-white placeholder-zinc-600 focus:outline-none resize-none leading-snug"
                  />

                  {/* Editable Description / Help Text */}
                  <input
                    type="text"
                    value={activeQuestion.description || ""}
                    onChange={(e) => handleUpdateQuestion({ description: e.target.value })}
                    placeholder="Description (optional)"
                    className="w-full bg-transparent text-sm text-zinc-400 placeholder-zinc-600 focus:outline-none border-b border-transparent focus:border-zinc-800 pb-1"
                  />
                </div>

                {/* Question Type Specific Editor Controls */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  {/* Multiple Choice / Dropdown Option Builder */}
                  {(activeQuestion.question_type === "multiple_choice" ||
                    activeQuestion.question_type === "dropdown") && (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Choices
                      </label>
                      <div className="space-y-2">
                        {parsedOptions.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <span className="w-6 text-center text-xs font-mono text-zinc-500">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const next = [...parsedOptions];
                                next[optIdx] = e.target.value;
                                handleUpdateOptions(next);
                              }}
                              className="flex-1 rounded-xl bg-zinc-900 border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                            {parsedOptions.length > 2 && (
                              <button
                                onClick={() => {
                                  const next = parsedOptions.filter((_, idx) => idx !== optIdx);
                                  handleUpdateOptions(next);
                                }}
                                className="p-1.5 text-zinc-500 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateOptions([...parsedOptions, `Option ${parsedOptions.length + 1}`]);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add another choice
                      </button>
                    </div>
                  )}

                  {/* Rating Preview */}
                  {activeQuestion.question_type === "rating" && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Rating Scale (1 - 10)
                      </label>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <div
                            key={num}
                            className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-300"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Yes / No Preview */}
                  {activeQuestion.question_type === "yes_no" && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Yes / No Buttons
                      </label>
                      <div className="flex gap-3 pt-2">
                        <div className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-300">
                          [Y] Yes
                        </div>
                        <div className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-300">
                          [N] No
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text / Email / Number placeholders */}
                  {activeQuestion.question_type === "short_text" && (
                    <div className="text-xs text-zinc-500 italic border-b border-zinc-800 pb-2">
                      Respondent types a single line of text...
                    </div>
                  )}
                  {activeQuestion.question_type === "long_text" && (
                    <div className="text-xs text-zinc-500 italic border border-dashed border-zinc-800 rounded-xl p-4">
                      Respondent types a multi-line paragraph...
                    </div>
                  )}
                  {activeQuestion.question_type === "email" && (
                    <div className="text-xs text-zinc-500 italic border-b border-zinc-800 pb-2">
                      name@example.com (validated email format)
                    </div>
                  )}
                  {activeQuestion.question_type === "number" && (
                    <div className="text-xs text-zinc-500 italic border-b border-zinc-800 pb-2">
                      12345 (validated numeric input)
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                Select or add a question to edit
              </div>
            )
          ) : (
            /* ================= LIVE PREVIEW TAB ================= */
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#09090b]">
              <div className="w-full max-w-xl p-8 rounded-3xl bg-[#141418] border border-white/10 shadow-2xl text-left space-y-6">
                <div className="flex items-center justify-between text-xs text-purple-400 font-mono">
                  <span>LIVE PREVIEW MODE</span>
                  <span>{form.title}</span>
                </div>

                {activeQuestion ? (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-serif text-white">
                      {activeQuestion.title}
                    </h3>
                    {activeQuestion.description && (
                      <p className="text-xs text-zinc-400">
                        {activeQuestion.description}
                      </p>
                    )}

                    <div className="pt-4">
                      {activeQuestion.question_type === "multiple_choice" && (
                        <div className="space-y-2">
                          {parsedOptions.map((opt, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200"
                            >
                              <span className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center font-mono text-[10px]">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeQuestion.question_type === "rating" && (
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <button
                              key={n}
                              className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 hover:border-purple-500 text-xs font-bold text-white"
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeQuestion.question_type === "yes_no" && (
                        <div className="flex gap-3">
                          <button className="flex-1 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-purple-500 text-xs font-semibold text-white">
                            Yes
                          </button>
                          <button className="flex-1 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-purple-500 text-xs font-semibold text-white">
                            No
                          </button>
                        </div>
                      )}

                      {(activeQuestion.question_type === "short_text" ||
                        activeQuestion.question_type === "email" ||
                        activeQuestion.question_type === "number") && (
                        <input
                          disabled
                          placeholder="Your answer here..."
                          className="w-full bg-transparent border-b border-zinc-700 py-2 text-sm text-zinc-400 focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </main>

        {/* ================= RIGHT PANE: SETTINGS INSPECTOR ================= */}
        {activeQuestion && (
          <aside className="w-72 border-l border-white/5 bg-[#121216] p-5 space-y-6 shrink-0 overflow-y-auto">
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Question Settings
              </span>
            </div>

            {/* Change Type Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Question Type</label>
              <select
                value={activeQuestion.question_type}
                onChange={(e) => handleUpdateQuestion({ question_type: e.target.value as QuestionType })}
                className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {Object.entries(QUESTION_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-xs font-medium text-white">Required</div>
                <div className="text-[10px] text-zinc-500">Respondent must answer</div>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateQuestion({ is_required: !activeQuestion.is_required })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  activeQuestion.is_required ? "bg-purple-600 justify-end" : "bg-zinc-800 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Delete Question */}
            <div className="pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleDeleteQuestion(activeQuestion.id)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete question
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ---------------- MODAL: ADD QUESTION ---------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#16161b] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Add a new question</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Select a question format</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((typeKey) => {
                const item = QUESTION_TYPE_LABELS[typeKey];
                const Icon = item.icon;
                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => handleAddQuestion(typeKey)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900 border border-white/5 hover:border-purple-500/40 hover:bg-zinc-800/80 transition-all text-left group"
                  >
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{item.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: SHARE FORM ---------------- */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-[#16161b] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Share your form</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Anyone with this public link can fill out your form without logging in.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent text-zinc-200 focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-[11px] hover:bg-zinc-200 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                  {copiedLink ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-zinc-500">Status:</span>
                <span
                  className={
                    form.status === "published" ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"
                  }
                >
                  {form.status === "published"
                    ? "Published (Active & collecting answers)"
                    : "Draft (Must publish before sharing)"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <a
                href={`/share/${form.share_slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                Open in new tab
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-zinc-400 text-sm">Loading builder...</div>}>
      <FormBuilderContent />
    </Suspense>
  );
}
