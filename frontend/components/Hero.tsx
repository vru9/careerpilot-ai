"use client";

import { motion } from "framer-motion";
import UploadCard from "./UploadCard";

export default function Hero() {
  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">

      <motion.h1
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-6xl font-extrabold leading-tight text-white md:text-7xl"
>
  Navigate Your
  <br />

  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
    Career with AI
  </span>
</motion.h1>

      <motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
  className="mt-8 max-w-3xl text-xl leading-8 text-gray-400"
>
  CareerPilot uses AI to analyse your resume,
  calculate your ATS score, identify missing skills,
  and recommend live jobs that match your profile.
</motion.p>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <UploadCard />
      </motion.div>

    </section>
  );
}