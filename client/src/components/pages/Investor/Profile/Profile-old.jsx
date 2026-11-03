import React, { useState, useEffect } from "react";
import { FileText, Check, Save } from "lucide-react";
import Select from 'react-select';
import API from "../../../../api/axios"; // Path to your new axios file
import { toast } from "react-hot-toast";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    idCard: null,
    proofOfFunds: null,
  });

  // 1. All text fields from your Mongoose Model
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    experienceLevel: "Early Stage",
    bio: "",
    linkedInUrl: "",
    investmentRange: { min: 0, max: 0 },
    sectorsOfInterest: []
  });

  // 2. Track URLs from DB and new files selected by user
  const [dbData, setDbData] = useState({}); // To store existing Cloudinary URLs
  const [selectedFiles, setSelectedFiles] = useState({
    idCard: null,
    proofOfFunds: null,
    profilePicture: null
  });

  // Available sectors of interest
  const sectorOptions = [
    "Fintech",
    "Healthtech",
    "E-commerce",
    "AI/Machine Learning",
    "Blockchain",
    "SaaS",
    "Mobile Apps",
    "IoT",
    "Climate Tech",
    "Edtech",
    "Real Estate",
    "Logistics"
  ];

  // 3. Fetch data directly when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me");
        if (res.data) {
          setDbData(res.data);
          setFormData({
            companyName: res.data.companyName || "",
            position: res.data.position || "",
            experienceLevel: res.data.experienceLevel || "Early Stage",
            bio: res.data.bio || "",
            linkedInUrl: res.data.linkedInUrl || "",
            investmentRange: res.data.investmentRange || { min: 0, max: 0 },
            sectorsOfInterest: res.data.sectorsOfInterest || []
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
      if (key === 'investmentRange') {
        // Handle nested object
        data.append('investmentRange[min]', formData[key].min);
        data.append('investmentRange[max]', formData[key].max);
      } else if (key === 'sectorsOfInterest') {
        // Handle array separately
        formData[key].forEach((sector, idx) => data.append(`sectorsOfInterest[${idx}]`, sector));
      } else {
        data.append(key, formData[key]);
      }
    });

    // Append files only if user picked a new one
    if (selectedFiles.idCard) data.append('idCard', selectedFiles.idCard);
    if (selectedFiles.proofOfFunds) data.append('proofOfFunds', selectedFiles.proofOfFunds);
    if (selectedFiles.profilePicture) data.append('profilePicture', selectedFiles.profilePicture);

    console.log("=== DEBUG: FormData contents ===");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await API.patch("/users/update-investor-profile", data);
      console.log("Server Response:", res.data);
      setDbData(res.data.profile); // Update view with new Cloudinary URLs
      toast.success("Profile Updated Successfully!");
      setSelectedFiles({ idCard: null, proofOfFunds: null, profilePicture: null }); // Clear selected files
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
        <h1 className="text-2xl font-bold">Investor Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your profile details and investment preferences.
        </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white hover:bg-orange-600 transition-colors rounded cursor-pointer">
          {saving ? "Uploading..." : "Save Changes"}
        </button>
      </div>

      {/* Grid: 2 per row desktop, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <UploadCard title="Profile Picture" field="profilePicture" icon={FileText} currentUrl={dbData.profilePicture} />
        <UploadCard title="ID Card" field="idCard" icon={FileText} currentUrl={dbData.idCardUrl} />
        <UploadCard title="Proof of Funds" field="proofOfFunds" icon={FileText} currentUrl={dbData.proofOfFundsUrl} />
      </div>

      {/* Inputs Section */}
      <div className="bg-white/80 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <input className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl  focus:ring-2 focus:ring-yellow-500" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Position</label>
            <input className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl  focus:ring-2 focus:ring-yellow-500" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Experience Level</label>
            <select className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl  focus:ring-2 focus:ring-yellow-500" value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}>
              <option>Early Stage</option>
              <option>Mid Stage</option>
              <option>Late Stage</option>
              <option>All Stages</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <input className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl  focus:ring-2 focus:ring-yellow-500" placeholder="https://linkedin.com/in/..." value={formData.linkedInUrl} onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Investment Range Min ($)</label>
            <input type="number" className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl  focus:ring-2 focus:ring-yellow-500" value={formData.investmentRange.min} onChange={(e) => setFormData({ ...formData, investmentRange: { ...formData.investmentRange, min: parseInt(e.target.value) || 0 } })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Investment Range Max ($)</label>
            <input type="number" className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl  focus:ring-2 focus:ring-yellow-500" value={formData.investmentRange.max} onChange={(e) => setFormData({ ...formData, investmentRange: { ...formData.investmentRange, max: parseInt(e.target.value) || 0 } })} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea rows="4" className="mt-2 w-full p-3 border border-slate-200 bg-white/80 dark:bg-slate-800 rounded-xl  focus:ring-2 focus:ring-yellow-500" placeholder="Tell us about yourself..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium block">Sectors of Interest</label>
          <Select
            isMulti
            options={sectorOptions.map(sector => ({ value: sector, label: sector }))}
            value={formData.sectorsOfInterest.map(sector => ({ value: sector, label: sector }))}
            onChange={(selected) => {
              setFormData({ ...formData, sectorsOfInterest: selected ? selected.map(s => s.value) : [] });
            }}
            placeholder="Search and select sectors..."
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