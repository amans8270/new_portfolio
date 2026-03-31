import React, { useState, useEffect } from 'react';
import { auth, signIn, logout, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc, query, orderBy, getDocFromServer } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, LogOut, Save, FileText, Layout, Cpu, Database, Brain, Server, Terminal } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [resume, setResume] = useState<any>({ content: '', downloadUrl: '' });
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'resume', 'main'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email === 'amans8270@gmail.com') {
      const qProjects = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const unsubProjects = onSnapshot(qProjects, (snap) => {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'projects');
      });
      
      const qSkills = query(collection(db, 'skills'), orderBy('order', 'asc'));
      const unsubSkills = onSnapshot(qSkills, (snap) => {
        setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'skills');
      });
      
      const unsubResume = onSnapshot(doc(db, 'resume', 'main'), (snap) => {
        if (snap.exists()) setResume(snap.data());
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'resume/main');
      });
      return () => { unsubProjects(); unsubSkills(); unsubResume(); };
    }
  }, [user]);

  const handleAddProject = async () => {
    try {
      await addDoc(collection(db, 'projects'), {
        title: 'New Project',
        desc: 'Description here',
        tags: ['React', 'AI'],
        order: projects.length,
        github: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  };

  const handleUpdateProject = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'projects', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const handleAddSkill = async () => {
    try {
      await addDoc(collection(db, 'skills'), {
        name: 'New Skill',
        category: 'AI Architecture',
        order: skills.length
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'skills');
    }
  };

  const handleUpdateSkill = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'skills', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `skills/${id}`);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `skills/${id}`);
    }
  };

  const handleSaveResume = async () => {
    try {
      await setDoc(doc(db, 'resume', 'main'), {
        ...resume,
        updatedAt: new Date().toISOString()
      });
      alert('Resume updated!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'resume/main');
    }
  };

  const seedInitialData = async () => {
    if (!confirm('This will RESET your portfolio and seed initial projects, skills, and resume. Continue?')) return;

    // Clear existing
    for (const p of projects) await deleteDoc(doc(db, 'projects', p.id));
    for (const s of skills) await deleteDoc(doc(db, 'skills', s.id));

    const initialProjects = [
      { 
        title: "SQLVerse", 
        desc: "An interactive 3D window showing a 'Natural Language to SQL' transformation animation.", 
        tags: ["Next.js", "FastAPI", "LangChain"], 
        order: 0, 
        github: "https://github.com/amans8270" 
      },
      { 
        title: "Book Inventory", 
        desc: "A clean, 3D grid display of a full-stack CRUD system using MongoDB.", 
        tags: ["MongoDB", "Express", "React", "Node"], 
        order: 1, 
        github: "https://github.com/amans8270" 
      },
      { 
        title: "Muzix App", 
        desc: "Full-stack music streaming and management platform. Integrated with external APIs for real-time music discovery.", 
        tags: ["Spring Boot", "Angular", "MySQL"], 
        order: 2, 
        github: "https://github.com/amans8270" 
      }
    ];

    const initialSkills = [
      { name: "LangGraph", category: "AI Architecture", order: 0 },
      { name: "LangChain", category: "AI Architecture", order: 1 },
      { name: "ReAct", category: "AI Architecture", order: 2 },
      { name: "Python", category: "Backend Engine", order: 3 },
      { name: "FastAPI", category: "Backend Engine", order: 4 },
      { name: "Spring Boot", category: "Backend Engine", order: 5 },
      { name: "PostgreSQL", category: "Backend Engine", order: 6 },
      { name: "React", category: "Frontend Craft", order: 7 },
      { name: "Next.js", category: "Frontend Craft", order: 8 },
      { name: "Tailwind CSS", category: "Frontend Craft", order: 9 }
    ];

    const initialResume = {
      content: `Aman Singh
Software Developer
amans8270@gmail.com — +91 9625619590 — Delhi, New Delhi, India
linkedin.com/in/aman-singh-03571713a/

Professional Summary:
IT graduate with a Bachelor’s degree in Information Technology (2022) and over 1.5 years of freelancing experience in software and web development. Skilled in Java, Python, JavaScript, React, and MySQL with strong understanding of front-end and backend development. Experienced in building responsive web applications using React, Angular, NextJs.

The 'Lab' (Projects):
- SQLVerse: An interactive 3D window showing a "Natural Language to SQL" transformation animation. Tech stack: Next.js, FastAPI, LangChain.
- Book Inventory: A clean, 3D grid display of a full-stack CRUD system using MongoDB.
- Muzix App: Full-stack music streaming and management platform. Integrated with external APIs for real-time music discovery. Tech stack: Spring Boot, Angular, MySQL.

Skill Matrix:
- AI Architecture: LangGraph, LangChain, ReAct.
- Backend Engine: Python, FastAPI, Spring Boot, PostgreSQL.
- Frontend Craft: React, Next.js, Tailwind CSS.

Professional Journey:
- Wipro (Project Engineer Trainee): Java Full-Stack development.
- Surya Jyoti (Freelance): 1.5 years of building robust MERN applications.`,
      downloadUrl: 'https://github.com/amans8270',
      updatedAt: new Date().toISOString()
    };

    for (const p of initialProjects) await addDoc(collection(db, 'projects'), p);
    for (const s of initialSkills) await addDoc(collection(db, 'skills'), s);
    await setDoc(doc(db, 'resume', 'main'), initialResume);
    
    alert('Seeding complete!');
  };

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        alert("Authentication failed. Please try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-cyan-400">LOADING_SECURE_ACCESS...</div>;

  if (!user || user.email !== 'amans8270@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="p-8 bg-black/80 border border-cyan-500/30 rounded-2xl text-center max-w-md w-full">
          <Cpu className="mx-auto mb-6 text-cyan-400" size={48} />
          <h2 className="text-2xl font-bold text-white mb-4">ADMIN_LOGIN</h2>
          <p className="text-gray-400 mb-8">Access restricted to authorized personnel only.</p>
          <button 
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full py-4 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? 'INITIALIZING...' : 'INITIALIZE_AUTH'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <header className="flex flex-wrap justify-between items-center mb-12 border-b border-cyan-500/20 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">NEURAL_CONTROL_CENTER</h1>
          <p className="text-cyan-400/60 font-mono text-sm">USER: {user.email}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={seedInitialData} className="px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-all text-xs font-mono">
            SEED_INITIAL_DATA
          </button>
          <button onClick={logout} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2 text-xs font-mono">
            <LogOut size={14} /> TERMINATE
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Resume Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-cyan-400" />
            <h2 className="text-xl font-bold uppercase tracking-widest">Resume_Rag_Context</h2>
          </div>
          <div className="bg-black/40 border border-cyan-500/10 p-6 rounded-2xl space-y-4">
            <div>
              <label className="block text-xs font-mono text-cyan-400/60 mb-2 uppercase">Full Text Context (for AI Agent)</label>
              <textarea 
                value={resume.content}
                onChange={(e) => setResume({ ...resume, content: e.target.value })}
                className="w-full h-64 bg-black/60 border border-cyan-500/20 rounded-xl p-4 text-sm font-mono text-cyan-400 outline-none focus:border-cyan-500/50"
                placeholder="Paste full resume text for AI agent..."
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan-400/60 mb-2 uppercase">Download URL (Google Drive/Dropbox link)</label>
              <input 
                type="text"
                value={resume.downloadUrl}
                onChange={(e) => setResume({ ...resume, downloadUrl: e.target.value })}
                className="w-full bg-black/60 border border-cyan-500/20 rounded-xl p-4 text-sm font-mono text-cyan-400 outline-none focus:border-cyan-500/50"
                placeholder="https://..."
              />
            </div>
            <button 
              onClick={handleSaveResume}
              className="w-full py-4 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} /> SYNC_NEURAL_DATA
            </button>
          </div>

          {/* Skills Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Brain className="text-cyan-400" />
                <h2 className="text-xl font-bold uppercase tracking-widest">Skill_Clusters</h2>
              </div>
              <button onClick={handleAddSkill} className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20">
                <Plus size={20} />
              </button>
            </div>
            <div className="grid gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-black/40 border border-cyan-500/10 p-4 rounded-xl flex items-center gap-4">
                  <input 
                    value={skill.name}
                    onChange={(e) => handleUpdateSkill(skill.id, { name: e.target.value })}
                    className="flex-1 bg-transparent border-none text-white outline-none font-mono"
                  />
                  <select 
                    value={skill.category}
                    onChange={(e) => handleUpdateSkill(skill.id, { category: e.target.value })}
                    className="bg-black/60 border border-cyan-500/20 rounded p-1 text-xs text-cyan-400 outline-none"
                  >
                    <option value="AI Architecture">AI Architecture</option>
                    <option value="Backend Engine">Backend Engine</option>
                    <option value="Frontend Craft">Frontend Craft</option>
                  </select>
                  <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-500/40 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Layout className="text-cyan-400" />
                <h2 className="text-xl font-bold uppercase tracking-widest">Project_Modules</h2>
              </div>
              <button 
                onClick={handleAddProject} 
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all text-sm font-mono"
              >
                <Plus size={18} /> ADD_NEW_PROJECT
              </button>
            </div>
            <p className="text-xs text-cyan-400/40 font-mono mb-6">Click the "+" button to add a new project module. Changes are synced in real-time.</p>
          <div className="space-y-4">
            {projects.length === 0 && (
              <div className="p-12 border-2 border-dashed border-cyan-500/20 rounded-3xl text-center">
                <Layout className="mx-auto mb-4 text-cyan-500/40" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">NO_PROJECTS_FOUND</h3>
                <p className="text-gray-400 mb-6 text-sm">Your portfolio is currently empty. Initialize with your previous projects or start fresh.</p>
                <button 
                  onClick={seedInitialData}
                  className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                >
                  INITIALIZE_WITH_PREVIOUS_PROJECTS
                </button>
              </div>
            )}
            {projects.map((proj) => (
              <div key={proj.id} className="bg-black/40 border border-cyan-500/10 p-6 rounded-2xl space-y-4 relative group">
                <button 
                  onClick={() => handleDeleteProject(proj.id)}
                  className="absolute top-4 right-4 text-red-500/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-cyan-400/40 font-mono">Title</label>
                  <input 
                    value={proj.title}
                    onChange={(e) => handleUpdateProject(proj.id, { title: e.target.value })}
                    className="bg-transparent border-none text-xl font-bold text-white outline-none w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-cyan-400/40 font-mono">Description</label>
                  <textarea 
                    value={proj.desc}
                    onChange={(e) => handleUpdateProject(proj.id, { desc: e.target.value })}
                    className="w-full bg-transparent border-none text-gray-400 text-sm outline-none resize-none h-20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-cyan-400/40 font-mono">GitHub URL</label>
                  <input 
                    value={proj.github}
                    onChange={(e) => handleUpdateProject(proj.id, { github: e.target.value })}
                    className="w-full bg-black/40 border border-cyan-500/20 rounded-lg p-2 text-xs font-mono text-cyan-400 outline-none"
                    placeholder="GitHub URL"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-cyan-400/40 font-mono">Tags (comma separated)</label>
                  <input 
                    value={proj.tags?.join(', ')}
                    onChange={(e) => handleUpdateProject(proj.id, { tags: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full bg-black/40 border border-cyan-500/20 rounded-lg p-2 text-xs font-mono text-cyan-400 outline-none"
                    placeholder="React, AI, etc."
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
