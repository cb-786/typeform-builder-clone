"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Form, FormAnalyticsResponse, SingleResponseDetail } from "@/lib/types";
import {
  ArrowLeft,
  Download,
  BarChart3,
  Table,
  Users,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Calendar,
  X
} from "lucide-react";

function ResultsContent() {
  const routeParams = useParams();
  const formId = routeParams?.formId as string;

  const [form, setForm] = useState<Form | null>(null);
  const [analytics, setAnalytics] = useState<FormAnalyticsResponse | null>(null);
  const [responses, setResponses] = useState<SingleResponseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "table">("analytics");
  const [selectedResponse, setSelectedResponse] = useState<SingleResponseDetail | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [formData, analyticsData, responsesData] = await Promise.all([
          api.getForm(formId),
          api.getAnalytics(formId),
          api.getResponses(formId)
        ]);
        setForm(formData);
        setAnalytics(analyticsData);
        setResponses(responsesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [formId]);

  if (loading || !form || !analytics) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-zinc-400 text-sm">
        Loading analytics...
      </div>
    );
  }

  const csvUrl = api.getExportCsvUrl(formId);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-white/5 bg-[#141418] px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            href={`/builder/${form.id}`}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-white">{form.title}</h1>
              <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                Results
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              activeTab === "analytics"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              activeTab === "table"
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Responses ({responses.length})
          </button>
        </div>

        {/* Export to CSV Button */}
        <div>
          <a
            href={csvUrl}
            download
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#16161b] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Total Submissions</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              {analytics.total_responses}
            </div>
            <div className="text-[11px] text-zinc-500">
              Across all recorded sessions
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#16161b] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Form Questions</span>
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              {form.questions.length}
            </div>
            <div className="text-[11px] text-zinc-500">
              Active form fields
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#16161b] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Status</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold capitalize text-white">
              {form.status}
            </div>
            <div className="text-[11px] text-zinc-500">
              {form.status === "published" ? "Accepting live responses" : "Draft mode"}
            </div>
          </div>
        </div>

        {/* ================= TAB 1: SUMMARY ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Question Summary & Metrics
            </h2>

            {analytics.question_stats.map((stat, i) => {
              const totalForQ = stat.total_answers;

              return (
                <div
                  key={stat.question_id}
                  className="rounded-2xl p-6 bg-[#16161b] border border-white/5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-purple-400 font-bold mb-1">
                        Question {i + 1} • {stat.question_type.replace("_", " ")}
                      </div>
                      <h3 className="text-base font-semibold text-white">
                        {stat.title}
                      </h3>
                    </div>
                    <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5 shrink-0">
                      {stat.total_answers} answers
                    </span>
                  </div>

                  {/* Multiple Choice & Dropdown & Yes/No Breakdown */}
                  {stat.summary_data.distribution && (
                    <div className="space-y-2.5 pt-2">
                      {Object.entries(stat.summary_data.distribution).map(([choice, count]) => {
                        const pct = totalForQ > 0 ? Math.round((count / totalForQ) * 100) : 0;
                        return (
                          <div key={choice} className="space-y-1">
                            <div className="flex justify-between text-xs text-zinc-300">
                              <span>{choice}</span>
                              <span className="font-mono text-zinc-400">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Rating / Number Average Gauge */}
                  {stat.summary_data.average !== undefined && (
                    <div className="flex items-center gap-8 pt-2">
                      <div>
                        <div className="text-2xl font-bold text-white font-mono">
                          {stat.summary_data.average !== null ? stat.summary_data.average : "—"}
                        </div>
                        <div className="text-[11px] text-zinc-500">Average score</div>
                      </div>
                      {stat.summary_data.min !== undefined && (
                        <div>
                          <div className="text-2xl font-bold text-zinc-300 font-mono">
                            {stat.summary_data.min}
                          </div>
                          <div className="text-[11px] text-zinc-500">Min score</div>
                        </div>
                      )}
                      {stat.summary_data.max !== undefined && (
                        <div>
                          <div className="text-2xl font-bold text-zinc-300 font-mono">
                            {stat.summary_data.max}
                          </div>
                          <div className="text-[11px] text-zinc-500">Max score</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text / Email Samples */}
                  {stat.summary_data.latest_samples && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs text-zinc-500 font-medium">Recent submissions:</div>
                      <div className="space-y-1.5">
                        {stat.summary_data.latest_samples.length > 0 ? (
                          stat.summary_data.latest_samples.map((sample, sIdx) => (
                            <div
                              key={sIdx}
                              className="text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 italic"
                            >
                              &quot;{sample}&quot;
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-zinc-600">No text submissions yet.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ================= TAB 2: RESPONSES TABLE ================= */}
        {activeTab === "table" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              All Submissions ({responses.length})
            </h2>

            {responses.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#16161b] border border-white/5 text-center text-zinc-500 text-sm">
                No submissions recorded for this form yet.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/5 bg-[#16161b] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#121216] border-b border-white/5 text-zinc-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Submission ID</th>
                        <th className="py-3.5 px-4">Submitted At (UTC)</th>
                        <th className="py-3.5 px-4">Answer Summary</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {responses.map((resp) => {
                        const answerSnippet = resp.answers
                          .slice(0, 3)
                          .map((a) => a.answer_text)
                          .filter(Boolean)
                          .join(", ");

                        return (
                          <tr
                            key={resp.id}
                            className="hover:bg-zinc-800/40 transition-colors"
                          >
                            <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                              {resp.id.slice(0, 8)}...
                            </td>
                            <td className="py-3 px-4 text-zinc-400">
                              {new Date(resp.submitted_at).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 max-w-md truncate">
                              {answerSnippet || "No answers"}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedResponse(resp)}
                                className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
                              >
                                View Details
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= MODAL: INDIVIDUAL RESPONSE DETAILS ================= */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl max-h-[85vh] rounded-3xl bg-[#16161b] border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div>
                <h3 className="text-lg font-semibold text-white">Submission Details</h3>
                <div className="text-xs text-zinc-500 font-mono mt-0.5">
                  ID: {selectedResponse.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="text-xs text-zinc-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Submitted on {new Date(selectedResponse.submitted_at).toUTCString()}
              </div>

              {selectedResponse.answers.map((ans, idx) => (
                <div
                  key={ans.id}
                  className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-1.5"
                >
                  <div className="text-[11px] font-mono text-purple-400">
                    Question {idx + 1}
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {ans.question_title}
                  </div>
                  <div className="text-sm text-zinc-200 font-medium pt-1">
                    {ans.answer_text || ans.answer_json || (
                      <span className="text-zinc-600 italic">No answer provided</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
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

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-zinc-400 text-sm">Loading analytics...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
