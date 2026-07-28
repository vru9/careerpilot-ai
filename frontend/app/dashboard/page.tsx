"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  FileText,
  Gauge,
  Globe2,
  LoaderCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

type ResumeReport = {
  filename?: string;
  ats_score?: number;
  ats_strengths?: string[];
  ats_missing_skills?: string[];
  strengths?: string[];
  weaknesses?: string[];
  summary?: string;
  filtered_jobs?: number;
  missing_keywords?: string[];
  skills_detected?: string[];
  best_matching_roles?: string[];
  skills?: string[];
  recommendations?: string[];
};

type Job = {
  title?: string;
  company?: string;
  location?: string;
  source?: string;
  employment_type?: string;
  posted_date?: string;
  salary?: string;
  currency?: string;
  match_score?: number;
  why_match?: string;
  description?: string;
  strengths?: string[];
  matched_skills?: string[];
  missing_skills?: string[];
  learning_priority?: string[];
  interview_readiness?: string;
  apply_url?: string;
};

type CareerPilotData = {
  resume?: ResumeReport;
  jobs?: Job[];
};

type Accent = "teal" | "emerald" | "amber" | "rose" | "indigo";
type SortOption = "match" | "company" | "location";

const accentStyles: Record<
  Accent,
  {
    icon: string;
    badge: string;
    bar: string;
    border: string;
    surface: string;
    text: string;
    soft: string;
  }
> = {
  teal: {
    icon: "bg-teal-400/10 text-teal-200 ring-1 ring-teal-300/20",
    badge: "bg-teal-400/10 text-teal-100 ring-teal-300/25",
    bar: "bg-teal-300",
    border: "border-teal-300/25",
    surface: "bg-[linear-gradient(135deg,rgba(45,212,191,0.16),rgba(15,23,42,0.78)_45%,rgba(15,23,42,0.92))]",
    text: "text-teal-200",
    soft: "bg-teal-400/10",
  },
  emerald: {
    icon: "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-300/20",
    badge: "bg-emerald-400/10 text-emerald-100 ring-emerald-300/25",
    bar: "bg-emerald-300",
    border: "border-emerald-300/25",
    surface: "bg-[linear-gradient(135deg,rgba(52,211,153,0.16),rgba(15,23,42,0.78)_45%,rgba(15,23,42,0.92))]",
    text: "text-emerald-200",
    soft: "bg-emerald-400/10",
  },
  amber: {
    icon: "bg-amber-300/10 text-amber-200 ring-1 ring-amber-200/20",
    badge: "bg-amber-300/10 text-amber-100 ring-amber-200/25",
    bar: "bg-amber-300",
    border: "border-amber-200/25",
    surface: "bg-[linear-gradient(135deg,rgba(251,191,36,0.16),rgba(15,23,42,0.78)_45%,rgba(15,23,42,0.92))]",
    text: "text-amber-200",
    soft: "bg-amber-300/10",
  },
  rose: {
    icon: "bg-rose-400/10 text-rose-200 ring-1 ring-rose-300/20",
    badge: "bg-rose-400/10 text-rose-100 ring-rose-300/25",
    bar: "bg-rose-300",
    border: "border-rose-300/25",
    surface: "bg-[linear-gradient(135deg,rgba(251,113,133,0.16),rgba(15,23,42,0.78)_45%,rgba(15,23,42,0.92))]",
    text: "text-rose-200",
    soft: "bg-rose-400/10",
  },
  indigo: {
    icon: "bg-indigo-400/10 text-indigo-200 ring-1 ring-indigo-300/20",
    badge: "bg-indigo-400/10 text-indigo-100 ring-indigo-300/25",
    bar: "bg-indigo-300",
    border: "border-indigo-300/25",
    surface: "bg-[linear-gradient(135deg,rgba(129,140,248,0.16),rgba(15,23,42,0.78)_45%,rgba(15,23,42,0.92))]",
    text: "text-indigo-200",
    soft: "bg-indigo-400/10",
  },
};

