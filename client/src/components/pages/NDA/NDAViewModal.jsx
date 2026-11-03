import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import NDADocument from './NDADocument';

const NDAViewModal = ({ isOpen, onClose, nda, senderName, receiverName }) => {
  const printRef = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!isOpen || !nda) return null;

  const handleDownloadPDF = async () => {
    try {
      const element = printRef.current;
      if (!element) {
        console.error('Print ref not found');
        alert('Document not ready for download');
        return;
      }

      console.log('Starting PDF download...');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true
      });
      console.log('Canvas created successfully');
      
      const data = canvas.toDataURL('image/png');
      console.log('Image data URL created, length:', data.length);

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      let heightLeft = pdfHeight;
      let position = 0;

      // Add first page
      pdf.addImage(data, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(data, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      const filename = `NDA_${receiverName || 'document'}_${new Date().toLocaleDateString()}.pdf`;
      pdf.save(filename);
      console.log('PDF saved successfully as:', filename);
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF download error details:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Failed to download PDF: ${error.message || 'Unknown error'}`);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 z-[99999] flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 md:p-8 pt-4">
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sticky top-0 z-[160] bg-slate-900/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-md">
        <h2 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Official Agreement
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={handleDownloadPDF} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#e39622] hover:bg-[#c7831d] text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#e39622]/20">
            <Download size={16} className="hidden sm:block" />
            <Download size={14} className="sm:hidden" /> Download
          </button>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>
      </div>
      <div ref={printRef} className="w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
        <NDADocument nda={nda} senderName={senderName} receiverName={receiverName} />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default NDAViewModal;