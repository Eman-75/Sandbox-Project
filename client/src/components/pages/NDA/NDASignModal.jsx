import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, FileSignature, Trash2, Upload, PenTool } from 'lucide-react';
import API from '../../../api/axios';
import { toast } from 'react-hot-toast';

const NDASignModal = ({ isOpen, onClose, receiver, onSignComplete }) => {
    const sigPad = useRef({});
    const [agreed, setAgreed] = useState(false);
    const [signatureType, setSignatureType] = useState('draw'); // 'draw' or 'upload'
    const [uploadedImage, setUploadedImage] = useState(null);

    if (!isOpen) return null;

    // Clear the drawing canvas
    const clearCanvas = () => {
        sigPad.current.clear();
    };

    // Handle File Upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2000000) {
                return toast.error("File is too large. Please upload an image under 2MB.");
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSign = async () => {
        let finalSignature = null;

        if (signatureType === 'draw') {
            if (sigPad.current.isEmpty()) return toast.error("Please provide a signature");
            finalSignature = sigPad.current.getCanvas().toDataURL('image/png');
        } else {
            if (!uploadedImage) return toast.error("Please upload a signature image");
            finalSignature = uploadedImage;
        }

        if (!agreed) return toast.error("Please agree to the legal terms");

        try {
            const res = await API.post('/nda/sign', {
                signatureData: finalSignature
            });

            if (res.data.success) {
                toast.success("NDA Signed Successfully!");
                onSignComplete();
                onClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save NDA");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <FileSignature className="text-[#e39622]" />
                        <h2 className="text-xl font-bold dark:text-white">Legal Agreement</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 dark:text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Agreement Text */}
                    <div className="h-32 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                        <p className="font-bold mb-1">Confidentiality Agreement (NDA)</p>
                        <p>By signing this, you agree not to share any project details, source code, or business strategies discussed with <strong>{receiver?.name || 'the SandBox platform'}</strong>. Any breach of this agreement may lead to legal action as per the electronic signature laws of 2026.</p>
                    </div>

                    {/* Toggle Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <button 
                            onClick={() => setSignatureType('draw')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${signatureType === 'draw' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                        >
                            <PenTool className="w-4 h-4" /> Draw
                        </button>
                        <button 
                            onClick={() => setSignatureType('upload')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${signatureType === 'upload' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                        >
                            <Upload className="w-4 h-4" /> Upload
                        </button>
                    </div>

                    {/* Signature Area */}
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-white overflow-hidden">
                        {signatureType === 'draw' ? (
                            <>
                                <SignatureCanvas 
                                    ref={sigPad} 
                                    canvasProps={{ className: "w-full h-40 cursor-crosshair" }} 
                                />
                                <button 
                                    onClick={clearCanvas}
                                    className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg text-xs font-semibold transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Clear
                                </button>
                            </>
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center p-4">
                                {uploadedImage ? (
                                    <div className="relative h-full w-full flex items-center justify-center">
                                        <img src={uploadedImage} alt="Uploaded sign" className="max-h-full object-contain" />
                                        <button onClick={() => setUploadedImage(null)} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center group">
                                        <div className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-[#e39622]/10 transition-colors">
                                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#e39622]" />
                                        </div>
                                        <span className="mt-2 text-sm text-slate-500">Click to upload signature (PNG/JPG)</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Agreement Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            className="mt-1 w-4 h-4 rounded border-slate-300 text-[#e39622] focus:ring-[#e39622]" 
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                            I understand that this is a legally binding electronic signature and I agree to the terms of the Non-Disclosure Agreement.
                        </span>
                    </label>

                    {/* Action Button */}
                    <button
                        onClick={handleSign}
                        className="w-full py-4 bg-gradient-to-r from-[#e39622] to-[#ffb347] hover:from-[#d18a1f] hover:to-[#f0a73d] text-slate-900 rounded-2xl font-bold shadow-lg shadow-[#e39622]/20 transition-all transform active:scale-[0.98]"
                    >
                        Confirm Signature
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NDASignModal;
