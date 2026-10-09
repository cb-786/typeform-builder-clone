"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { FormListItem } from "@/lib/types";
import { 
  Plus, 
  Search, 
  Copy, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  CopyCheck, 
  Layers, 
  BarChart2, 
  Check, 
  Share2,
  FileText
} from "lucide-react";

export default function DashboardPage() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await api.getForms();
      setForms(data);
    } catch (err) {
      console.error("Failed to load forms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setIsSubmitting(true);
      const created = await api.createForm(newTitle.trim(), newDescription.trim() || undefined);
      setIsCreateOpen(false);
      setNewTitle("");
      setNewDescription("");
      window.location.href = `/builder/${created.id}`;
    } catch (err) {
      alert("Failed to create form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.duplicateForm(id);
      fetchForms();
    } catch (err) {
      alert("Failed to duplicate form");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteForm(id);
      setForms((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert("Failed to delete form");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await api.togglePublish(id);
      setForms((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: updated.status } : f))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/share/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredForms = forms.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || f.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0e0e11] text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-[#141418]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black font-black text-sm">
                //
              </div>
              <span className="font-semibold text-lg text-white">typeform</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-sm font-medium text-zinc-300">My Workspace</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-md shadow-white/5"
            >
              <Plus className="w-4 h-4" />
              Create form
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Title and Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Forms
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage your forms, inspect submission results, and share live links.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search forms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 sm:w-64 rounded-xl bg-zinc-900 border border-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-white/5 text-xs">
              {(["all", "published", "draft"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    filter === mode
                      ? "bg-zinc-800 text-white font-medium shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        {loading ? (
          <div className="py-20 text-center text-zinc-500 text-sm">
            Loading your forms...
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center space-y-4 bg-zinc-900/30">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium text-white">No forms found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {search
                ? `No forms match your search query "${search}"`
                : "Get started by creating your very first conversational Typeform."}
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create your first form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="group relative rounded-2xl p-6 bg-[#16161b] border border-white/5 hover:border-purple-500/30 hover:bg-[#1a1a21] transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Top line: Status Badge & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <button
                      onClick={() => handleTogglePublish(form.id)}
                      title="Click to toggle status"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                        form.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          form.status === "published" ? "bg-emerald-400" : "bg-zinc-500"
                        }`}
                      />
                      {form.status === "published" ? "Published" : "Draft"}
                    </button>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDuplicate(form.id)}
                        title="Duplicate form"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(form.id, form.title)}
                        title="Delete form"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Form Title */}
                  <Link href={`/builder/${form.id}`} className="block group-hover:text-purple-300">
                    <h3 className="text-lg font-semibold text-white tracking-tight mb-2 line-clamp-1">
                      {form.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px] mb-6">
                    {form.description || "No description provided."}
                  </p>
                </div>

                {/* Footer Metrics & Navigation */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                  {/* Counts */}
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{form.question_count} questions</span>
                    <span>{form.response_count} responses</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href={`/builder/${form.id}`}
                      className="text-center py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/forms/${form.id}/results`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                      Results
                    </Link>
                    {form.status === "published" ? (
                      <button
                        onClick={() => handleCopyLink(form.share_slug, form.id)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs font-medium transition-colors"
                      >
                        {copiedId === form.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            Share
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="py-2 px-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-600 text-xs font-medium cursor-not-allowed"
                      >
                        Draft
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Create Form */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-[#16161b] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Create a new form</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Give your form a name to start adding questions.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Form Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Customer Satisfaction Survey"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Description (Optional)</label>
                <textarea
                  placeholder="What is this form about?"
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create and open"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
