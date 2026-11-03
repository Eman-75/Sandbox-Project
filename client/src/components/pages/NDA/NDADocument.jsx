import React from 'react';

const NDADocument = ({ nda, senderName, receiverName }) => {
  console.log("Passing to Modal - NDA Object:", nda);
  // 1. IMPROVED LOGIC: Check if signature exists and handle the prefix correctly
  const getSignatureSrc = () => {
    if (!nda?.signatureData) return null;
    
    // If it already has the prefix, return as is. 
    // Otherwise, prepend the base64 header.
    if (nda.signatureData.startsWith('data:image')) {
      return nda.signatureData;
    }
    return `data:image/png;base64,${nda.signatureData}`;
  };

  const signatureSrc = getSignatureSrc();

  return (
    <div
      className="p-4 sm:p-6 md:p-10 w-full"
      style={{ backgroundColor: '#ffffff', color: '#0f172a', fontFamily: 'serif', minHeight: '100%' }}
    >
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold pb-3 sm:pb-4 mb-6 sm:mb-8 text-center" style={{ borderBottom: '2px solid #0f172a' }}>
        NON-DISCLOSURE AGREEMENT
      </h1>

      <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm leading-relaxed text-justify" style={{ color: '#334155' }}>
        <p>
          This Agreement is entered into on
          <strong> {nda?.createdAt ? new Date(nda.createdAt).toLocaleDateString() : new Date().toLocaleDateString()} </strong>.
        </p>
        <p>
          I hereby acknowledge that any idea, concept, business strategy, or confidential information obtained through the SandBox platform will not be used in an unauthorized or competitive manner.
        </p>
      </div>

      <div className="mt-10 space-y-6 text-xs sm:text-sm leading-relaxed text-justify" style={{ color: '#334155' }}>
        <div>
          <p className="font-semibold text-sm mb-2">1. Purpose</p>
          <p>
            The Disclosing Party possesses certain non-public, sensitive, and proprietary information regarding a software project or business venture. The Receiving Party wishes to review this information solely for the purpose of evaluating a potential business relationship or investment.
          </p>
        </div>

        <div>
          <p className="font-semibold text-sm mb-2">2. Definition of Confidential Information</p>
          <p>
            "Confidential Information" includes all data disclosed by the Disclosing Party, whether in writing, orally, or via digital access, including:
          </p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1" style={{ color: '#334155' }}>
            <li><strong>Technical IP:</strong> Source code, database schemas, API documentation, and AI/machine learning models.</li>
            <li><strong>Business IP:</strong> Financial projections, investor decks, user growth data, and marketing strategies.</li>
            <li><strong>Product IP:</strong> UI/UX wireframes, feature roadmaps, and the "SandBox" platform architecture.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sm mb-2">3. Non-Disclosure Obligations</p>
          <p>The Receiving Party agrees to:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1" style={{ color: '#334155' }}>
            <li><strong>Strict Confidentiality:</strong> Maintain the information in the strictest confidence and not disclose it to any third party, including other startups or competing investors.</li>
            <li><strong>No Reproduction:</strong> Not copy, reverse-engineer, or store the information on any unauthorized device.</li>
            <li><strong>Return/Destruction:</strong> Upon request, immediately return or destroy all copies of the Confidential Information.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sm mb-2">4. Non-Circumvention (The "Anti-Stealing" Clause)</p>
          <p>The Receiving Party shall not, for a period of two (2) years, use the Confidential Information to:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1" style={{ color: '#334155' }}>
            <li>Compete directly with the Disclosing Party.</li>
            <li>Solicit the Disclosing Party’s employees, students, or partners.</li>
            <li>Bypass the Disclosing Party to engage with any third party revealed through the Confidential Information.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sm mb-2">5. Ownership & No License</p>
          <p>
            All Confidential Information remains the exclusive property of the Disclosing Party. Nothing in this Agreement grants the Receiving Party any license, copyright, or ownership rights to the ideas or code shared.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6 items-start">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Signature</p>
            <p className="text-sm text-slate-600">
              By signing below, I acknowledge that I will not use any idea, concept, or confidential information obtained through the SandBox platform for unauthorized or competing purposes.
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex w-full flex-col items-end gap-3">
              <div className="w-full max-w-[320px] border-b border-slate-300 min-h-[70px] flex items-center justify-center mx-auto">
                {signatureSrc ? (
                  <img
                    src={signatureSrc}
                    alt="Signature"
                    style={{ maxHeight: '72px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      console.error("Image failed to load. Check Base64 string.");
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <p style={{ color: '#ef4444', fontSize: '10px', fontStyle: 'italic' }}>No Signature Found</p>
                )}
              </div>
              <p className="font-bold text-sm text-slate-900">{receiverName}</p>
              <p className="text-xs text-slate-500">Signed Digitally via SandBox</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NDADocument;