import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="flex flex-col bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-purple-200 hover:bg-purple-50 transition overflow-hidden"
    >
      {/* ── full image on top ── */}
      <div className="w-full h-48 bg-gray-50 overflow-hidden flex items-center justify-center">
        <img
          src={job.file_path}
          alt={job.original_filename}
          className="w-full h-full object-contain"
        />
      </div>

      {/* ── info row below image ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {job.original_filename}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(job.created_at).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={job.status} />
        <span className="text-gray-300 text-sm">›</span>
      </div>
    </div>
  );
}
