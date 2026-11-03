import React, { useState } from 'react';
import axios from "../../../../api/axios";

const ResearchIdeasPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

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
  const handlePublish = (index) => {
    const updated = { ...aiData };
    updated.extractedIdeas[index].isPublished = true;
    setAiData(updated);
  };

  const handleReject = (index) => {
    const updated = { ...aiData };
    updated.extractedIdeas[index].isRejected = true;
    setAiData(updated);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">

      {/* ================= UPLOAD ================= */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Upload Research Paper</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Paper Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Artificial Intelligence</option>
            <option>HealthTech</option>
            <option>Fintech</option>
          </select>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            {loading ? "Processing..." : "Process Research"}
          </button>
        </form>
      </div>

      {/* ================= RESULT ================= */}
      {aiData && (
        <>
          {/* 🔥 SUMMARY */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">📌 Summary</h3>
            <p>{aiData.summary}</p>
          </div>

          {/* 🔥 IDEAS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiData.extractedIdeas.map((idea, index) => {

              if (idea.isRejected) return null;

              return (
                <div key={index} className="bg-white p-5 rounded-xl shadow border">

                  <h3 className="font-bold text-lg mb-2">
                    💡 {idea.ideaTitle}
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
                    <h4 className="font-semibold text-sm">📘 Roadmap</h4>
                    <p className="text-sm text-gray-600">
                      {idea.technicalRoadmap}
                    </p>
                  </div>

                  {/* MARKET */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm">💰 Market</h4>
                    <p className="text-sm text-gray-600">
                      {idea.marketPotential}
                    </p>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex justify-between">
                    <button className="px-3 py-1 bg-gray-200 rounded">
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleReject(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      ❌ Reject
                    </button>

                    <button
                      onClick={() => handlePublish(index)}
                      className={`px-3 py-1 rounded text-white ${idea.isPublished ? "bg-green-700" : "bg-green-500"
                        }`}
                    >
                      🚀 {idea.isPublished ? "Published" : "Publish"}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ResearchIdeasPage;