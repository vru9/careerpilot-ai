"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gauge, Target, WandSparkles } from "lucide-react";
import UploadCard from "./UploadCard";

const stats = [
  { label: "ATS score", value: "0-100", icon: Gauge },
  { label: "Skill gaps", value: "Ranked", icon: Target },
  { label: "Job matches", value: "Live", icon: WandSparkles },
];

export default function Hero() {
  return (
    <section className="px-4 pb-14 pt-8 text-white sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:min-h-[680px] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="mx-auto w-full max-w-3xl text-center lg:mx-0 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-400/10 px-3 py-1.5 text-sm font-semibold text-teal-100 shadow-sm lg:mx-0"
          >
            <WandSparkles size={16} aria-hidden="true" />
            AI resume intelligence for faster job searches
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="mt-6 text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl"
          >
            Navigate your career with a clearer next move.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg lg:mx-0"
          >
            Upload your resume to get an ATS score, a readable skill-gap report,
            and job recommendations matched to your experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.45 }}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/10 bg-slate-900/70 p-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-teal-300" aria-hidden="true" />
                  <p className="mt-3 text-xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </motion.div>

          <motion.a
            href="#upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.45 }}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-teal-400 px-5 py-3 text-sm font-black text-slate-950 shadow-sm shadow-teal-950/30 transition hover:bg-teal-300"
          >
            Start with your resume
            <ArrowRight size={18} aria-hidden="true" />
          </motion.a>
        </div>

        <motion.div
          id="upload"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.55 }}
          className="mx-auto w-full max-w-xl scroll-mt-24 lg:mx-0 lg:justify-self-end"
        >
          <UploadCard />
        </motion.div>
      </div>
    </section>
  );
}
