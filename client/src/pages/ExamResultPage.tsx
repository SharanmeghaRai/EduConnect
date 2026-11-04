import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  MessageSquare,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Attempt } from '../types/index.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import { WhatsAppShareButton, WhatsAppIcon } from '../components/ui/WhatsAppButton.js';
import {
  formatExamResultShareText,
  APTITUDE_SIR_PHONE,
  APTITUDE_SIR_FORMATTED_PHONE,
} from '../utils/whatsapp.js';

export const ExamResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // attemptId
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [topicBreakdown, setTopicBreakdown] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // AI Question Explanation modal
  const [explainingQuestion, setExplainingQuestion] = useState<{
    prompt: string;
    explanation: string;
  } | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await api.exams.getReview(id!);
        setAttempt(res.attempt);
        setTopicBreakdown(res.topicBreakdown || {});

        // Fire confetti celebration if score >= passingMarks
        if (res.attempt.score >= res.attempt.exam.passingMarks) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error('Failed to load attempt review:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  const handleAskAI = async (questionId: string, promptText: string) => {
    setExplainLoading(true);
    try {
      const res = await api.chat.explainQuestion(questionId);
      setExplainingQuestion({
        prompt: promptText,
        explanation: res.explanation,
      });
    } catch {
      alert('AI mentor is temporarily unavailable.');
    } finally {
      setExplainLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto my-12">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Attempt review not found.</p>
        <Link to="/exams" className="mt-4 inline-block">
          <Button size="sm">Back to Exams</Button>
        </Link>
      </Card>
    );
  }

  const isPassed = attempt.score >= attempt.exam.passingMarks;
  const timeMinutes = Math.floor(attempt.timeSpentSeconds / 60);
  const timeSecs = attempt.timeSpentSeconds % 60;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-6">
      {/* Celebration Score Banner */}
      <div
        className={`p-6 sm:p-8 rounded-lg text-white shadow-soft-xl flex flex-col md:flex-row items-center justify-between gap-6 ${
          isPassed
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600'
            : 'bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950'
        }`}
      >
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
            {isPassed ? <Trophy className="w-3.5 h-3.5 text-amber-300" /> : <Award className="w-3.5 h-3.5 text-slate-300" />}
            <span>{isPassed ? 'Test Cleared • Cutoff Achieved' : 'Attempt Completed • Needs Practice'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            {attempt.exam.title}
          </h1>
          <p className="text-xs text-white/80 max-w-lg">
            Reviewed with negative marking (-{attempt.exam.negativeMarkingRatio} per error). Explanations and AI coaching available below.
          </p>
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <WhatsAppShareButton
              shareOptions={{
                phone: APTITUDE_SIR_PHONE,
                text: formatExamResultShareText({
                  examTitle: attempt.exam.title,
                  score: attempt.score,
                  maxScore: attempt.maxScore,
                  accuracyPercentage: attempt.accuracyPercentage,
                  peerPercentile: attempt.peerPercentile,
                  isPassed,
                }),
              }}
              variant="solid"
              size="sm"
              label="Ask Doubts to Aptitude Sir"
              title={`Discuss test doubts with Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold shadow-md shadow-emerald-950/20"
            />
          </div>
        </div>

        {/* Score & Percentile Pill */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-lg border border-white/20 shrink-0 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-display font-black">
              {attempt.score}
              <span className="text-lg font-normal text-white/70">/{attempt.maxScore}</span>
            </p>
            <p className="text-[11px] text-white/80 uppercase tracking-wider font-bold">Final Score</p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-3xl sm:text-4xl font-display font-black text-amber-300">
              {attempt.peerPercentile}%
            </p>
            <p className="text-[11px] text-white/80 uppercase tracking-wider font-bold">Peer Percentile</p>
          </div>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Accuracy</span>
          <p className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {attempt.accuracyPercentage}%
          </p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Time Taken</span>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-0.5">
            {timeMinutes}m {timeSecs}s
          </p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Passing Threshold</span>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-0.5">
            {attempt.exam.passingMarks} Marks
          </p>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Result Status</span>
          <p
            className={`text-2xl font-display font-bold mt-0.5 ${
              isPassed ? 'text-emerald-500' : 'text-amber-500'
            }`}
          >
            {isPassed ? 'PASSED' : 'RETAKE'}
          </p>
        </Card>
      </div>

      {/* Topic-Wise Breakdown */}
      {Object.keys(topicBreakdown).length > 0 && (
        <Card className="p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Topic & Concept Mastery Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(topicBreakdown).map(([topic, data]: [string, any]) => {
              const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div
                  key={topic}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{topic}</span>
                    <span className="font-semibold text-slate-500">{accuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        accuracy >= 75 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {data.correct} correct of {data.total} questions
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Detailed Question-by-Question Review with Explanations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Detailed Solution Review ({attempt.exam.questions?.length || 0} Questions)
          </h3>
          <span className="text-xs text-slate-400">Green = Correct • Red = Incorrect</span>
        </div>

        <div className="space-y-4">
          {attempt.exam.questions?.map((q, idx) => {
            const ans = attempt.answers?.find((a) => a.questionId === q.id);
            const isCorrect = ans?.isCorrect;
            const isAttempted = !!ans?.selectedOptionId;

            return (
              <Card
                key={q.id}
                className={`p-5 sm:p-6 border-l-4 ${
                  isCorrect
                    ? 'border-l-emerald-500'
                    : isAttempted
                    ? 'border-l-rose-500'
                    : 'border-l-slate-300 dark:border-l-slate-700'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    {q.topicTag && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {q.topicTag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +1.0 Marks
                      </span>
                    ) : isAttempted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500">
                        <XCircle className="w-3.5 h-3.5" /> -{attempt.exam.negativeMarkingRatio} Penalty
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold">Unattempted (0.0)</span>
                    )}

                    {/* Ask AI to explain button */}
                    <button
                      onClick={() => handleAskAI(q.id, q.prompt)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3 text-indigo-500" />
                      <span>Detailed Derivation</span>
                    </button>
                  </div>
                </div>

                {/* Prompt */}
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed mb-4">
                  {q.prompt}
                </p>

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
                  {q.options.map((opt) => {
                    const isSelected = ans?.selectedOptionId === opt.id;
                    const isActualCorrect = opt.isCorrect;

                    let optStyle = 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400';
                    if (isActualCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isActualCorrect) {
                      optStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px]">
                            {opt.label}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isActualCorrect && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                            Correct
                          </span>
                        )}
                        {isSelected && !isActualCorrect && (
                          <span className="text-[10px] text-rose-500 font-bold uppercase">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mathematical / Conceptual Explanation */}
                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
                      Step-by-Step Derivation & Explanation:
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Link to="/exams">
          <Button variant="outline" size="sm">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Back to Exam Catalog
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <WhatsAppShareButton
            shareOptions={{
              phone: APTITUDE_SIR_PHONE,
              text: formatExamResultShareText({
                examTitle: attempt.exam.title,
                score: attempt.score,
                maxScore: attempt.maxScore,
                accuracyPercentage: attempt.accuracyPercentage,
                peerPercentile: attempt.peerPercentile,
                isPassed,
              }),
            }}
            variant="outline"
            size="sm"
            label="Ask Aptitude Sir"
            title={`Discuss score & questions with Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
            className="text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/10 font-bold"
          />
          <Link to="/dashboard">
            <Button size="sm">
              Go to Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Explanation Popover Dialog */}
      <Modal
        isOpen={!!explainingQuestion}
        onClose={() => setExplainingQuestion(null)}
        title={
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
            <MessageSquare className="w-4 h-4" />
            <span>CampusPrep Question Derivation</span>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
            <strong>Question:</strong> {explainingQuestion?.prompt}
          </div>

          <div className="whitespace-pre-wrap leading-relaxed font-sans text-slate-800 dark:text-slate-100">
            {explainingQuestion?.explanation}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button size="sm" onClick={() => setExplainingQuestion(null)}>
              Got It
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
