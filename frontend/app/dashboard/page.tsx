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
    <main className="min-h-screen bg-[#0B1120] px-8 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-2 text-5xl font-bold">
          CareerPilot Dashboard
        </h1>

        <p className="mb-10 text-gray-400">
          AI-powered resume analysis and job recommendations.
        </p>

        {/* Top Cards */}
        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <FileText className="mb-4 text-blue-400" size={30} />
            <h2 className="text-lg font-semibold text-gray-300">
              Resume
            </h2>
            <p className="mt-2 text-xl font-bold">
              {resume.filename}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
  <Wrench className="mb-4 text-green-400" size={30} />
  <h2 className="text-lg font-semibold text-gray-300">
    ATS Score
  </h2>

  <p className="mt-2 text-4xl font-bold text-green-400">
    {resume.ats_score}%
  </p>
</div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <Briefcase className="mb-4 text-purple-400" size={30} />
            <h2 className="text-lg font-semibold text-gray-300">
              Jobs Matched
            </h2>
            <p className="mt-2 text-4xl font-bold">
              {jobs.length}
            </p>
          </div>

        </div>

<div className="mt-8 grid gap-6 lg:grid-cols-2">

  {/* Strengths */}

  <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8">

    <h2 className="mb-6 text-2xl font-bold text-green-400">

      💪 Strengths

    </h2>

    <div className="flex flex-wrap gap-3">

      {resume.strengths?.map((item: string) => (

        <span
          key={item}
          className="rounded-full bg-green-500/20 px-4 py-2"
        >
          {item}
        </span>

      ))}

    </div>

  </div>

  {/* Weaknesses */}

  <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

    <h2 className="mb-6 text-2xl font-bold text-red-400">

      ⚠ Weaknesses

    </h2>

    <div className="flex flex-wrap gap-3">

      {resume.weaknesses?.map((item: string) => (

        <span
          key={item}
          className="rounded-full bg-red-500/20 px-4 py-2"
        >
          {item}
        </span>

      ))}

    </div>

  </div>

</div>

{/* ATS + AI Summary */}

<div className="mt-10 grid gap-6 lg:grid-cols-2">

  {/* ATS Card */}

  <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

    <h2 className="mb-6 text-2xl font-bold">
      ATS Score
    </h2>

    <div className="text-7xl font-black text-green-400">
      {resume.ats_score}%
    </div>

    <div className="mt-6 h-4 w-full rounded-full bg-gray-700">

      <div
        className="h-4 rounded-full bg-green-500 transition-all duration-700"
        style={{
          width: `${resume.ats_score}%`
        }}
      />

    </div>

    <p className="mt-5 text-gray-400">

      {
        resume.ats_score >= 90
          ? "Excellent Resume"
          : resume.ats_score >= 80
          ? "Very Strong Resume"
          : resume.ats_score >= 70
          ? "Good Resume"
          : "Needs Improvement"
      }

    </p>

  </div>

  {/* AI Summary */}

  <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

    <h2 className="mb-6 text-2xl font-bold">

      🤖 AI Resume Summary

    </h2>

    <p className="leading-8 text-gray-300">

      {resume.summary}

    </p>

  </div>

</div>

{/* Best Matching Roles */}

<section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
  <h2 className="mb-6 text-2xl font-bold">
    🎯 Best Matching Roles
  </h2>

  <div className="flex flex-wrap gap-3">
    {resume.best_matching_roles?.map((role: string) => (
      <span
        key={role}
        className="rounded-full bg-blue-500/20 px-4 py-2 text-blue-300"
      >
        {role}
      </span>
    ))}
  </div>
</section>

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

          <div className="grid gap-8">
  {filteredJobs.map((job: any, index: number) => (
    <div
      key={index}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h3 className="text-3xl font-bold">
            {job.title}
          </h3>

          <p className="mt-2 text-lg text-gray-400">
            {job.company}
          </p>
        </div>

        <div className="flex flex-col items-center">

  <div className="relative h-24 w-24">

    <svg
      className="-rotate-90"
      width="96"
      height="96"
    >
      {/* Background Circle */}

      <circle
        cx="48"
        cy="48"
        r="42"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="8"
        fill="none"
      />

      {/* Progress */}

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

    <div className="absolute inset-0 flex flex-col items-center justify-center">

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
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Matched Skills */}
        <div>

          <h4 className="mb-3 font-semibold text-green-400">
            ✅ Matched Skills
          </h4>

          <div className="flex flex-wrap gap-2">
            {job.matched_skills?.map((skill: string) => (
              <span
                key={skill}
                className="rounded-full bg-green-500/20 px-3 py-1 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

        </div>

        {/* Missing Skills */}
        <div>

          <h4 className="mb-3 font-semibold text-red-400">
            ⚠ Missing Skills
          </h4>

          <div className="flex flex-wrap gap-2">
            {job.missing_skills?.map((skill: string) => (
              <span
                key={skill}
                className="rounded-full bg-red-500/20 px-3 py-1 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

        </div>

      </div>

<div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
  <h4 className="mb-3 font-semibold text-yellow-300">
    📚 Learning Priority
  </h4>

  <p className="leading-7 text-gray-300">
    {job.learning_priority}
  </p>
</div>

{/* Learning Priority */}

{job.learning_priority?.length > 0 && (
  <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
    <h4 className="mb-4 font-semibold text-yellow-300">
      📚 Learning Priority
    </h4>

    <ul className="space-y-2 text-yellow-100">
      {job.learning_priority.map((item: string, index: number) => (
        <li key={index} className="flex items-start gap-2">
          <span>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)}


      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">

        <div>
              <p className="text-sm text-gray-400">
      Interview Readiness
    </p>

    <div
      className={`mt-2 inline-flex rounded-full px-4 py-2 font-semibold ${
        job.interview_readiness === "High"
          ? "bg-green-500/20 text-green-400"
          : job.interview_readiness === "Medium"
          ? "bg-yellow-500/20 text-yellow-400"
          : job.interview_readiness === "Low"
          ? "bg-red-500/20 text-red-400"
          : "bg-gray-500/20 text-gray-300"
      }`}
    >
      {job.interview_readiness || "Unknown"}
    </div>

  </div>

        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
        >
          Apply Now →
        </a>

      </div>
    </div>
  ))}
</div>
        </section>

      </div>
    </main>
  );
}

