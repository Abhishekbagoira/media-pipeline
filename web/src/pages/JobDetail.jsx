import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.job);
    } catch {
      navigate("/jobs");
    }
  };

  useEffect(() => {
    fetchJob();
    const timer = setInterval(fetchJob, 5000);
    return () => clearInterval(timer);
  }, [id]);

  const retry = async () => {
    await api.post(`/jobs/${id}/retry`);
    fetchJob();
  };

  if (!job)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto p-4">
        <button
          onClick={() => navigate("/jobs")}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 py-4"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
          {/* filename + status */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">
              {job.original_filename}
            </p>
            <StatusBadge status={job.status} />
          </div>

          {/* ── IMAGE ── always show if file_path exists */}
          {job.file_path && (
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              <img
                src={job.file_path}
                alt={job.original_filename}
                className="w-full max-h-72 object-contain"
              />
            </div>
          )}

          {/* ── FAILED ── */}
          {job.status === "failed" && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-sm text-red-600 mb-3">
                {job.error_message || "Processing failed."}
              </p>
              <button
                onClick={retry}
                className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                ↺ Retry job
              </button>
            </div>
          )}

          {/* ── PENDING / PROCESSING ── */}
          {(job.status === "pending" || job.status === "processing") && (
            <div className="text-center py-6 text-sm text-gray-400">
              <p className="animate-pulse">Analyzing your image...</p>
              <p className="text-xs mt-1">This page updates automatically</p>
            </div>
          )}

          {/* ── COMPLETED ── */}
          {job.status === "completed" && (
            <>
              <div>
                <p className="text-xs font-medium text-gray-400 mb-2">
                  CAPTION
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {job.caption}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400 mb-2">LABELS</p>
                <div className="flex flex-wrap gap-2">
                  {job.labels?.map((label, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full"
                    >
                      {/* label can be string or {name, confidence} object */}
                      {typeof label === "object"
                        ? `${label.name} ${Math.round(label.confidence * 100)}%`
                        : label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400 mb-2">SAFETY</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(job.safety_result || {}).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="capitalize text-gray-600">{key}</span>
                        <span
                          className={
                            ["LIKELY", "VERY_LIKELY", "POSSIBLE"].includes(
                              value,
                            )
                              ? "text-red-500 font-medium"
                              : "text-green-600"
                          }
                        >
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
