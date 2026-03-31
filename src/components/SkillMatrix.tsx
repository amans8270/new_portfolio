import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Brain, Server, Layout } from 'lucide-react';

const SkillMatrix = React.memo(function SkillMatrix() {
  const skills = useMemo(() => [
    { name: "LangGraph", category: "AI Architecture" },
    { name: "LangChain", category: "AI Architecture" },
    { name: "ReAct", category: "AI Architecture" },
    { name: "Python", category: "Backend Engine" },
    { name: "FastAPI", category: "Backend Engine" },
    { name: "Spring Boot", category: "Backend Engine" },
    { name: "PostgreSQL", category: "Backend Engine" },
    { name: "React", category: "Frontend Craft" },
    { name: "Next.js", category: "Frontend Craft" },
    { name: "Tailwind CSS", category: "Frontend Craft" }
  ], []);

  const categories = useMemo(() => ["AI Architecture", "Backend Engine", "Frontend Craft"], []);

  const getIcon = (category: string) => {
    if (category === "AI Architecture") return <Brain className="text-cyan-400" />;
    if (category === "Backend Engine") return <Server className="text-cyan-400" />;
    return <Layout className="text-cyan-400" />;
  };

  const getShadow = (category: string) => {
    if (category === "AI Architecture") return "shadow-[0_0_30px_-10px_rgba(0,243,255,0.3)]";
    if (category === "Backend Engine") return "shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]";
    return "shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]";
  };

  return (
    <section id="skills" className="py-32 px-4 max-w-7xl mx-auto">
      <div className="mb-20 text-center">
        <h2 className="text-5xl font-bold text-white mb-4 tracking-tighter">SKILL_MATRIX</h2>
        <p className="text-cyan-400/60 font-mono">NEURAL CLUSTERS OF EXPERTISE</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((category, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            className={`p-8 rounded-3xl bg-[#0a0a0a] border border-cyan-500/10 ${getShadow(category)} flex flex-col items-center text-center transition-all duration-500`}
          >
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
              {getIcon(category)}
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{category}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills
                .filter(s => s.category === category)
                .map((skill, j) => (
                <motion.span
                  key={skill.name}
                  whileHover={{ scale: 1.1, color: '#00f3ff' }}
                  className="px-4 py-2 bg-black/40 border border-cyan-500/10 rounded-xl text-sm font-mono text-gray-400 cursor-default"
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

export default SkillMatrix;
