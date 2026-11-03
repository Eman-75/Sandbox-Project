import React, { useState, useEffect } from "react";
import axios from "../../../../api/axios";
import { Lightbulb, Eye, Loader2, X, Globe, Cpu, Target, BookOpen } from "lucide-react";

export default function InnovationVault() {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get("/research/all-research");
        setResearchList(res.data.data);
      } catch (err) {
        console.error("Error fetching research:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const closeModal = () => setSelectedIdea(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium animate-pulse">Accessing Extraordinary Insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Innovation Vault</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          A curated collection of high-impact research insights and market opportunities.
        </p>
      </div>

      {/* Grid - Only showing Published Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchList.map((paper) =>
          paper.extractedIdeas
            .filter((idea) => idea.isPublished === true) // 🔥 Only show Published
            .map((idea, idx) => (
              <div
                key={`${paper._id}-${idx}`}
                className="group relative flex flex-col gap-4 justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-l hover:-translate-y-2 transition-all duration-500"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2 py-2 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-lg uppercase">
                      {paper.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">{idea.ideaTitle}</h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 italic">
                    {idea.technicalRoadmap}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-green-600">Validated</span>
                  </div>

                  <button
                    onClick={() => setSelectedIdea({ ...idea, paperTitle: paper.title, category: paper.category })}
                    className="flex items-center gap-2 text-sm font-bold text-yellow-600 hover:text-yellow-600 cursor-pointer transition-colors"
                  >
                    Explore Insight <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>



      {/* Empty State */}
      {researchList.every(p => p.extractedIdeas.filter(i => i.isPublished).length === 0) && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-400 font-medium">New extraordinary ideas are currently being processed...</p>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Navigation */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold dark:text-white">Research Insight</span>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5 dark:text-slate-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              className="p-10 overflow-y-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-3 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                        {selectedIdea.ideaTitle}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider">
                          {selectedIdea.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                          {selectedIdea.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <BookOpen className="w-3 h-3" />
                    <span>Derived from: <span className="text-slate-600 dark:text-slate-300 font-medium">{selectedIdea.paperTitle}</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#e39622] font-bold text-xs uppercase tracking-widest">
                      <Cpu className="w-4 h-4" /> Technical Roadmap
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedIdea.technicalRoadmap}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
                      <Target className="w-4 h-4" /> Market Potential
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedIdea.marketPotential}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <Globe className="w-4 h-4" /> Recommended Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea.techStack?.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}