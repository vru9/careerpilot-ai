import {
  Brain,
  CheckCircle2,
  BriefcaseBusiness,
  Gauge,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Resume analysis",
    description:
      "A readable summary of strengths, weaknesses, and role readiness."
  },
  {
    icon: Gauge,
    title: "ATS score",
    description:
      "A clear score that helps you understand where your resume stands."
  },
  {
    icon: BriefcaseBusiness,
    title: "Job matching",
    description:
      "Recommended roles sorted by fit, skills, location, and company."
  },
  {
    icon: Target,
    title: "Skill priorities",
    description:
      "Focused learning priorities for the gaps that matter most."
  }
];

const workflow = [
  "Upload a PDF resume",
  "Review the score and gaps",
  "Apply to matched roles",
];

export default function Features() {
  return (
    <>
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-teal-200">
              Report output
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Everything in one scan
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            CareerPilot turns a resume upload into concrete signals you can use
            while comparing jobs.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-teal-300/50 hover:bg-slate-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-200 ring-1 ring-teal-300/20">
                  <Icon size={20} aria-hidden="true" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="about" className="border-y border-white/10 bg-slate-950/70 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-teal-300">
              Workflow
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              From resume to shortlist
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              The dashboard is built for fast comparison: score first, evidence
              next, then the job actions that are worth your time.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {workflow.map((item, index) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-teal-300">
                    Step {index + 1}
                  </span>
                  {index === workflow.length - 1 ? (
                    <Sparkles size={18} className="text-amber-300" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 size={18} className="text-teal-300" aria-hidden="true" />
                  )}
                </div>

                <p className="text-lg font-bold leading-6">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
