"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaCalendarCheck, FaChartBar, FaRocket, FaCode, FaDatabase, FaLayerGroup, FaBars, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useStore();

  const primaryLink = user ? "/dashboard" : "/register";
  const secondaryLink = user ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Animated Background Highlights */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-beams" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-secondary flex items-center justify-center text-white shadow-lg">
              <FaChartBar size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter premium-gradient-text uppercase italic">
              Ascent
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link href={secondaryLink}>
              <Button variant="ghost" className="font-bold text-slate-600 hover:text-accent transition-colors">{user ? "Dashboard" : "SignIn"}</Button>
            </Link>
            <Link href={primaryLink}>
              <Button className="bg-gradient-to-r from-accent to-secondary text-white font-bold px-8 rounded-full shadow-lg hover:scale-105 transition-all">{user ? "Go to Dashboard" : "Get Started"}</Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-800 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 w-full bg-white/90 backdrop-blur-xl z-40 border-b border-white/20 p-6 flex flex-col gap-4 shadow-2xl md:hidden"
          >
            <Link href={secondaryLink} onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-bold">{user ? "Dashboard" : "Sign In"}</Button>
            </Link>
            <Link href={primaryLink} onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-accent to-secondary text-white font-bold">{user ? "Go to Dashboard" : "Sign Up"}</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-800 leading-[1.1]">
              ANALYZE YOUR <span className="premium-gradient-text italic">PROGRESS</span><br />
              WITH PRECISION
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto">
              A high-performance Full Stack tracking system designed to monitor attendance,
              visualize syllabus completion, and analyze academic trends through modern data analytics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href={primaryLink}>
              <Button className="h-16 px-10 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 shadow-2xl transition-all gap-3">
                {user ? "View Dashboard" : "Start Your Journey"} <FaRocket />
              </Button>
            </Link>
            <Link href={secondaryLink}>
              <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 border-slate-200 font-bold text-lg hover:bg-white/50 transition-all">
                {user ? "Manage Portal" : "Explore Portal"}
              </Button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <FeatureCard
              icon={FaCalendarCheck}
              title="Attendance Tracking"
              description="Real-time attendance monitoring with daily snapshots and historical trend analysis."
              delay={0.6}
            />
            <FeatureCard
              icon={FaBook}
              title="Syllabus Management"
              description="Track every chapter and subject with structured progress updates and time-taken analytics."
              delay={0.7}
            />
            <FeatureCard
              icon={FaChartBar}
              title="Growth Analytics"
              description="Beautifully visualized data showing your academic trajectory and session consistencies."
              delay={0.8}
            />
          </div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-32 p-12 glass-card border-none bg-white/30 backdrop-blur-3xl"
          >
            <h2 className="text-3xl font-black tracking-tighter text-slate-800 uppercase italic mb-12">
              The Tech Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <TechItem icon={FaLayerGroup} name="Next.js 15" label="Frontend Core" />
              <TechItem icon={FaDatabase} name="MongoDB" label="Database System" />
              <TechItem icon={FaCode} name="TypeScript" label="Typed Logic" />
              <TechItem icon={FaLayerGroup} name="Zustand" label="State Magmt" />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {['TailwindCSS', 'Framer Motion', 'Mongoose', 'Axios', 'JWT Auth', 'Recharts'].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full bg-white/50 text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-8 glass-card border-white/20 hover:scale-[1.03] transition-transform text-left bg-white/40 group overflow-hidden relative"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-secondary flex items-center justify-center text-white mb-6 shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2 italic">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TechItem({ icon: Icon, name, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="p-4 rounded-2xl bg-slate-900/5 group-hover:bg-accent/10 transition-colors">
        <Icon size={32} className="text-slate-800 group-hover:text-accent transition-colors" />
      </div>
      <span className="font-bold text-slate-800">{name}</span>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}
