import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Download } from 'lucide-react';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import StateGraph from './components/StateGraph';
import FloatingBadge from './components/FloatingBadge';
import JourneySection from './components/JourneySection';
import LabSection from './components/LabSection';
import SkillMatrix from './components/SkillMatrix';
import TerminalFooter from './components/TerminalFooter';
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setIsAdmin(true);
    }

    const fetchResume = async () => {
      const snap = await getDoc(doc(db, 'resume', 'main'));
      if (snap.exists()) {
        setResumeUrl(snap.data().downloadUrl);
      }
    };
    fetchResume();
  }, []);

  if (isAdmin) return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyan-400 font-mono">INITIALIZING_ADMIN_DASHBOARD...</div>}>
      <AdminDashboard />
    </React.Suspense>
  );

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-400">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* 3D Background */}
      <StateGraph />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <div className="flex justify-center mb-8">
            <FloatingBadge />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6">
            AMAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">SINGH</span>
          </h1>
          
          <p className="text-xl md:text-3xl font-light text-cyan-400/80 mb-8 tracking-wide max-w-3xl mx-auto leading-tight">
            Architecting the Future of <span className="font-mono font-bold text-white">Agentic AI</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="#lab"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center gap-2"
            >
              EXPLORE_LAB
            </motion.a>
            {resumeUrl && (
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Download size={18} /> DOWNLOAD_RESUME
              </motion.a>
            )}
            <motion.a
              href="#journey"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border border-cyan-500/30 text-cyan-400 font-bold rounded-full hover:bg-cyan-500/10 transition-colors"
            >
              VIEW_JOURNEY
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyan-400/40 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs uppercase tracking-widest">Scroll to Initialize</span>
          <div className="w-px h-12 bg-gradient-to-b from-cyan-400/40 to-transparent" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 max-w-4xl mx-auto relative">
        <div className="absolute -left-20 top-0 text-[200px] font-bold text-white/5 select-none pointer-events-none">
          BIO
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-bold text-cyan-400 font-mono tracking-tighter">NARRATIVE_INITIALIZATION...</h2>
          <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed font-light">
            I am an IT Engineer who evolved into an <span className="text-white font-medium">AI Architect</span>. 
            My mission is to bridge the gap between high-performance full-stack systems and the emerging world of 
            <span className="text-cyan-400"> Agentic AI</span>. With a foundation in Java and MERN, I now build 
            intelligent systems that don't just process data, but reason and act.
          </p>
          <div className="flex gap-4">
            <div className="h-1 w-20 bg-cyan-500" />
            <div className="h-1 w-10 bg-cyan-500/30" />
            <div className="h-1 w-5 bg-cyan-500/10" />
          </div>
        </motion.div>
      </section>

      {/* Journey Section (Horizontal Scroll) */}
      <JourneySection />

      {/* Lab Section (Projects) */}
      <LabSection />

      {/* Skill Matrix */}
      <SkillMatrix />

      {/* Footer (Terminal) */}
      <TerminalFooter />

      {/* Global Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
