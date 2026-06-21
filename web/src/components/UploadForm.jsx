import { useRef } from "react";
import { useUpload } from "../hooks/useUpload";

export default function UploadForm({ onUploaded }) {
  const { upload, uploading, error } = useUpload();
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const job = await upload(file);
    if (job) onUploaded(job);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
      }}
      className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <p className="text-2xl mb-2">☁️</p>
      <p className="text-sm font-medium text-gray-700">
        {uploading ? "Uploading..." : "Drop image here or click to upload"}
      </p>
      <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max 20MB</p>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
