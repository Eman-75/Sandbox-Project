import React, { useState, useEffect, useContext } from "react";
import { FileText, Check, Save, User, Lock } from "lucide-react";
import Select from 'react-select';
import API from "../../../../api/axios";
import { toast } from "react-hot-toast";
import NDAViewModal from '../../NDA/NDAViewModal';
import { AuthContext } from '../../../../../context/AuthContext';

function Profile() {
  const { setAuthUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    experienceLevel: "Early Stage",
    bio: "",
    linkedInUrl: "",
    investmentRange: { min: 0, max: 0 },
    sectorsOfInterest: []
  });

  const [dbData, setDbData] = useState({});
  const [ndaRecord, setNdaRecord] = useState(null);
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    idCard: null,
    proofOfFunds: null,
    profilePicture: null
  });

  const sectorOptions = [
    "Fintech", "Healthtech", "E-commerce", "AI/Machine Learning",
    "Blockchain", "SaaS", "Mobile Apps", "IoT", "Climate Tech",
    "Edtech", "Real Estate", "Logistics"
  ];

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

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      setSaving(true);
      await API.post("/users/change-password", {
        currentPassword: passData.oldPassword, // Changed key name here
        newPassword: passData.newPassword
      });
      toast.success("Password changed successfully!");
      setShowPassModal(false);
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleViewNDA = async () => {
    if (!dbData.userId) {
      return toast.error("Unable to locate your investor profile ID.");
    }

    try {
      const res = await API.get(`/nda/status/${dbData.userId}`);
      if (res.data?.isSigned && res.data.nda) {
        setNdaRecord(res.data.nda);
        setShowNdaModal(true);
      } else {
        toast.error("No signed NDA found for your profile.");
      }
    } catch (err) {
      console.error("View NDA error", err);
      toast.error(err.response?.data?.message || "Could not load NDA document");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'investmentRange') {
        data.append('investmentRange[min]', formData[key].min);
        data.append('investmentRange[max]', formData[key].max);
      } else if (key === 'sectorsOfInterest') {
        formData[key].forEach((sector, idx) => data.append(`sectorsOfInterest[${idx}]`, sector));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (selectedFiles.idCard) data.append('idCard', selectedFiles.idCard);
    if (selectedFiles.proofOfFunds) data.append('proofOfFunds', selectedFiles.proofOfFunds);
    if (selectedFiles.profilePicture) data.append('profilePicture', selectedFiles.profilePicture);

    try {
      const res = await API.patch("/users/update-investor-profile", data);
      setDbData(res.data.profile);
      setAuthUser((prev) => (
        prev
          ? { ...prev, profilePicture: res.data.profile?.profilePicture || prev.profilePicture }
          : prev
      ));
      toast.success("Profile Updated Successfully!");
      setSelectedFiles({ idCard: null, proofOfFunds: null, profilePicture: null });
      setIsEditing(false); // Switch back to view mode
    } catch (err) {
      toast.error("Save failed - check console");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-yellow-500">Loading your profile...</div>;

  const UploadCard = ({ title, field, icon: Icon, currentUrl }) => (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all">
      <h3 className="text-base font-bold mb-3">{title}</h3>
      <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed border-yellow-500/50 rounded-xl transition-all ${isEditing ? 'cursor-pointer hover:bg-yellow-500/5' : 'cursor-not-allowed opacity-70'}`}>
        <input
          type="file"
          className="hidden"
          disabled={!isEditing}
          onChange={(e) => setSelectedFiles({ ...selectedFiles, [field]: e.target.files[0] })}
        />
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
            <p className="font-semibold text-slate-900 dark:text-white">Click to upload</p>
          </>
        )}
      </label>
    </div>
  );

  return (
    <>
      <div className="mx-auto p-4 space-y-8">

        {/* Inputs Section */}
        <div className="bg-white/80 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex justify-between items-center pb-10">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={selectedFiles.profilePicture ? URL.createObjectURL(selectedFiles.profilePicture) : (dbData.profilePicture || "https://via.placeholder.com/150")}
                  className="w-20 h-20 rounded-full object-cover border-2 border-yellow-500"
                  alt="Profile"
                />
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer">
                    <span className="text-white text-[10px] font-bold">CHANGE</span>
                    <input type="file" className="hidden" onChange={(e) => setSelectedFiles({ ...selectedFiles, profilePicture: e.target.files[0] })} />
                  </label>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{localStorage.getItem("name") || "Investor Profile"}</h1>
                <p className="text-sm text-slate-500">{dbData.email || "Manage your details"}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleViewNDA}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl font-semibold transition-all border border-slate-200 dark:border-slate-700"
                  >
                    <FileText className="w-4 h-4" />
                    View NDA Document
                  </button>
                  <button
                    onClick={() => setShowPassModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl font-semibold transition-all border border-slate-200 dark:border-slate-700"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                  <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white hover:opacity-90 transition-opacity rounded-xl font-semibold cursor-pointer shadow-lg shadow-orange-500/20">
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-slate-500 font-medium hover:text-slate-700 transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white hover:opacity-90 transition-opacity rounded-xl font-semibold cursor-pointer shadow-lg shadow-orange-500/20">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <input
                disabled={!isEditing}
                className={`mt-2 w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${!isEditing ? 'bg-slate-50 cursor-not-allowed opacity-75' : 'bg-white/80 dark:bg-slate-800'}`}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <input
                disabled={!isEditing}
                className={`mt-2 w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${!isEditing ? 'bg-slate-50 cursor-not-allowed opacity-75' : 'bg-white/80 dark:bg-slate-800'}`}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Level</label>
              <select
                disabled={!isEditing}
                className={`mt-2 w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${!isEditing ? 'bg-slate-50 cursor-not-allowed opacity-75' : 'bg-white/80 dark:bg-slate-800'}`}
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              >
                <option>Early Stage</option>
                <option>Mid Stage</option>
                <option>Late Stage</option>
                <option>All Stages</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn URL</label>
              <input
                disabled={!isEditing}
                className={`mt-2 w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${!isEditing ? 'bg-slate-50 cursor-not-allowed opacity-75' : 'bg-white/80 dark:bg-slate-800'}`}
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedInUrl}
                onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Range Min ($)</label>
              <input
                disabled={!isEditing}
                type="number"
                className={`mt-2 w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${!isEditing ? 'bg-slate-50 cursor-not-allowed opacity-75' : 'bg-white/80 dark:bg-slate-800'}`}
                value={formData.investmentRange.min}
                onChange={(e) => setFormData({ ...formData, investmentRange: { ...formData.investmentRange, min: parseInt(e.target.value) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Range Max ($)</label>
              <input
                disabled={!isEditing}
                type="number"
                className={`mt-2 w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${!isEditing ? 'bg-slate-50 cursor-not-allowed opacity-75' : 'bg-white/80 dark:bg-slate-800'}`}
                value={formData.investmentRange.max}
                onChange={(e) => setFormData({ ...formData, investmentRange: { ...formData.investmentRange, max: parseInt(e.target.value) || 0 } })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              disabled={!isEditing}
              rows="4"
              className={`mt-2 w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all ${!isEditing ? 'bg-slate-50 cursor-not-allowed opacity-75' : 'bg-white/80 dark:bg-slate-800'}`}
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium block">Sectors of Interest</label>
            <Select
              isMulti
              isDisabled={!isEditing}
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
                  backgroundColor: isEditing ? '#fffefd' : '#f8fafc',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '0.25rem',
                  minHeight: '44px',
                  opacity: isEditing ? 1 : 0.8,
                  '&:hover': { borderColor: 'rgb(226, 232, 240)' }
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menuList: (base) => ({
                  ...base,
                  backgroundColor: 'rgb(226, 232, 240)',
                  borderRadius: '0.75rem'
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? 'rgb(234, 179, 8)' : state.isFocused ? 'rgb(241, 245, 249)' : 'rgb(226, 232, 240)',
                  color: state.isSelected ? 'white' : 'black',
                  cursor: 'pointer'
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: 'rgb(234, 179, 8)',
                  borderRadius: '0.375rem'
                }),
                multiValueLabel: (base) => ({ ...base, color: 'white', fontWeight: '500' }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'white',
                  '&:hover': { backgroundColor: '#e39622', color: 'white' }
                })
              }}
            />
          </div>
        </div>

        {/* Grid: 2 per row desktop, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-10">
          <UploadCard title="ID Card" field="idCard" icon={FileText} currentUrl={dbData.idCardUrl} />
          <UploadCard title="Proof of Funds" field="proofOfFunds" icon={FileText} currentUrl={dbData.proofOfFundsUrl} />
        </div>
      </div>

      {/* Add this inside your return, right before the last </div> */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Change Password</h2>
            <p className="text-slate-500 text-sm mb-6">Enter your details to secure your account.</p>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">Current Password</label>
                <input
                  type="password" required
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">New Password</label>
                <input
                  type="password" required
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">Confirm New Password</label>
                <input
                  type="password" required
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="flex-1 py-3 font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-[#e39622] to-[#ffb347] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-orange-500/20"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NDAViewModal
        isOpen={showNdaModal}
        onClose={() => setShowNdaModal(false)}
        nda={ndaRecord}
        senderName="SandBox"
        receiverName={localStorage.getItem('name') || 'Investor'}
      />
    </>

  );

}

export default Profile;
