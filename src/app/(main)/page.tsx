"use client";

import { motion } from "framer-motion";
import { HeroBanner } from "@/components/home/hero-banner";
import { SectionNewUpdates } from "@/components/home/section-new-updates";
import { SectionAudioHot } from "@/components/home/section-audio-hot";
import { SectionLeaderboard } from "@/components/home/section-leaderboard";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10 animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[150px] dark:bg-blue-600/10" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-8 space-y-24">
        {/* Hero Banner Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <HeroBanner />
        </motion.section>

        {/* New Updates Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionNewUpdates />
        </motion.section>

        {/* Audio Hot Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionAudioHot />
        </motion.section>

        {/* Leaderboard Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionLeaderboard />
        </motion.section>
      </div>
    </div>
  );
}