function clampScore(score?: number) {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very strong";
  if (score >= 70) return "Good";
  return "Needs work";
}

function scoreColor(score: number) {
  if (score >= 90) return "#34d399";
  if (score >= 70) return "#fbbf24";
  return "#fb7185";
}

function scoreTone(score: number) {
  if (score >= 90) {
    return {
      badge: "bg-emerald-400/10 text-emerald-100 ring-emerald-300/25",
      text: "text-emerald-200",
      soft: "bg-emerald-400/10",
    };
  }

  if (score >= 70) {
    return {
      badge: "bg-amber-300/10 text-amber-100 ring-amber-200/25",
      text: "text-amber-200",
      soft: "bg-amber-300/10",
    };
  }

  return {
    badge: "bg-rose-400/10 text-rose-100 ring-rose-300/25",
    text: "text-rose-200",
    soft: "bg-rose-400/10",
  };
}

const AI_SUMMARY_FALLBACK =
  "Your resume scan is ready. Review the strongest signals, close the highest-priority gaps, and focus on the roles with the best match score first.";

const RAW_ERROR_PATTERNS = [
  "429",
  "ai analysis failed",
  "exception",
  "google.rpc",
  "googleapis.com",
  "quota",
  "quotaexceeded",
  "resource_exhausted",
  "retryinfo",
  "traceback",
];

type DescriptionBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

type DescriptionContent = {
  blocks: DescriptionBlock[];
  isLong: boolean;
  preview: string;
};

function decodeHtmlOnce(value: string) {
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }

  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function decodeHtmlDeep(value: string) {
  let decoded = String(value ?? "");

  for (let index = 0; index < 5; index += 1) {
    const next = decodeHtmlOnce(decoded);

    if (next === decoded) break;
    decoded = next;
  }

  return decoded.replace(/\\n/g, "\n");
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripHtmlToText(value: string) {
  return normalizeWhitespace(
    decodeHtmlDeep(value)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(h[1-6]|p|li|ul|ol|div|section)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<[^>]+>/g, " ")
  );
}

function isRawSystemError(value?: string) {
  if (!value) return false;

  const normalized = value.toLowerCase();
  return RAW_ERROR_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function isUnavailableSummary(value?: string) {
  if (!value) return true;

  const normalized = value.toLowerCase();

  return (
    isRawSystemError(value) ||
    normalized.includes("temporarily unavailable") ||
    normalized.includes("ai resume narrative is unavailable") ||
    normalized.includes("ai summary is unavailable")
  );
}

function cleanText(value: unknown) {
  if (typeof value !== "string") return "";
  if (isRawSystemError(value)) return "";

  return stripHtmlToText(value);
}

function cleanList(value: unknown) {
  const rawItems = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];

  return rawItems
    .map((item) => cleanText(item))
    .filter((item) => item.length > 0);
}

function uniqueList(...lists: string[][]) {
  const seen = new Set<string>();
  const values: string[] = [];

  for (const list of lists) {
    for (const item of list) {
      const key = item.toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        values.push(item);
      }
    }
  }

  return values;
}

function prefixItems(items: string[], prefix: string) {
  return items.map((item) => `${prefix}: ${item}`);
}

