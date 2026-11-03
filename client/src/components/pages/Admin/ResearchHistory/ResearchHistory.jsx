// import React, { useState, useEffect } from "react";
// import axios from "../../../../api/axios";
// import { Lightbulb, Eye, Pencil, Loader2, X, Globe, Cpu, Target, BookOpen } from "lucide-react";

// export default function ResearchHistory() {
//   const [researchList, setResearchList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // Modal State
//   const [selectedIdea, setSelectedIdea] = useState(null);

//   useEffect(() => {
//     const fetchIdeas = async () => {
//       try {
//         const res = await axios.get("/research/all-research");
//         setResearchList(res.data.data);
//       } catch (err) {
//         console.error("Error fetching research:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchIdeas();
//   }, []);

//   const closeModal = () => setSelectedIdea(null);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 gap-4">
//         <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
//         <p className="text-slate-500">Loading your research history...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Research History</h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400">Manage and preview your AI-extracted research insights.</p>
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {researchList.map((paper) =>
//           paper.extractedIdeas.map((idea, idx) => (
//             <div
//               key={`${paper._id}-${idx}`}
//               className="flex flex-col gap-4 justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300"
//             >
//               <div>
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
//                     <Lightbulb className="w-6 h-6 text-white" />
//                   </div>
//                   <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-lg uppercase">
//                     {paper.category}
//                   </span>
//                 </div>
//                 <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">{idea.ideaTitle}</h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 italic">
//                   {idea.technicalRoadmap}
//                 </p>
//               </div>
//               {/* Inside the card, near the title: */}
//               <div className="flex items-center gap-2">
//                 <div className={`w-2 h-2 rounded-full ${idea.isPublished ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
//                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   {idea.isPublished ? 'Live' : 'Draft'}
//                 </span>
//               </div>

//               <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
//                 {/* PREVIEW BUTTON - Triggers Modal */}
//                 <button
//                   onClick={() => setSelectedIdea({ ...idea, paperTitle: paper.title, category: paper.category })}
//                   className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm"
//                 >
//                   <Eye className="w-4 h-4" /> Preview
//                 </button>
//                 <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-xl font-semibold hover:opacity-90 flex items-center justify-center gap-2 text-sm">
//                   <Pencil className="w-4 h-4" /> Edit
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* ================= MODAL ================= */}
//       {selectedIdea && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">

//             {/* Close Button */}
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <div className="p-8">
//               {/* Header */}
//               <div className="flex gap-5 items-center mb-6">
//                 <div className="h-16 w-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center shrink-0">
//                   <Lightbulb className="w-8 h-8 text-yellow-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
//                     {selectedIdea.ideaTitle}
//                   </h3>
//                   <div className="flex gap-2 mt-2">
//                     <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider">
//                       {selectedIdea.category}
//                     </span>
//                     <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
//                       {selectedIdea.difficulty}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Content Grid */}
//               <div className="space-y-6">
//                 {/* Source Info */}
//                 <div className="flex items-center gap-2 text-xs text-slate-400">
//                   <BookOpen className="w-3 h-3" />
//                   <span>Derived from: <span className="text-slate-600 dark:text-slate-300 font-medium">{selectedIdea.paperTitle}</span></span>
//                 </div>


//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Technical Roadmap */}
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2 text-[#e39622] font-bold text-xs uppercase tracking-widest">
//                       <Cpu className="w-4 h-4" /> Technical Roadmap
//                     </div>
//                     <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
//                       {selectedIdea.technicalRoadmap}
//                     </p>
//                   </div>

//                   {/* Market Potential */}
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
//                       <Target className="w-4 h-4" /> Market Potential
//                     </div>
//                     <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
//                       {selectedIdea.marketPotential}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Tech Stack List */}
//                 <div className="space-y-3 mt-8 pt-6 pb-4 border-t border-slate-100 w-full">
//                   <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
//                     <Globe className="w-4 h-4" /> Recommended Tech Stack
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedIdea.techStack?.map((tech, i) => (
//                       <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300 font-medium">
//                         {tech}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "../../../../api/axios";
import { Lightbulb, Eye, Pencil, Loader2, X, Globe, Cpu, Target, BookOpen, Trash2, Save } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ResearchHistory() {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchIdeas();
  }, []);

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

  const closeModal = () => {
    setSelectedIdea(null);
    setIsEditing(false);
  };

  const handleTogglePublish = async (paperId, ideaId) => {
    try {
      const res = await axios.patch(`/research/toggle-publish/${paperId}/${ideaId}`);
      setResearchList(prev => prev.map(paper => {
        if (paper._id === paperId) {
          paper.extractedIdeas = paper.extractedIdeas.map(idea => 
            idea._id === ideaId ? { ...idea, isPublished: res.data.isPublished } : idea
          );
        }
        return paper;
      }));
      toast.success(res.data.isPublished ? "Published Live" : "Moved to Drafts");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (paperId, ideaId) => {
    if (!window.confirm("Delete this research insight?")) return;
    try {
      await axios.delete(`/research/delete-idea/${paperId}/${ideaId}`);
      setResearchList(prev => prev.map(paper => ({
        ...paper,
        extractedIdeas: paper.extractedIdeas.filter(idea => idea._id !== ideaId)
      })));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedForm = {
        ...editForm,
        techStack: typeof editForm.techStack === 'string' 
          ? editForm.techStack.split(',').map(s => s.trim()) 
          : editForm.techStack
      };
      await axios.put(`/research/update-idea/${selectedIdea.paperId}/${selectedIdea._id}`, updatedForm);
      toast.success("Changes saved!");
      fetchIdeas();
      closeModal();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const startEditing = (idea, paperId, paperTitle) => {
    setSelectedIdea({ ...idea, paperId, paperTitle });
    setEditForm({ ...idea });
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        <p className="text-slate-500">Loading your research history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Research History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage and preview your AI-extracted research insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchList.map((paper) =>
          paper.extractedIdeas.map((idea, idx) => (
            <div
              key={`${paper._id}-${idx}`}
              className="flex flex-col gap-4 justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDelete(paper._id, idea._id)}
                      className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="px-2 py-2 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-lg uppercase">
                      {paper.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">{idea.ideaTitle}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 italic">
                  {idea.technicalRoadmap}
                </p>
              </div>

              {/* TOGGLE FROM IMAGE */}
              <div className="flex items-center justify-between p-1 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold capitalize tracking-wider text-slate-700">
                    {idea.isPublished ? 'Published' : 'Publish'}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleTogglePublish(paper._id, idea._id)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center ${
                    idea.isPublished ? 'bg-[#43b569]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${
                    idea.isPublished ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={() => setSelectedIdea({ ...idea, paperTitle: paper.title, category: paper.category, paperId: paper._id })}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button 
                  onClick={() => startEditing(idea, paper._id, paper.title)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-slate-900 rounded-xl font-semibold hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold dark:text-white">
                  {isEditing ? "Edit Insight" : "Research Insight Preview"}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5 dark:text-slate-400" />
              </button>
            </div>

            {/* SCROLLABLE AREA WITH HIDDEN SCROLLBAR */}
            <div 
              className="p-8 overflow-y-auto"
              style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE/Edge */
              }}
            >
              {/* Webkit specific style to hide scrollbar */}
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {isEditing ? (
                /* EDIT FORM */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400">Idea Title</label>
                      <input 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                        value={editForm.ideaTitle}
                        onChange={(e) => setEditForm({...editForm, ideaTitle: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400">Difficulty Level</label>
                      <select 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                        value={editForm.difficulty}
                        onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Technical Roadmap</label>
                    <textarea 
                      rows={5}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                      value={editForm.technicalRoadmap}
                      onChange={(e) => setEditForm({...editForm, technicalRoadmap: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Market Potential</label>
                    <textarea 
                      rows={5}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                      value={editForm.marketPotential}
                      onChange={(e) => setEditForm({...editForm, marketPotential: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Tech Stack (comma separated)</label>
                    <input 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                      value={Array.isArray(editForm.techStack) ? editForm.techStack.join(', ') : editForm.techStack}
                      onChange={(e) => setEditForm({...editForm, techStack: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={handleSaveEdit} className="flex-1 py-3 bg-yellow-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* PREVIEW CONTENT */
                <div className="space-y-6">
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

                  <button 
                    onClick={() => startEditing(selectedIdea, selectedIdea.paperId, selectedIdea.paperTitle)}
                    className="w-full mt-4 py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  >
                    <Pencil className="w-4 h-4" /> Modify Research Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}