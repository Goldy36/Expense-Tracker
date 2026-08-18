import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Check } from 'lucide-react';

const ReceiptUploader = ({ value, onChange, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700 tracking-wide">
        Receipt / Invoice (Optional)
      </label>
      
      {value ? (
        <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {typeof value === 'string' && value.startsWith('data:image') || value.startsWith('http') ? (
              <img src={value} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
            ) : (
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-medium text-slate-800 truncate">Receipt Attachment</p>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" /> Attached successfully
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeReceipt}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleChange}
          />
          <div className="w-10 h-10 bg-white shadow-xs border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-2">
            <UploadCloud className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xs font-medium text-slate-700">
            <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP or PDF (max 5MB)</p>
        </div>
      )}
      {error && <p className="text-xs text-rose-600 mt-0.5">{error}</p>}
    </div>
  );
};

export default ReceiptUploader;
