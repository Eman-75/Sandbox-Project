// import React, { useState } from "react";
// import { Upload, FileText, Video, File, Check } from "lucide-react";

// function Profile() {
//   const [uploadedFiles, setUploadedFiles] = useState({
//     universityCard: null,
//     finalYearProject: null,
//     projectVideo: null,
//     resume: null,
//   });

//   const handleFileUpload = (field, event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setUploadedFiles((prev) => ({
//         ...prev,
//         [field]: file,
//       }));
//     }
//   };

//   const profileTasks = [
//     {
//       id: "basicInfo",
//       title: "Basic Information",
//       description: "Name, email, and contact details",
//       completed: true,
//     },
//     {
//       id: "universityCard",
//       title: "University Card",
//       description: "Upload your university ID card",
//       completed: uploadedFiles.universityCard !== null,
//     },
//     {
//       id: "finalYearProject",
//       title: "Final Year Project",
//       description: "Upload project files and documentation",
//       completed: uploadedFiles.finalYearProject !== null,
//     },
//     {
//       id: "projectVideo",
//       title: "Project Video",
//       description: "Add a video presentation of your project",
//       completed: uploadedFiles.projectVideo !== null,
//     },
//     {
//       id: "resume",
//       title: "Resume",
//       description: "Upload your latest resume/CV",
//       completed: uploadedFiles.resume !== null,
//     },
//   ];

//   const completedCount = profileTasks.filter((t) => t.completed).length;
//   const completionPercentage = (completedCount / profileTasks.length) * 100;

//   const UploadCard = ({ title, field, accept, icon: Icon, helper }) => (
//     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all">
//       <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
//         {title}
//       </h2>

//       <label
//         htmlFor={field}
//         className="block w-full border-2 border-dashed border-yellow-500/50 rounded-xl p-10 text-center cursor-pointer hover:border-yellow-600 transition"
//       >
//         <input
//           type="file"
//           id={field}
//           accept={accept}
//           className="hidden"
//           onChange={(e) => handleFileUpload(field, e)}
//         />

//         {uploadedFiles[field] ? (
//           <>
//             <Icon className="w-14 h-14 text-yellow-500 mx-auto mb-3" />
//             <p className="font-semibold text-slate-900 dark:text-white">
//               {uploadedFiles[field].name}
//             </p>
//             <p className="text-xs text-slate-500 mt-1">
//               Click to change file
//             </p>
//           </>
//         ) : (
//           <>
//             <Icon className="w-14 h-14 text-yellow-500 mx-auto mb-3" />
//             <p className="font-semibold text-slate-900 dark:text-white">
//               Click to upload
//             </p>
//             <p className="text-xs text-slate-500 mt-1">{helper}</p>
//           </>
//         )}
//       </label>
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
//           My Profile
//         </h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400">
//           Complete your profile to increase visibility
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Upload Section */}
//         <div className="lg:col-span-2 space-y-6">
//           <UploadCard
//             title="University Card"
//             field="universityCard"
//             accept=".png,.jpg,.jpeg,.pdf"
//             icon={FileText}
//             helper="PNG, JPG or PDF (MAX 5MB)"
//           />

//           <UploadCard
//             title="Final Year Project"
//             field="finalYearProject"
//             accept=".pdf,.docx,.zip"
//             icon={FileText}
//             helper="PDF, DOCX or ZIP (MAX 20MB)"
//           />

//           <UploadCard
//             title="Project Video"
//             field="projectVideo"
//             accept=".mp4,.mov,.avi"
//             icon={Video}
//             helper="MP4, MOV, AVI (MAX 50MB)"
//           />

//           <UploadCard
//             title="Resume"
//             field="resume"
//             accept=".pdf,.doc,.docx"
//             icon={File}
//             helper="PDF, DOC, DOCX (MAX 5MB)"
//           />
//         </div>

//         {/* Profile Completion */}
//         <div className="lg:col-span-1">
//           <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 sticky top-6">
//             <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
//               Profile Completion
//             </h2>