function truncateAtWord(value: string, maxLength = 560) {
  if (value.length <= maxLength) return value;

  const truncated = value.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpace > 120 ? lastSpace : maxLength).trim()}...`;
}

function fallbackBlocksFromText(value: string): DescriptionBlock[] {
  const text = stripHtmlToText(value);

  if (!text) return [];

  return text
    .split(/\n{2,}/)
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean)
    .map((textItem) => ({ type: "paragraph", text: textItem }));
}

function descriptionBlocksFromHtml(value: string): DescriptionBlock[] {
  const decoded = decodeHtmlDeep(value);

  if (typeof DOMParser === "undefined") {
    return fallbackBlocksFromText(decoded);
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(decoded, "text/html");
  const blocks: DescriptionBlock[] = [];

  documentNode.querySelectorAll("script, style, noscript").forEach((element) => {
    element.remove();
  });

  const pushText = (type: "heading" | "paragraph", text: string) => {
    const cleaned = normalizeWhitespace(text);

    if (cleaned) {
      blocks.push({ type, text: cleaned });
    }
  };

  const walk = (element: Element) => {
    Array.from(element.children).forEach((child) => {
      const tag = child.tagName.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        pushText("heading", child.textContent ?? "");
        return;
      }

      if (tag === "p") {
        pushText("paragraph", child.textContent ?? "");
        return;
      }

      if (tag === "ul" || tag === "ol") {
        const items = Array.from(child.children)
          .filter((listItem) => listItem.tagName.toLowerCase() === "li")
          .map((listItem) => normalizeWhitespace(listItem.textContent ?? ""))
          .filter(Boolean);

        if (items.length > 0) {
          blocks.push({ type: "list", items });
        }

        return;
      }

      walk(child);
    });
  };

  walk(documentNode.body);

  if (blocks.length === 0) {
    return fallbackBlocksFromText(decoded);
  }

  return blocks;
}

function buildDescriptionContent(value?: string): DescriptionContent | null {
  if (!value) return null;

  const blocks = descriptionBlocksFromHtml(value);
  const plain = blocks
    .map((block) => {
      if (block.type === "list") return block.items.join(" ");
      return block.text;
    })
    .join(" ");

  if (!plain.trim()) return null;

  return {
    blocks,
    isLong: plain.length > 560 || blocks.length > 4,
    preview: truncateAtWord(plain),
  };
}

function matchReasonText(job: Job) {
  const reason = cleanText(job.why_match);

  if (!reason || reason.toLowerCase().includes("ai ranking unavailable")) {
    return "This role was matched using resume skills and available job details.";
  }

  return reason;
}

function deriveRolesFromSkills(skills: string[]) {
  const lowerSkills = skills.join(" ").toLowerCase();
  const roles: string[] = [];

  if (/(react|next\.js|javascript|typescript|tailwind|frontend)/.test(lowerSkills)) {
    roles.push("Frontend Developer", "Full Stack Developer");
  }

  if (/(node|fastapi|python|sql|postgres|backend|api)/.test(lowerSkills)) {
    roles.push("Backend Developer", "Software Engineer");
  }

  if (/(machine learning|xgboost|chroma|ai|ml|model)/.test(lowerSkills)) {
    roles.push("AI/ML Engineer Intern");
  }

  if (/(aws|docker|linux|cloud|devops)/.test(lowerSkills)) {
    roles.push("Cloud Application Developer");
  }

  return uniqueList(roles, ["Software Engineer Intern", "Junior Software Engineer"]).slice(0, 4);
}

function deriveRecommendations(gaps: string[]) {
  const topGaps = gaps
    .slice(0, 4)
    .map((gap) => gap.replace(/^(Missing keyword|ATS keyword gap):\s*/i, ""))
    .filter(Boolean);

  const recommendations = [
    "Move your strongest technical projects and measurable outcomes into the top half of the resume.",
    "Tailor one resume version per target role so the skills and project bullets match the job family.",
  ];

  if (topGaps.length > 0) {
    recommendations.unshift(
      `Add missing ATS keywords naturally where they are truthful: ${topGaps.join(", ")}.`
    );
  }

  return recommendations;
}

function stripInsightPrefix(value: string) {
  return value.replace(/^(Missing keyword|ATS keyword gap):\s*/i, "").trim();
}

function buildScanSummary({
  atsScore,
  strengths,
  weaknesses,
  skills,
  jobsCount,
}: {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  jobsCount: number;
}) {
  const topSkills = skills.slice(0, 4);
  const topStrengths = strengths.slice(0, 2);
  const topGaps = weaknesses.map(stripInsightPrefix).filter(Boolean).slice(0, 3);
  const summaryParts = [
    `Your resume is showing a ${scoreLabel(atsScore).toLowerCase()} ATS profile at ${atsScore}/100.`,
  ];

  if (topSkills.length > 0) {
    summaryParts.push(`The strongest visible skill signals are ${topSkills.join(", ")}.`);
  }

  if (topStrengths.length > 0) {
    summaryParts.push(`Highlights include ${topStrengths.join(" and ")}.`);
  }

  if (topGaps.length > 0) {
    summaryParts.push(`For the next pass, prioritize ${topGaps.join(", ")} so the resume matches more job descriptions.`);
  }

  if (jobsCount > 0) {
    summaryParts.push(`${jobsCount} matched role${jobsCount === 1 ? "" : "s"} are ready to compare below.`);
  }

  return summaryParts.join(" ") || AI_SUMMARY_FALLBACK;
}

function readStoredReport() {
  const stored = localStorage.getItem("careerpilot_result");

  if (!stored) return null;

  try {
    return JSON.parse(stored) as CareerPilotData;
  } catch {
    return null;
  }
}

function formatDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function includesQuery(value: unknown, query: string) {
  return String(value ?? "").toLowerCase().includes(query);
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-white/10 bg-slate-900/80 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur ${className}`}>
      {children}
    </section>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  detail,
  description,
  progress,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  detail: string;
  description: string;
  progress?: number;
  accent: Accent;
}) {
  const styles = accentStyles[accent];
  const progressValue =
    typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : undefined;

  return (
    <Panel className={`relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_22px_54px_rgba(0,0,0,0.36)] ${styles.border} ${styles.surface}`}>
      <div className={`absolute inset-y-0 left-0 w-1.5 ${styles.bar}`} />

      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
          <Icon size={20} aria-hidden="true" />
        </div>

        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles.badge}`}>
          {detail}
        </span>
      </div>

      <p className="mt-5 text-sm font-bold text-slate-400">{label}</p>
      <p className="mt-1 truncate text-3xl font-black text-white">
        {value}
      </p>
      <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">
        {description}
      </p>

      {typeof progressValue === "number" && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/10">
          <div
            className={`h-full rounded-full ${styles.bar}`}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      )}
    </Panel>
  );
}

function splitInsight(item: string) {
  const [prefix, ...rest] = item.split(":");

  if (rest.length === 0) {
    return {
      label: item,
      meta: "",
    };
  }

  return {
    label: rest.join(":").trim(),
    meta: prefix.trim(),
  };
}

function InsightList({
  icon: Icon,
  title,
  items,
  emptyText,
  accent,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  items?: string[];
  emptyText: string;
  accent: Accent;
  subtitle: string;
}) {
  const styles = accentStyles[accent];
  const list = items ?? [];
  const isPositive = accent === "emerald" || accent === "teal";

  return (
    <Panel className={`overflow-hidden ${styles.border}`}>
      <div className={`flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6 ${styles.surface}`}>
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
            <Icon size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="mt-1 text-sm leading-5 text-slate-400">{subtitle}</p>
          </div>
        </div>

        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-black ring-1 ${styles.badge}`}>
          {list.length}
        </span>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
        {list.length > 0 ? (
          list.map((item, index) => {
            const insight = splitInsight(item);

            return (
              <div
                key={`${item}-${index}`}
                className="group flex min-h-20 items-start gap-3 rounded-lg border border-white/10 bg-slate-950/45 p-4 transition hover:border-white/20 hover:bg-slate-950/70"
              >
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${styles.icon}`}>
                  {isPositive ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <AlertTriangle size={16} aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0">
                  {insight.meta && (
                    <span className={`mb-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-black uppercase ${styles.badge} ring-1`}>
                      {insight.meta}
                    </span>
                  )}
                  <span className="block text-sm font-bold leading-6 text-slate-100">
                    {insight.label}
                  </span>
                </span>
              </div>
            );
          })
        ) : (
          <p className="rounded-lg border border-white/10 bg-slate-950/45 p-4 text-sm font-medium text-slate-400 sm:col-span-2">
            {emptyText}
          </p>
        )}
      </div>
    </Panel>
  );
}

function SkillPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "matched" | "missing";
}) {
  const classes = {
    neutral: "bg-white/[0.07] text-slate-200 ring-white/10",
    matched: "bg-emerald-400/10 text-emerald-100 ring-emerald-300/25",
    missing: "bg-rose-400/10 text-rose-100 ring-rose-300/25",
  };

  return (
    <span className={`max-w-full rounded-full px-3 py-1.5 text-xs font-bold ring-1 sm:text-sm ${classes[tone]}`}>
      {children}
    </span>
  );
}

function JobDescription({
  content,
  expanded,
}: {
  content: DescriptionContent;
  expanded: boolean;
}) {
  if (!expanded) {
    return (
      <p className="text-sm leading-6 text-slate-300">
        {content.preview}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {content.blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h5
              key={`${block.text}-${index}`}
              className="pt-1 text-sm font-black uppercase text-slate-100"
            >
              {block.text}
            </h5>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`list-${index}`}
              className="space-y-2 pl-1 text-sm leading-6 text-slate-300"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${block.text}-${index}`} className="text-sm leading-6 text-slate-300">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function JobCard({
  job,
  index,
  expanded,
  onToggle,
}: {
  job: Job;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const score = clampScore(job.match_score);
  const tone = scoreTone(score);
  const description = buildDescriptionContent(job.description);
  const reason = matchReasonText(job);
  const matchedSkills = uniqueList(
    cleanList(job.matched_skills),
    cleanList(job.strengths)
  );
  const missingSkills = cleanList(job.missing_skills);
  const learningPriority = cleanList(job.learning_priority);
  const postedDate = formatDate(job.posted_date);
  const circumference = 264;
  const metadata = [
    { icon: MapPin, text: job.location || "Remote" },
    { icon: Globe2, text: job.source },
    { icon: Building2, text: job.employment_type },
    { icon: CalendarDays, text: postedDate },
  ].filter((item): item is { icon: LucideIcon; text: string } => Boolean(item.text));

  return (
    <article className="rounded-lg border border-white/10 bg-slate-900/80 p-4 shadow-[0_16px_44px_rgba(0,0,0,0.24)] transition hover:border-teal-300/40 hover:bg-slate-900 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${tone.badge}`}>
              {scoreLabel(score)} fit
            </span>
            {job.interview_readiness && (
              <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs font-bold text-slate-200 ring-1 ring-white/10">
                {job.interview_readiness} readiness
              </span>
            )}
          </div>

          <h3 className="mt-3 text-xl font-black leading-tight text-white sm:text-2xl">
            {job.title || "Untitled role"}
          </h3>
          <p className="mt-1 text-sm font-semibold text-slate-400 sm:text-base">
            {job.company || "Company not listed"}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:gap-2">
          <div className="relative h-20 w-20 shrink-0">
            <svg className="-rotate-90" viewBox="0 0 96 96" aria-hidden="true">
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="rgba(148, 163, 184, 0.18)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke={scoreColor(score)}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (score / 100) * circumference}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-black ${tone.text}`}>{score}%</span>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400">Match score</p>
        </div>
      </div>

      {metadata.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-300">
          {metadata.map((item, metadataIndex) => {
            const Icon = item.icon;

            return (
              <span
                key={`${item.text}-${metadataIndex}`}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 font-medium ring-1 ring-white/10"
              >
                <Icon size={15} className="shrink-0 text-slate-400" aria-hidden="true" />
                <span className="truncate">{item.text}</span>
              </span>
            );
          })}
        </div>
      )}

      {job.salary && (
        <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-md bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-100 ring-1 ring-emerald-300/25">
          <DollarSign size={16} aria-hidden="true" />
          <span className="truncate">
            {job.currency ? `${job.currency} ` : ""}
            {job.salary}
          </span>
        </div>
      )}

      {reason && (
        <div className="mt-5 rounded-lg border border-teal-300/20 bg-teal-400/10 p-4">
          <div className="mb-2 flex items-center gap-2 font-bold text-teal-100">
            <Bot size={18} aria-hidden="true" />
            Why this job matches
          </div>
          <p className="text-sm leading-6 text-slate-300">{reason}</p>
        </div>
      )}

      {description && (
        <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/35 p-4">
          <div className="mb-2 flex items-center gap-2 font-bold text-white">
            <FileText size={18} aria-hidden="true" />
            About this role
          </div>
          <JobDescription content={description} expanded={expanded} />

          {description.isLong && (
            <button
              type="button"
              onClick={onToggle}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md px-0 py-1 text-sm font-bold text-teal-200 transition hover:text-teal-100"
            >
              {expanded ? "Show less" : "Read more"}
              {expanded ? (
                <ChevronUp size={16} aria-hidden="true" />
              ) : (
                <ChevronDown size={16} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-emerald-200">
            <CheckCircle2 size={17} aria-hidden="true" />
            Matched signals
          </h4>
          <div className="flex flex-wrap gap-2">
            {(matchedSkills.length ? matchedSkills : ["No matched signals listed"]).map(
              (skill) => (
                <SkillPill key={`matched-${index}-${skill}`} tone="matched">
                  {skill}
                </SkillPill>
              )
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-rose-200">
            <AlertTriangle size={17} aria-hidden="true" />
            Missing skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {(missingSkills.length ? missingSkills : ["No missing skills listed"]).map(
              (skill) => (
                <SkillPill key={`missing-${index}-${skill}`} tone="missing">
                  {skill}
                </SkillPill>
              )
            )}
          </div>
        </div>
      </div>

      {learningPriority.length > 0 ? (
        <div className="mt-5 rounded-lg bg-amber-300/10 p-4 ring-1 ring-amber-200/25">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-amber-100">
            <BookOpen size={17} aria-hidden="true" />
            Learning priority
          </h4>
          <ul className="space-y-2">
            {learningPriority.map((item, priorityIndex) => (
              <li
                key={`${item}-${priorityIndex}`}
                className="flex items-start gap-2 text-sm leading-6 text-amber-100/90"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 border-t border-white/10 pt-5">
        {job.apply_url ? (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-400 px-5 py-3 text-sm font-black text-slate-950 shadow-sm shadow-teal-950/30 transition hover:bg-teal-300 sm:w-auto"
          >
            Apply now
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-md bg-white/10 px-5 py-3 text-sm font-bold text-slate-500 sm:w-auto"
          >
            Apply link unavailable
          </button>
        )}
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<CareerPilotData | null>(null);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [expandedJobs, setExpandedJobs] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setData(readStoredReport());
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const resume = data?.resume ?? {};
  const jobs = useMemo(() => data?.jobs ?? [], [data?.jobs]);
  const atsScore = clampScore(resume.ats_score);
  const atsTone = scoreTone(atsScore);
  const strengths = uniqueList(
    cleanList(resume.strengths),
    cleanList(resume.ats_strengths)
  );
  const weaknesses = uniqueList(
    cleanList(resume.weaknesses),
    prefixItems(cleanList(resume.missing_keywords), "Missing keyword"),
    prefixItems(cleanList(resume.ats_missing_skills), "ATS keyword gap")
  );
  const skills = uniqueList(
    cleanList(resume.skills),
    cleanList(resume.skills_detected)
  );
  const summaryFromProvider = cleanText(resume.summary);
  const summaryIsFallback = isUnavailableSummary(resume.summary);
  const bestMatchingRoles = cleanList(resume.best_matching_roles);
  const displayedRoles =
    bestMatchingRoles.length > 0 ? bestMatchingRoles : deriveRolesFromSkills(skills);
  const recommendations = cleanList(resume.recommendations);
  const displayedRecommendations =
    recommendations.length > 0 ? recommendations : deriveRecommendations(weaknesses);
  const resumeFilename = cleanText(resume.filename) || "Uploaded resume";
  const scannedJobs = resume.filtered_jobs ?? jobs.length;
  const resumeSummary =
    !summaryIsFallback && summaryFromProvider
      ? summaryFromProvider
      : buildScanSummary({
          atsScore,
          strengths,
          weaknesses,
          skills,
          jobsCount: jobs.length,
        });

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...jobs]
      .filter((job) => {
        if (!query) return true;

        return (
          includesQuery(job.title, query) ||
          includesQuery(job.company, query) ||
          includesQuery(job.location, query) ||
          includesQuery(job.source, query) ||
          job.matched_skills?.some((skill) => includesQuery(skill, query)) ||
          job.missing_skills?.some((skill) => includesQuery(skill, query))
        );
      })
      .sort((a, b) => {
        if (sortBy === "match") {
          return clampScore(b.match_score) - clampScore(a.match_score);
        }

        if (sortBy === "company") {
          return (a.company ?? "").localeCompare(b.company ?? "");
        }

        if (sortBy === "location") {
          return (a.location ?? "").localeCompare(b.location ?? "");
        }

        return 0;
      });
  }, [jobs, search, sortBy]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <LoaderCircle className="h-5 w-5 animate-spin text-teal-300" aria-hidden="true" />
          <span className="font-bold">Loading dashboard</span>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <Panel className="max-w-md p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-teal-400/10 text-teal-200 ring-1 ring-teal-300/20">
            <FileText size={24} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-black">No report found</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Upload a resume first so CareerPilot can build your dashboard.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-md bg-teal-400 px-5 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-teal-300"
          >
            Upload resume
          </Link>
        </Panel>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071521_0%,#050914_30rem,#050914_100%)] px-4 py-5 text-white sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.38)] sm:p-7 lg:p-8">
          <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(135deg,rgba(45,212,191,0.32)_0%,rgba(15,23,42,0)_44%),linear-gradient(315deg,rgba(251,191,36,0.22)_0%,rgba(15,23,42,0)_45%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-teal-400 via-amber-300 to-rose-400" />

          <div className="relative grid gap-7 lg:grid-cols-[1fr_21rem] lg:items-end">
            <div className="min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/"
                  className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-bold text-white/75 transition hover:text-white"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Back to upload
                </Link>

                <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase text-teal-100 ring-1 ring-white/15 sm:text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-teal-300" />
                  <span className="truncate">Career intelligence</span>
                </div>
              </div>

              <h1 className="mt-4 text-4xl font-black leading-none sm:text-5xl lg:text-6xl">
                CareerPilot dashboard
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                A sharper read on resume strength, skill gaps, and job opportunities worth your time.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {skills.slice(0, 5).map((skill) => (
                  <span
                    key={`hero-${skill}`}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.08] p-5 text-white shadow-2xl shadow-slate-950/30 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    ATS score
                  </p>
                  <p className="mt-1 text-4xl font-black" style={{ color: scoreColor(atsScore) }}>
                    {atsScore}/100
                  </p>
                </div>
                <div className={`rounded-full px-3 py-1 text-sm font-black ring-1 ${atsTone.badge}`}>
                  {scoreLabel(atsScore)}
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-950/70 ring-1 ring-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${atsScore}%`, backgroundColor: scoreColor(atsScore) }}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-950/45 p-3 ring-1 ring-white/10">
                  <p className="text-2xl font-black">{jobs.length}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">Matched jobs</p>
                </div>
                <div className="rounded-lg bg-slate-950/45 p-3 ring-1 ring-white/10">
                  <p className="text-2xl font-black">{skills.length}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">Detected skills</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            icon={FileText}
            label="Resume"
            value={resumeFilename}
            detail="Scan complete"
            description={`${skills.length} skills detected from your latest upload.`}
            accent="teal"
          />
          <OverviewCard
            icon={Gauge}
            label="ATS score"
            value={`${atsScore}/100`}
            detail={scoreLabel(atsScore)}
            description="Resume health based on ATS-friendly keyword coverage."
            progress={atsScore}
            accent="emerald"
          />
          <OverviewCard
            icon={Briefcase}
            label="Jobs matched"
            value={jobs.length}
            detail="Opportunities"
            description={`${scannedJobs} roles scanned against your resume signals.`}
            accent="indigo"
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <InsightList
            icon={CheckCircle2}
            title="Strengths"
            items={strengths}
            emptyText="No strengths were detected yet."
            accent="emerald"
            subtitle="Signals that increase your match quality."
          />
          <InsightList
            icon={AlertTriangle}
            title="Weaknesses"
            items={weaknesses}
            emptyText="No improvement areas were detected yet."
            accent="rose"
            subtitle="Gaps to improve before applying."
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Panel className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-400">Resume health</p>
                <h2 className="mt-1 text-xl font-black text-white">ATS performance</h2>
              </div>
              <span className={`text-3xl font-black ${atsTone.text}`}>{atsScore}%</span>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-950/70 ring-1 ring-white/10">
              <div
                className={`h-full rounded-full ${atsTone.soft}`}
                style={{ width: `${atsScore}%`, backgroundColor: scoreColor(atsScore) }}
              />
            </div>

            <p className={`mt-4 text-sm font-bold ${atsTone.text}`}>
              {scoreLabel(atsScore)} resume
            </p>
          </Panel>

          <Panel className="overflow-hidden border-indigo-300/20 bg-[linear-gradient(135deg,rgba(129,140,248,0.14),rgba(15,23,42,0.86)_46%,rgba(15,23,42,0.94))] p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-400/10 text-indigo-200 ring-1 ring-indigo-300/20">
                  <Bot size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400">Resume intelligence</p>
                  <h2 className="text-xl font-black text-white">AI resume summary</h2>
                </div>
              </div>
              {summaryIsFallback && (
                <span className="inline-flex w-fit rounded-full bg-teal-400/10 px-3 py-1 text-xs font-black uppercase text-teal-100 ring-1 ring-teal-300/25">
                  Scan-based summary
                </span>
              )}
            </div>

            <p className="text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              {resumeSummary}
            </p>
          </Panel>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-200 ring-1 ring-teal-300/20">
                <Target size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400">Best matching roles</p>
                <h2 className="text-xl font-black text-white">Suggested shortlist</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {displayedRoles.map((role) => (
                <div key={role} className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
                  <p className="font-black text-white">{role}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Strong alignment with your current resume signals.
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200 ring-1 ring-amber-200/20">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black text-white">Skills</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {(skills.length ? skills : ["No skills detected"]).map((skill) => (
                <SkillPill key={skill}>{skill}</SkillPill>
              ))}
            </div>
          </Panel>
        </div>

        <Panel className="mt-6 p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-300/20">
              <Sparkles size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400">AI recommendations</p>
              <h2 className="text-xl font-black text-white">Next improvements</h2>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {displayedRecommendations.map((item, index) => (
              <p key={`${item}-${index}`} className="py-3 text-sm leading-6 text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </Panel>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-teal-200">
                Recommended jobs
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                {filteredJobs.length} role{filteredJobs.length === 1 ? "" : "s"} found
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem] lg:w-[32rem]">
              <label className="relative block">
                <span className="sr-only">Search jobs</span>
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search jobs"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-11 w-full rounded-md border border-white/10 bg-slate-900/80 pl-10 pr-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/70 focus:ring-4 focus:ring-teal-300/10"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Sort jobs</span>
                <SlidersHorizontal
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="h-11 w-full appearance-none rounded-md border border-white/10 bg-slate-900/80 pl-10 pr-8 text-sm font-bold text-white outline-none transition focus:border-teal-300/70 focus:ring-4 focus:ring-teal-300/10"
                >
                  <option value="match">Highest match</option>
                  <option value="company">Company</option>
                  <option value="location">Location</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
              </label>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-4 sm:gap-5">
              {filteredJobs.map((job, index) => (
                <JobCard
                  key={`${job.company ?? "company"}-${job.title ?? "role"}-${index}`}
                  job={job}
                  index={index}
                  expanded={Boolean(expandedJobs[index])}
                  onToggle={() =>
                    setExpandedJobs((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                />
              ))}
            </div>
          ) : (
            <Panel className="p-6 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-black text-white">No matching jobs</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Try another keyword or sort option to widen the list.
              </p>
            </Panel>
          )}
        </section>
      </div>
    </main>
  );
}
