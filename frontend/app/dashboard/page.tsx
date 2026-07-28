"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, FileText, Wrench } from "lucide-react";

function decodeHtml(html: string) {
  if (typeof window === "undefined") return html;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}



export default function Dashboard() {

  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("match");
  const [expandedJobs, setExpandedJobs] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem("careerpilot_result");

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B1120] text-white">
        <h1 className="text-2xl font-semibold">
          Loading Dashboard...
        </h1>
      </main>
    );
  }

  const resume = data.resume || {};
  const jobs = data.jobs || [];
  const filteredJobs = [...jobs]
  .filter((job: any) => {
    const query = search.toLowerCase();

    return (
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.matched_skills?.some((skill: string) =>
        skill.toLowerCase().includes(query)
      )
    );
  })
  .sort((a: any, b: any) => {
    if (sortBy === "match") {
      return (b.match_score ?? 0) - (a.match_score ?? 0);
    }

    if (sortBy === "company") {
      return (a.company ?? "").localeCompare(b.company ?? "");
    }

    if (sortBy === "location") {
      return (a.location ?? "").localeCompare(b.location ?? "");
    }

    return 0;
  });
  console.log(jobs[0]);
  console.log(data);

  return (
  <main className="min-h-screen bg-[#0B1120] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-10">
    <div className="mx-auto max-w-7xl">

      {/* Dashboard Header */}
      <div className="mb-8 sm:mb-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Career Intelligence
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          CareerPilot Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
          Understand your resume, discover skill gaps, and find roles
          that match your profile.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">

        {/* Resume */}
        <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 lg:col-span-1">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <FileText className="text-blue-400" size={20} />
            </div>

            <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
              Analysed
            </span>
          </div>

          <p className="text-sm text-gray-400">
            Resume
          </p>

          <p className="mt-1 truncate text-base font-semibold text-gray-100 sm:text-lg">
            {resume.filename}
          </p>
        </div>

        {/* ATS Score */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Wrench className="text-emerald-400" size={20} />
          </div>

          <p className="text-xs text-gray-400 sm:text-sm">
            ATS Score
          </p>

          <div className="mt-1 flex items-end gap-1">
            <span className="text-3xl font-bold tracking-tight text-emerald-400 sm:text-4xl">
              {resume.ats_score}
            </span>
            <span className="mb-1 text-sm text-gray-500">
              / 100
            </span>
          </div>
        </div>

        {/* Jobs Matched */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <Briefcase className="text-violet-400" size={20} />
          </div>

          <p className="text-xs text-gray-400 sm:text-sm">
            Jobs Matched
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight sm:text-4xl">
              {jobs.length}
            </span>
            <span className="mb-1 hidden text-sm text-gray-500 sm:block">
              opportunities
            </span>
          </div>
        </div>

      </div>

{/* Strengths & Weaknesses */}
<div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-6">

  {/* Strengths */}
  <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 sm:p-7">
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-xl font-bold text-emerald-400 sm:text-2xl">
        💪 Strengths
      </h2>

      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
        {resume.strengths?.length || 0} found
      </span>
    </div>

    <div className="space-y-3">
      {resume.strengths?.map((strength: string, index: number) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
        >
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
            ✓
          </div>

          <p className="text-sm leading-6 text-gray-300 sm:text-base">
            {strength}
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* Weaknesses */}
  <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 sm:p-7">
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-xl font-bold text-red-400 sm:text-2xl">
        ⚠ Weaknesses
      </h2>

      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
        {resume.weaknesses?.length || 0} found
      </span>
    </div>

    <div className="space-y-3">
      {resume.weaknesses?.map((weakness: string, index: number) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
        >
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-xs font-bold text-red-400">
            !
          </div>

          <p className="text-sm leading-6 text-gray-300 sm:text-base">
            {weakness}
          </p>
        </div>
      ))}
    </div>
  </section>

</div>

{/* Resume Health + AI Summary */}
<div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-6">

  {/* Resume Health */}
  <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">

    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-400">
          Resume Health
        </p>

        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
          ATS Performance
        </h2>
      </div>

      <span className="text-3xl font-bold text-emerald-400 sm:text-4xl">
        {resume.ats_score}%
      </span>
    </div>

    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
        style={{ width: `${resume.ats_score}%` }}
      />
    </div>

    <p className="mt-4 text-sm font-medium text-emerald-300">
      {resume.ats_score >= 90
        ? "Excellent Resume"
        : resume.ats_score >= 80
        ? "Very Strong Resume"
        : resume.ats_score >= 70
        ? "Good Resume"
        : "Needs Improvement"}
    </p>

  </section>

  {/* AI Summary */}
  <section className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-5 sm:p-7">

    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
        🤖
      </div>

      <h2 className="text-xl font-bold sm:text-2xl">
        AI Resume Summary
      </h2>
    </div>

    <p className="text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
      {resume.summary}
    </p>

  </section>

</div>

{/* Best Matching Roles */}

<section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

  <div className="mb-6">
    <h2 className="text-2xl font-bold">
      🎯 Best Matching Roles
    </h2>

    <p className="mt-2 text-gray-400">
      Based on your resume analysis, these are the roles where your profile has the strongest fit.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-3">

    {resume.best_matching_roles?.map((role: string) => (

      <div
        key={role}
        className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
      >
        <div className="mb-3 text-4xl">
          🚀
        </div>

        <h3 className="text-lg font-bold text-white">
          {role}
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Strong alignment with your current skills and experience.
        </p>
      </div>

    ))}

  </div>

</section>

        {/* Skills */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="mb-6 text-2xl font-bold">
            Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {resume.skills?.map((skill: string) => (
              <span
                key={skill}
                className="rounded-full bg-blue-600/20 px-4 py-2 text-sm text-blue-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>


{/* AI Recommendations */}

<section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

  <div className="mb-6">
    <h2 className="text-2xl font-bold">
      ✨ AI Recommendations
    </h2>

    <p className="mt-2 text-gray-400">
      Personalized suggestions to improve your resume and increase your chances of landing interviews.
    </p>
  </div>

  <div className="space-y-4">

    {resume.recommendations?.map((item: string, index: number) => (

      <div
        key={index}
        className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 transition-all duration-300 hover:border-emerald-400"
      >
        <div className="mt-1 text-2xl">
          💡
        </div>

        <p className="leading-7 text-gray-300">
          {item}
        </p>

      </div>

    ))}

  </div>

</section>

        {/* Jobs */}
        <section className="mt-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

  <h2 className="text-3xl font-bold">
    Recommended Jobs
  </h2>

  <div className="flex flex-col gap-3 md:flex-row">
  <input
    type="text"
    placeholder="🔍 Search jobs..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-400 outline-none transition focus:border-blue-500 md:w-80"
  />

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
  >
    <option value="match">⭐ Highest Match</option>
    <option value="company">🏢 Company</option>
    <option value="location">📍 Location</option>
  </select>
</div>

</div>

          <div className="grid gap-5 sm:gap-6">
  {filteredJobs.map((job: any, index: number) => (
    <div
      key={index}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <h3 className="text-xl font-bold leading-tight sm:text-2xl lg:text-3xl">
            {job.title}
          </h3>

          <p className="mt-1 text-sm text-gray-400 sm:text-base">
            {job.company}
          </p>
        </div>

        {/* Match Score */}
<div className="shrink-0">

  {/* Mobile Match Score */}
  <div className="flex flex-col items-end sm:hidden">

    <div
      className={`rounded-xl px-3 py-2 ${
        job.match_score >= 90
          ? "bg-green-500/15 text-green-400"
          : job.match_score >= 70
          ? "bg-yellow-500/15 text-yellow-300"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      <span className="text-xl font-black">
        {job.match_score}%
      </span>
    </div>

    <span className="mt-1 text-xs text-gray-400">
      Match
    </span>

  </div>

  {/* Desktop Match Score */}
  <div className="hidden flex-col items-center sm:flex">

    <div className="relative h-24 w-24">

      <svg
        className="-rotate-90"
        width="96"
        height="96"
      >
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="8"
          fill="none"
        />

        <circle
          cx="48"
          cy="48"
          r="42"
          stroke={
            job.match_score >= 90
              ? "#22c55e"
              : job.match_score >= 70
              ? "#facc15"
              : "#ef4444"
          }
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={264}
          strokeDashoffset={
            264 - ((job.match_score ?? 0) / 100) * 264
          }
          className="transition-all duration-1000"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black">
          {job.match_score}%
        </span>
      </div>

    </div>

    <p className="mt-3 text-sm font-semibold text-green-400">
      Match Score
    </p>

  </div>

</div>

      </div>

      {/* Job Info */}

<div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-400">

  <span>
    📍 {job.location || "Remote"}
  </span>

  <span>
    🌐 {job.source}
  </span>

  {job.employment_type && (
    <span>
      💼 {job.employment_type}
    </span>
  )}

  {job.posted_date && (
    <span>
      📅 {new Date(job.posted_date).toLocaleDateString()}
    </span>
  )}

</div>

{/* 👇 ADD THE SALARY CARD HERE */}

{job.salary && (

  <div className="mt-5 inline-block rounded-xl bg-emerald-500/15 px-4 py-2">

    <span className="font-semibold text-emerald-300">
      💰 {job.currency} {job.salary}
    </span>

  </div>

)}



      {/* AI Explanation */}
      <div className="mt-8 rounded-2xl bg-blue-500/10 p-5">

        <h4 className="mb-3 font-semibold text-blue-300">
          🤖 Why this job matches you
        </h4>

        <p className="leading-7 text-gray-300">
          {job.why_match}
        </p>

      </div>

{/* About the Role */}

{job.description && (
  <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">

    <h4 className="mb-3 font-semibold text-cyan-300">
      📝 About this Role
    </h4>

    <div
      className={`text-gray-300 leading-relaxed ${
        expandedJobs[index] ? "" : "line-clamp-4"
      }`}
      dangerouslySetInnerHTML={{
        __html: decodeHtml(job.description),
      }}
    />

    <button
      type="button"
      onClick={() =>
        setExpandedJobs((prev) => ({
          ...prev,
          [index]: !prev[index],
        }))
      }
      className="mt-4 font-medium text-cyan-300 hover:text-cyan-200"
    >
      {expandedJobs[index] ? "Show less ↑" : "Read more ↓"}
    </button>

  </div>
)}

      {/* Skills */}
<div className="mt-6 grid gap-5 sm:mt-8 lg:grid-cols-2 lg:gap-6">

  {/* Matched Skills */}
  <div>
    <h4 className="mb-3 text-sm font-semibold text-green-400 sm:text-base">
      ✅ Matched Skills
    </h4>

    <div className="flex flex-wrap gap-2">
      {job.matched_skills?.map((skill: string) => (
        <span
          key={skill}
          className="rounded-full bg-green-500/15 px-3 py-1.5 text-xs text-green-100 sm:text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>

  {/* Missing Skills */}
  <div>
    <h4 className="mb-3 text-sm font-semibold text-red-400 sm:text-base">
      ⚠ Missing Skills
    </h4>

    <div className="flex flex-wrap gap-2">
      {job.missing_skills?.map((skill: string) => (
        <span
          key={skill}
          className="max-w-full rounded-full bg-red-500/15 px-3 py-1.5 text-xs text-red-100 sm:text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>

</div>


{/* Learning Priority */}
{job.learning_priority?.length > 0 && (
  <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.07] p-4 sm:mt-8 sm:rounded-2xl sm:p-5">

    <h4 className="mb-3 text-sm font-semibold text-yellow-300 sm:text-base">
      📚 Learning Priority
    </h4>

    <ul className="space-y-2">
      {job.learning_priority.map((item: string, index: number) => (
        <li
          key={index}
          className="flex items-start gap-2 text-sm leading-6 text-yellow-100 sm:text-base"
        >
          <span className="mt-0.5 shrink-0 text-yellow-400">
            •
          </span>

          <span>
            {item}
          </span>
        </li>
      ))}
    </ul>

  </div>
)}


{/* Footer */}
<div className="mt-6 border-t border-white/10 pt-5 sm:mt-8 sm:pt-6">

  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

    {/* Interview Readiness */}
    <div>
      <p className="text-xs text-gray-400 sm:text-sm">
        Interview Readiness
      </p>

      <div
        className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${
          job.interview_readiness === "High"
            ? "bg-green-500/15 text-green-400"
            : job.interview_readiness === "Medium"
            ? "bg-yellow-500/15 text-yellow-400"
            : job.interview_readiness === "Low"
            ? "bg-red-500/15 text-red-400"
            : "bg-gray-500/20 text-gray-300"
        }`}
      >
        {job.interview_readiness || "Unknown"}
      </div>
    </div>


    {/* Apply Button */}
    <a
      href={job.apply_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 sm:w-auto sm:text-base"
    >
      Apply Now
      <span className="ml-2">→</span>
    </a>

  </div>

</div>

{/* End Job Card */}
</div>

))}

</div>

</section>

</div>

</main>

);

}