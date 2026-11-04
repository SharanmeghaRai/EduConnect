/**
 * WhatsApp Share & Mentor Doubt Support Utility for EduConnect Campus Placement Portal
 * Connected Directly to Aptitude Sir (+91 79896 75792) for Student Inquiries and Doubts
 */

export const APTITUDE_SIR_PHONE = '917989675792';
export const APTITUDE_SIR_FORMATTED_PHONE = '+91 79896 75792';

export interface WhatsAppShareOptions {
  text?: string;
  url?: string;
  phone?: string | null;
}

/**
 * Builds the WhatsApp direct chat or share URL.
 * Defaults to Aptitude Sir's direct contact (+91 79896 75792) when phone is not specified,
 * allowing students to directly connect and ask doubts.
 */
export const createWhatsAppUrl = ({ text = '', url, phone }: WhatsAppShareOptions): string => {
  // If phone is not provided, default to Aptitude Sir's number (+91 79896 75792)
  const targetPhone = phone !== undefined ? phone : APTITUDE_SIR_PHONE;
  const fullMessage = url ? `${text}\n\n🔗 ${url}` : text;
  const encoded = encodeURIComponent(fullMessage.trim());

  if (targetPhone) {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ''}`;
    }
  }

  return `https://api.whatsapp.com/send?text=${encoded}`;
};

export const shareToWhatsApp = (options: WhatsAppShareOptions): void => {
  const targetUrl = createWhatsAppUrl(options);
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Directly opens WhatsApp chat with Aptitude Sir (+91 79896 75792) to chat or clarify doubts.
 */
export const openAptitudeSirChat = (doubtText?: string, contextUrl?: string): void => {
  const defaultText =
    doubtText ||
    'Hello Aptitude Sir! 👋\nI am a student preparing on the EduConnect Campus Placement Portal. I have a doubt regarding aptitude preparation and would like to ask you for guidance.';

  shareToWhatsApp({
    phone: APTITUDE_SIR_PHONE,
    text: defaultText,
    url: contextUrl,
  });
};

/**
 * Preformatted message generators for different placement entities & doubts
 */
export const formatAptitudeDoubtText = (topicOrPrompt?: string, answer?: string): string => {
  const truncatedAnswer =
    answer && answer.length > 400 ? answer.substring(0, 397) + '...' : answer;

  return [
    `Hello Aptitude Sir! 👋`,
    `I am practicing on EduConnect Campus Placement Portal and have a doubt regarding this aptitude problem / concept:`,
    topicOrPrompt ? `\n❓ *Question / Problem Statement:*\n${topicOrPrompt}` : '',
    truncatedAnswer ? `\n💡 *Context / Solution Notes:*\n${truncatedAnswer}` : '',
    ``,
    `Could you please explain this doubt to me? Thank you! 🙏`,
    `🔗 ${window.location.origin}`,
  ]
    .filter(Boolean)
    .join('\n');
};

export const formatJobShareText = (job: {
  companyName: string;
  roleTitle: string;
  jobType: string;
  location: string;
  salaryRange?: string;
  deadline?: string;
  applyUrl?: string;
}): string => {
  return [
    `📢 *Campus Placement Verified Job Alert!*`,
    `🏢 *Company:* ${job.companyName}`,
    `💼 *Role:* ${job.roleTitle} (${job.jobType.replace('_', ' ')})`,
    `📍 *Location:* ${job.location}`,
    job.salaryRange ? `💰 *CTC / Package:* ${job.salaryRange}` : '',
    job.deadline ? `⏳ *Deadline:* ${new Date(job.deadline).toLocaleDateString()}` : '',
    `✅ *Status:* Verified Placement Drive`,
    ``,
    `🔗 *Official Apply Link:* ${job.applyUrl || window.location.href}`,
    `Shared via *EduConnect Campus Placement Portal*`,
  ]
    .filter(Boolean)
    .join('\n');
};

export const formatExamResultShareText = (result: {
  examTitle: string;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  peerPercentile: number;
  isPassed: boolean;
}): string => {
  return [
    `Hello Aptitude Sir! 👋`,
    `I completed a placement mock test on EduConnect and would like guidance on my performance & doubts:`,
    `📝 *Exam:* ${result.examTitle}`,
    `🏆 *Score:* ${result.score} / ${result.maxScore} (${result.accuracyPercentage}% Accuracy)`,
    `📊 *Peer Percentile:* ${result.peerPercentile}%`,
    `⚡ *Result Status:* ${result.isPassed ? '✅ PASSED (Cutoff Cleared)' : '🔄 Needs Practice'}`,
    ``,
    `Could you please guide me on how to improve my weak areas? Thank you!`,
    `🔗 ${window.location.origin}/exams`,
  ].join('\n');
};

export const formatExamShareText = (exam: {
  title: string;
  durationMinutes: number;
  questionsCount?: number;
  category: string;
  difficulty: string;
  id: string;
}): string => {
  return [
    `Hello Aptitude Sir! 👋`,
    `I am practicing aptitude questions on EduConnect for *${exam.title}* (${exam.category} • ${exam.difficulty}) and have a doubt.`,
    `⏱ *Duration:* ${exam.durationMinutes} Minutes | ${exam.questionsCount ?? 15} MCQs`,
    ``,
    `🔗 *Test Link:* ${window.location.origin}/exams/${exam.id}`,
    `Could you please help me understand this topic / question? Thank you! 🙏`,
  ].join('\n');
};

export const formatStudyMaterialShareText = (material: {
  title: string;
  category: string;
  resourceType?: string;
  url?: string;
}): string => {
  return [
    `Hello Aptitude Sir! 👋`,
    `I am studying the past aptitude paper *${material.title}* (${material.category}) on EduConnect and have a question/doubt.`,
    ``,
    `🔗 *Material Link:* ${material.url || window.location.origin + '/materials'}`,
    `Could you please help me clarify this concept? Thank you! 🙏`,
  ].join('\n');
};

export const formatNewsletterShareText = (newsletter: {
  title: string;
  editionNumber: number;
  readingTimeMin?: number;
}): string => {
  return [
    `📰 *Campus Placement Digest - Edition #${newsletter.editionNumber}*`,
    `✨ *Topic:* ${newsletter.title}`,
    newsletter.readingTimeMin ? `⏱ ${newsletter.readingTimeMin} min read` : '',
    ``,
    `Read the full strategy guide and hiring updates:`,
    `🔗 ${window.location.href}`,
    `Shared via *EduConnect Portal*`,
  ]
    .filter(Boolean)
    .join('\n');
};

export const formatAiChatShareText = (topicOrPrompt: string, answer: string): string => {
  return formatAptitudeDoubtText(topicOrPrompt, answer);
};
