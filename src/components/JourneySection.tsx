import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Briefcase, Code, Globe } from 'lucide-react';

const experiences = [
  {
    title: "Wipro",
    role: "Project Engineer Trainee",
    period: "2023 - Present",
    desc: "Java Full-Stack development specialist. Spearheaded the Muzix App, a music discovery platform built with Spring Boot and React.",
    icon: <Briefcase className="text-cyan-400" />,
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "Surya Jyoti",
    role: "Freelance Full-Stack Developer",
    period: "1.5 Years",
    desc: "Built robust MERN applications for diverse clients. Focused on scalable architecture and high-performance user interfaces.",
    icon: <Globe className="text-cyan-400" />,
    color: "from-purple-500/20 to-cyan-500/20"
  }
];

export default function JourneySection() {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section id="journey" ref={targetRef} className="relative h-[300vh] bg-transparent">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-20 px-20">
          <div className="min-w-[40vw] flex flex-col justify-center">
            <h2 className="text-6xl font-bold text-white mb-4 tracking-tighter">
              PROFESSIONAL<br />
              <span className="text-cyan-400">JOURNEY</span>
            </h2>
            <p className="text-cyan-400/60 font-mono">SCROLL TO EXPLORE THE TIMELINE —&gt;</p>
          </div>

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`min-w-[60vw] md:min-w-[40vw] p-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-br ${exp.color} backdrop-blur-xl flex flex-col justify-between h-[60vh] relative group overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                {React.cloneElement(exp.icon as React.ReactElement<any>, { size: 120 })}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    {exp.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{exp.title}</h3>
                    <p className="text-cyan-400 font-mono text-sm">{exp.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  {exp.desc}
                </p>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-cyan-400/40 font-mono text-sm">{exp.period}</span>
                <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                  <span className="text-cyan-400 text-xl">0{i + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
