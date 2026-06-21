import { useState } from "react";
import { api } from "../api/client";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.postForm("/upload", form);
      return res.data;
    } catch (err) {
      setError("Upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