//             <div className="mb-4">
//               <div className="flex justify-between text-xs text-slate-500 mb-1">
//                 <span>{Math.round(completionPercentage)}%</span>
//               </div>
//               <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
//                 <div
//                   className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all"
//                   style={{ width: `${completionPercentage}%` }}
//                 />
//               </div>
//             </div>

//             <p className="text-xs text-slate-500 mb-6">
//               Complete all steps to unlock full platform features.
//             </p>

//             <div className="space-y-4">
//               {profileTasks.map((task) => (
//                 <div key={task.id} className="flex gap-3">
//                   {task.completed ? (
//                     <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
//                       <Check className="w-3 h-3 text-black" />
//                     </div>
//                   ) : (
//                     <div className="w-5 h-5 rounded-full border-2 border-slate-400" />
//                   )}

//                   <div className="flex-1">
//                     <p
//                       className={`text-sm font-medium ${
//                         task.completed
//                           ? "text-slate-900 dark:text-white"
//                           : "text-slate-500"
//                       }`}
//                     >
//                       {task.title}
//                     </p>
//                     <p className="text-xs text-slate-400">
//                       {task.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;



import React, { useState, useEffect } from "react";
import { FileText, Video, File, Check, Save } from "lucide-react";
import Select from 'react-select';
import API from "../../../../api/axios"; // Path to your new axios file
import { toast } from "react-hot-toast";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    universityCard: null,
    finalYearProject: null,
    projectVideo: null,
    resume: null,
  });

  // 1. All text fields from your Mongoose Model
  const [formData, setFormData] = useState({
    universityName: "",
    department: "",
    registrationNo: "",
    degreeLevel: "Bachelors",
    bio: "",
    portfolioUrl: "",
    interestCategories: []
  });

  // 2. Track URLs from DB and new files selected by user
  const [dbData, setDbData] = useState({}); // To store existing Cloudinary URLs
  const [selectedFiles, setSelectedFiles] = useState({
    universityCard: null,
    resume: null,
    fypFile: null,
    profilePicture: null
  });

  // Available interest categories
  const interestOptions = [
    "Web Development",
    "Mobile Apps",
    "AI/Machine Learning",
    "Data Science",
    "Blockchain",
    "Cloud Computing",
    "IoT",
    "Cybersecurity"
  ];

  // 3. Fetch data directly when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me");
        if (res.data) {
          setDbData(res.data);
          setFormData({
            universityName: res.data.universityName || "",
            department: res.data.department || "",
            registrationNo: res.data.registrationNo || "",
            degreeLevel: res.data.degreeLevel || "Bachelors",
            bio: res.data.bio || "",
            portfolioUrl: res.data.portfolioUrl || "",
            interestCategories: res.data.interestCategories || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast.error("Could not load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const data = new FormData();

    // Append text fields
    Object.keys(formData).forEach(key => {
      if (key === 'interestCategories') {
        // Handle array separately
        formData[key].forEach((cat, idx) => data.append(`interestCategories[${idx}]`, cat));
      } else {
        data.append(key, formData[key]);
      }
    });

    // Append files only if user picked a new one
    if (selectedFiles.universityCard) data.append('universityCard', selectedFiles.universityCard);
    if (selectedFiles.resume) data.append('resume', selectedFiles.resume);
    if (selectedFiles.fypFile) data.append('fypFile', selectedFiles.fypFile);
    if (selectedFiles.profilePicture) data.append('profilePicture', selectedFiles.profilePicture);

    console.log("=== DEBUG: FormData contents ===");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await API.patch("/users/update-student-profile", data);
      console.log("Server Response:", res.data);
      setDbData(res.data.profile); // Update view with new Cloudinary URLs
      toast.success("Profile Updated Successfully!");
      setSelectedFiles({ universityCard: null, resume: null, fypFile: null }); // Clear selected files
    } catch (err) {
      console.error("Frontend Save Error:", err);
      console.error("Error Response Status:", err.response?.status);
      console.error("Error Response Data:", err.response?.data);
      console.error("Error Message:", err.message);
      toast.error("Save failed - check console");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-yellow-500">Loading your profile...</div>;

  const UploadCard = ({ title, field, icon: Icon, currentUrl }) => (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all">
      <h3 className="text-base font-bold mb-3">{title}</h3>
      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-yellow-500/50 rounded-xl cursor-pointer hover:bg-yellow-500/5 transition-all">
        <input type="file" className="hidden" onChange={(e) => setSelectedFiles({ ...selectedFiles, [field]: e.target.files[0] })} />
        {selectedFiles[field] || currentUrl ? (
          <div className="flex flex-col items-center">
            <Check className="w-8 h-8 text-green-500" />
            <span className="text-[12px] mt-2 text-slate-500 truncate w-32 text-center">
              {selectedFiles[field] ? selectedFiles[field].name : "File Uploaded"}
            </span>
          </div>
        ) : (
          <>
            <Icon className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-900 dark:text-white">
              Click to upload
            </p>
          </>
        )}
      </label>
    </div>
  );

  return (
    <div className="mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
        <h1 className="text-2xl font-bold">Student Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your profile details and personal information. 
        </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white hover:bg-orange-600 transition-colors rounded cursor-pointer">
          {saving ? "Uploading..." : "Save Changes"}
        </button>
      </div>

      {/* Grid: 2 per row desktop, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <UploadCard title="Profile Picture" field="profilePicture" icon={FileText} currentUrl={dbData.profilePicture} />
        <UploadCard title="University ID" field="universityCard" icon={FileText} currentUrl={dbData.universityCardUrl} />
        <UploadCard title="Latest Resume" field="resume" icon={File} currentUrl={dbData.resumeUrl} />
        <UploadCard title="FYP Project File" field="fypFile" icon={Video} currentUrl={dbData.fypFileUrl} />
      </div>

      {/* Inputs Section */}
      <div className="bg-white/80 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">University Name</label>
            <input className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-500" value={formData.universityName} onChange={(e) => setFormData({ ...formData, universityName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <input className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-500" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Registration No</label>
            <input className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-500" value={formData.registrationNo} onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Degree Level</label>
            <select className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-500" value={formData.degreeLevel} onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}>
              <option>Bachelors</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Portfolio URL</label>
            <input className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-500" placeholder="https://..." value={formData.portfolioUrl} onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea rows="4" className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-500" placeholder="Tell us about yourself..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium block">Interest Categories</label>
          <Select
            isMulti
            options={interestOptions.map(cat => ({ value: cat, label: cat }))}
            value={formData.interestCategories.map(cat => ({ value: cat, label: cat }))}
            onChange={(selected) => {
              setFormData({ ...formData, interestCategories: selected ? selected.map(s => s.value) : [] });
            }}
            placeholder="Search and select your interests..."
            menuPortalTarget={document.body}
            menuPosition="fixed"
            classNamePrefix="react-select"
            className="text-sm"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#fffefd',
                borderColor: '#e2e8f0',
                borderRadius: '0.75rem',
                padding: '0.25rem',
                minHeight: '44px',
                '&:hover': { borderColor: 'rgb(226, 232, 240)' },
                '&:focus': { borderColor: 'rgb(226, 232, 240)' }
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999
              }),
              menuList: (base) => ({
                ...base,
                backgroundColor: 'rgb(226, 232, 240)',
                borderRadius: '0.75rem'
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? 'rgb(234, 179, 8)' : state.isFocused ? 'rgb(241, 245, 249)' : 'rgb(226, 232, 240)',
                color: state.isSelected ? 'white' : 'black',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgb(241, 245, 249)' }
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: 'rgb(234, 179, 8)',
                borderRadius: '0.375rem'
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: 'white',
                fontWeight: '500'
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: 'white',
                '&:hover': { backgroundColor: '#e39622', color: 'white' }
              })
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;