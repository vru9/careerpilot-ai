import {
  Brain,
  FileSearch,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    description:
      "Get instant AI-powered feedback on your resume."
  },
  {
    icon: FileSearch,
    title: "ATS Score",
    description:
      "See how well your resume performs against ATS systems."
  },
  {
    icon: BriefcaseBusiness,
    title: "Live Job Matching",
    description:
      "Discover jobs that match your skills in real time."
  },
  {
    icon: Sparkles,
    title: "Personalized Insights",
    description:
      "Understand your strengths and improve weak areas."
  }
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-28">

      <h2 className="mb-14 text-center text-4xl font-bold text-white">
        Everything You Need
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {features.map((feature) => {

          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:-translate-y-2 hover:border-blue-500"
            >
              <Icon className="mb-6 h-10 w-10 text-blue-500" />

              <h3 className="mb-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          );

        })}

      </div>

    </section>
  );
}