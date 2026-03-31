import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Send, Download, Github, Linkedin } from 'lucide-react';
import { askAmanAgent } from '../services/geminiService';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TerminalFooter() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['Welcome to Aman\'s Neural Terminal.', 'Type "send" to submit your message, "agent [question]" to ask my AI, or "help" for commands.']);
  const [isSent, setIsSent] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchResume = async () => {
      const snap = await getDoc(doc(db, 'resume', 'main'));
      if (snap.exists()) setResumeData(snap.data());
    };
    fetchResume();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, isSent]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullInput = input.trim();
    const cmd = fullInput.toLowerCase();
    
    if (cmd === 'send') {
      setHistory(prev => [...prev, `> ${fullInput}`, 'System: Message transmission initiated...', 'System: Success. Aman will be notified.']);
      setIsSent(true);
      setInput('');
    } else if (cmd.startsWith('agent ')) {
      const question = fullInput.slice(6);
      setHistory(prev => [...prev, `> ${fullInput}`, 'System: Querying Neural Agent...']);
      const response = await askAmanAgent(question, resumeData?.content || "Aman Singh is an AI Engineer and Full-Stack Developer with experience at Wipro and freelance projects.");
      setHistory(prev => [...prev, `Agent: ${response}`]);
      setInput('');
    } else if (cmd === 'help') {
      setHistory(prev => [...prev, `> ${fullInput}`, 'Available commands: send, agent [question], clear, help, about, resume']);
      setInput('');
    } else if (cmd === 'clear') {
      setHistory([]);
      setIsSent(false);
      setInput('');
    } else if (cmd === 'resume') {
      if (resumeData?.downloadUrl) {
        window.open(resumeData.downloadUrl, '_blank');
        setHistory(prev => [...prev, `> ${fullInput}`, 'System: Opening resume download link...']);
      } else {
        setHistory(prev => [...prev, `> ${fullInput}`, 'System: Resume download URL not configured.']);
      }
      setInput('');
    } else if (cmd === 'about') {
      setHistory(prev => [...prev, `> ${fullInput}`, 'Aman Singh: AI Engineer & Full-Stack Developer. Architecting agentic futures.']);
      setInput('');
    } else {
      setHistory(prev => [...prev, `> ${fullInput}`, `Command not found: ${cmd}`]);
      setInput('');
    }
  };

  return (
    <footer className="w-full py-20 px-4 flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent opacity-30" />
      
      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter">CONNECT_VIA_TERMINAL</h2>
          <p className="text-cyan-400/60 font-mono text-sm">ESTABLISHING SECURE CHANNEL...</p>
        </div>

        <div 
          className="bg-black/80 border border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(0,243,255,0.2)]"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="bg-cyan-500/10 px-4 py-2 border-b border-cyan-500/30 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="ml-2 text-xs font-mono text-cyan-400/50">bash — 80x24</span>
          </div>
          
          <div 
            ref={scrollRef}
            className="h-64 p-4 font-mono text-sm overflow-y-auto scrollbar-hide text-cyan-400"
          >
            {history.map((line, i) => (
              <div key={i} className="mb-1">
                {line.startsWith('>') ? (
                  <span className="text-white">{line}</span>
                ) : line.startsWith('System:') ? (
                  <span className="text-green-400">{line}</span>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            ))}
            {isSent && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded text-center text-xs"
              >
                TRANSMISSION COMPLETE. AGENT AMAN WILL RESPOND SHORTLY.
              </motion.div>
            )}
          </div>

          <form onSubmit={handleCommand} className="p-4 border-top border-cyan-500/30 flex items-center gap-2">
            <span className="text-cyan-400 font-mono">$</span>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
              placeholder="Type command..."
              autoFocus
            />
            <button type="submit" className="text-cyan-500 hover:text-cyan-400 transition-colors">
              <Send size={16} />
            </button>
          </form>
        </div>

        <div className="mt-12 flex justify-center gap-8">
          <a href="https://github.com/amans8270" target="_blank" rel="noopener noreferrer" className="text-cyan-400/60 hover:text-cyan-400 transition-colors flex items-center gap-2 font-mono text-sm">
            <Github size={16} /> GITHUB
          </a>
          <a href="https://www.linkedin.com/in/aman-singh-03571713a/" target="_blank" rel="noopener noreferrer" className="text-cyan-400/60 hover:text-cyan-400 transition-colors flex items-center gap-2 font-mono text-sm">
            <Linkedin size={16} /> LINKEDIN
          </a>
          {resumeData?.downloadUrl && (
            <a href={resumeData.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400/60 hover:text-cyan-400 transition-colors flex items-center gap-2 font-mono text-sm">
              <Download size={16} /> RESUME
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
