const styles = {
  completed: "bg-green-100 text-green-700",
  processing: "bg-purple-100 text-purple-700",
  pending: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-700",
};

const labels = {
  completed: "Completed",
  processing: "Processing",
  pending: "Pending",
  failed: "Failed",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full ${
        styles[status] || styles.pending
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
