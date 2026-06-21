import { useNavigate } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import UploadForm from "../components/UploadForm";

export default function JobList() {
  const { jobs, loading, refetch } = useJobs();
  const { logout } = useAuth();
  const navigate = useNavigate();
  // console.log("JOBS:", jobs);
  // console.log("TYPE:", typeof jobs);
  // console.log("IS ARRAY:", Array.isArray(jobs));
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto p-4">
        <div className="flex items-center justify-between py-4 mb-4">
          <h1 className="text-lg font-semibold">VisualAI</h1>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Sign out
          </button>
        </div>
        <UploadForm onUploaded={refetch} />
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Recent jobs</h2>
            <span className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block"></span>
              Live updates
            </span>
          </div>
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No jobs yet. Upload an image above.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
