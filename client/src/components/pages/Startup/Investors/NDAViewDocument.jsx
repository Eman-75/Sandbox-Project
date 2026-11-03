import React, { useRef, useEffect } from 'react';
import { X, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createPortal } from 'react-dom';
import NDADocument from '../../NDA/NDADocument';

const NDAViewModal = ({ isOpen, onClose, nda, senderName, receiverName }) => {
  const printRef = useRef();

  if (!isOpen || !nda) return null;

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`NDA_${receiverName}_${new Date().toLocaleDateString()}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4 sm:p-8">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 sticky top-0 z-[160] bg-slate-900/80 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <h2 className="text-white font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Official Agreement
        </h2>
        <div className="flex gap-2">
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#e39622] hover:bg-[#c7831d] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#e39622]/20">
            <Download size={18} /> Download PDF
          </button>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>
      <div ref={printRef} className="w-full max-w-3xl bg-white shadow-2xl rounded-md overflow-hidden">
        <NDADocument nda={nda} senderName={senderName} receiverName={receiverName} />
      </div>
    </div>
  );

  // return (
  //   <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex flex-col items-center overflow-y-auto p-4 sm:p-8">
  //     <div className="w-full max-w-3xl flex justify-between items-center mb-6 sticky top-0 z-[160] bg-slate-900/80 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
  //       <h2 className="text-white font-bold flex items-center gap-2">
  //         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
  //         Official Agreement
  //       </h2>
  //       <div className="flex gap-2">
  //         <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#e39622] hover:bg-[#c7831d] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#e39622]/20">
  //           <Download size={18} /> Download PDF
  //         </button>
  //         <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
  //           <X size={20} />
  //         </button>
  //       </div>
  //     </div>
  //     <div ref={printRef} className="w-full max-w-3xl bg-white shadow-2xl rounded-sm mb-10 overflow-hidden">
  //       <NDADocument nda={nda} senderName={senderName} receiverName={receiverName} />
  //     </div>
  //   </div>
  // );



  return createPortal(modalContent, document.documentElement);
};

export default NDAViewModal;