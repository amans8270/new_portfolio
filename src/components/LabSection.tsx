import React from 'react';
import { motion } from 'motion/react';
import { Database, Book, ExternalLink, Cpu, Code, Music } from 'lucide-react';

export default function LabSection() {
  const projects = [
    {
      id: 'sqlverse',
      title: "SQLVerse",
      desc: "An interactive 3D window showing a 'Natural Language to SQL' transformation animation.",
      tags: ["Next.js", "FastAPI", "LangChain"],
      github: "https://github.com/amans8270"
    },
    {
      id: 'book-inventory',
      title: "Book Inventory",
      desc: "A clean, 3D grid display of a full-stack CRUD system using MongoDB.",
      tags: ["MongoDB", "Express", "React", "Node"],
      github: "https://github.com/amans8270"
    },
    {
      id: 'muzix-app',
      title: "Muzix App",
      desc: "Full-stack music streaming and management platform. Integrated with external APIs for real-time music discovery.",
      tags: ["Spring Boot", "Angular", "MySQL"],
      github: "https://github.com/amans8270"
    }
  ];

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('sql')) return <Database className="text-cyan-400" />;
    if (t.includes('book')) return <Book className="text-cyan-400" />;
    if (t.includes('muzix') || t.includes('music')) return <Music className="text-cyan-400" />;
    return <Code className="text-cyan-400" />;
  };

  return (
    <section id="lab" className="py-32 px-4 max-w-7xl mx-auto">
      <div className="mb-20">
        <h2 className="text-5xl font-bold text-white mb-4 tracking-tighter">THE_LAB</h2>
        <p className="text-cyan-400/60 font-mono">EXPERIMENTAL PROJECTS & ARCHITECTURES</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {projects.map((project, i) => (
          <motion.div
            key={project.id || i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#0a0a0a] border border-cyan-500/10 rounded-3xl p-8 hover:border-cyan-500/40 transition-all duration-500 overflow-hidden"
          >
            {project.github && (
              <div className="absolute top-0 right-0 p-6">
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="text-cyan-400/20 group-hover:text-cyan-400 transition-colors" />
                </a>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                {getIcon(project.title)}
              </div>
              <h3 className="text-3xl font-bold text-white">{project.title}</h3>
            </div>

            <div className="aspect-video mb-8 overflow-hidden rounded-2xl bg-black/20 border border-cyan-500/5 flex items-center justify-center p-4">
               {/* Visual fallback if no specific visual is defined */}
               <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/40 rounded-xl border border-cyan-500/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
                <div className="font-mono text-[10px] text-cyan-400/40 p-4 space-y-1 text-center">
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>{project.title.toUpperCase()}_INITIALIZED</motion.div>
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>STATUS: ACTIVE_DEPLOYMENT</motion.div>
                </div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-32 h-32 border border-cyan-500/10 rounded-full flex items-center justify-center"
                >
                  <Cpu size={32} className="text-cyan-400/20" />
                </motion.div>
              </div>
            </div>

            <p className="text-gray-400 mb-8 leading-relaxed">
              {project.desc}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag: string, j: number) => (
                <span key={j} className="px-3 py-1 bg-cyan-500/5 border border-cyan-500/20 rounded-full text-xs font-mono text-cyan-400">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
