import React, { useState } from 'react';
import axios from "../../../../api/axios";
import { File, FileText, Lightbulb, Upload, X, Cpu, Target, Globe, Pencil, Save } from 'lucide-react';
import { toast } from "react-hot-toast";

const ResearchIdeasPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select PDF");

    setLoading(true);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('uploadedBy', "65f123abc456def789012345");

    try {
      const res = await axios.post(
        '/research/upload-research',
        formData
      );

      setAiData(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error processing file");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI ONLY (later connect API)


  const handlePublish = async (idea) => {
    try {
      const res = await axios.patch(
        `/research/toggle-publish/${aiData._id}/${idea._id}`
      );

      setAiData(prev => ({
        ...prev,
        extractedIdeas: prev.extractedIdeas.map(i =>
          i._id === idea._id
            ? { ...i, isPublished: res.data.isPublished }
            : i
        )
      }));

      toast.success("Publish status updated 🚀");
    } catch (err) {
      toast.error("Failed to update publish");
    }
  };

  const handleReject = async (idea) => {
    try {
      await axios.delete(
        `/research/delete-idea/${aiData._id}/${idea._id}`
      );

      setAiData(prev => ({
        ...prev,
        extractedIdeas: prev.extractedIdeas.filter(
          i => i._id !== idea._id
        )
      }));

      toast.success("Idea removed 🗑️");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const { paperId, ideaId } = selectedIdea;

      const res = await axios.put(
        `/research/update-idea/${paperId}/${ideaId}`,
        {
          ...editForm,
          techStack: typeof editForm.techStack === "string"
            ? editForm.techStack.split(",").map(t => t.trim())
            : editForm.techStack
        }
      );

      setAiData(res.data.data);

      toast.success("Idea updated successfully ✅");

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ❌");
    }
  };

  const closeModal = () => {
    setSelectedIdea(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ================= UPLOAD ================= */}

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Upload Research Paper</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-sm font-medium">Paper Title</label>
          <input
            type="text"
            placeholder="Title of your research paper"
            className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="text-sm font-medium">Category</label>
          <select
            className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Artificial Intelligence</option>
            <option>Health Care</option>
            <option>Fintech</option>
          </select>
          {!previewUrl ? (<label
            htmlFor="researchFile"
            className="block w-full border-2 border-dashed border-yellow-500 rounded-2xl p-12 text-center cursor-pointer hover:border-yellow-600 transition-colors"
          >
            <input
              type="file"
              accept="application/pdf"
              id="researchFile"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);

                if (selectedFile) {
                  const url = URL.createObjectURL(selectedFile);
                  setPreviewUrl(url);
                }
              }}
            />
            <Upload className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold mb-2">
              Click to upload your research paper
            </p>
            <p className="text-gray-400 text-sm">PDF only (MAX. 20MB)</p>
          </label>) : (

            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">

              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                {/* ICON */}
                <div className="w-12 h-12 bg-[#fffcf6] border border-yellow-500 flex items-center justify-center rounded-xl">
                  <span className="text-red-500 text-2xl"><FileText className="w-6 h-6 text-yellow-500 mx-auto " /></span>
                </div>

                {/* FILE INFO */}
                <div>
                  <p className="font-semibold text-gray-800 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-green-600">
                    File uploaded successfully
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE BUTTONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          )}


          <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-500 text-slate-900 font-semibold rounded-xl w-full hover:from-yellow-500 hover:to-yellow-500 transition-all duration-300 shadow shadow-yellow-500/20 cursor-pointer">
            {loading ? "Generating..." : "Generate Ideas"}
          </button>
        </form>
      </div >

      {/* ================= RESULT ================= */}
      {
        aiData && (
          <>
            {/* 🔥 SUMMARY */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📌 Summary</h3>
              <p>{aiData.summary}</p>
            </div>

            {/* 🔥 IDEAS */}
            <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
              {aiData.extractedIdeas.map((idea, index) => {

                if (idea.isRejected) return null;

                return (
                  <div key={index} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300">
                    <div className=" flex gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      {idea.ideaTitle}
                    </h3>

                    <p className="text-sm text-gray-500 mb-2">
                      {idea.difficulty}
                    </p>

                    {/* TECH STACK */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {idea.techStack?.map((tech, i) => (
                        <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* ROADMAP */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-sm">Roadmap</h4>
                      <p className="text-sm text-gray-600">
                        {idea.technicalRoadmap}
                      </p>
                    </div>

                    {/* MARKET */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm"> Market</h4>
                      <p className="text-sm text-gray-600">
                        {idea.marketPotential}
                      </p>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setSelectedIdea({
                            ...idea,
                            index,
                            paperId: aiData._id,
                            ideaId: idea._id
                          });
                          setEditForm({ ...idea });
                          setIsEditing(true);
                        }}
                        className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleReject(idea)}
                        className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handlePublish(idea)}
                        disabled={idea.isPublished}
                        className={`px-3 py-1 rounded text-white cursor-pointer ${idea.isPublished ? "bg-green-700 cursor-not-allowed" : "bg-green-500"
                          }`}
                      >
                        {idea.isPublished ? "Published" : "Publish"}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </>
        )
      }

      {/*==== MODAL ==== */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl">

            {/* HEADER */}
            <div className="p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">Edit Idea</h2>
              </div>

              <button
                onClick={() => setSelectedIdea(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-gray-400">TITLE</label>
                <input
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={editForm.ideaTitle}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ideaTitle: e.target.value })
                  }
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs font-bold text-gray-400">DIFFICULTY</label>
                <select
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={editForm.difficulty}
                  onChange={(e) =>
                    setEditForm({ ...editForm, difficulty: e.target.value })
                  }
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {/* Roadmap */}
              <div>
                <label className="text-xs font-bold text-gray-400">ROADMAP</label>
                <textarea
                  rows={6}
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={editForm.technicalRoadmap}
                  onChange={(e) =>
                    setEditForm({ ...editForm, technicalRoadmap: e.target.value })
                  }
                />
              </div>

              {/* Market */}
              <div>
                <label className="text-xs font-bold text-gray-400">MARKET</label>
                <textarea
                  rows={6}
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={editForm.marketPotential}
                  onChange={(e) =>
                    setEditForm({ ...editForm, marketPotential: e.target.value })
                  }
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="text-xs font-bold text-gray-400">TECH STACK</label>
                <input
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={
                    Array.isArray(editForm.techStack)
                      ? editForm.techStack.join(", ")
                      : editForm.techStack
                  }
                  onChange={(e) =>
                    setEditForm({ ...editForm, techStack: e.target.value })
                  }
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2 bg-yellow-500 text-white rounded-lg font-semibold"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setSelectedIdea(null)}
                  className="flex-1 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default ResearchIdeasPage;