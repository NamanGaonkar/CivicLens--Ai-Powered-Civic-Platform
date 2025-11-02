import { Id } from "../../convex/_generated/dataModel";

interface Report {
  _id: Id<"reports">;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  upvotes: number;
  _creationTime: number;
  imageUrl?: string | null;
}

interface RecentReportsProps {
  reports: Report[];
}

export function RecentReports({ reports }: RecentReportsProps) {
  const priorityColors = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const statusColors = {
    open: "bg-red-500/20 text-red-400",
    in_progress: "bg-yellow-500/20 text-yellow-400",
    resolved: "bg-green-500/20 text-green-400",
    closed: "bg-gray-500/20 text-gray-400",
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Recent Reports</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {reports.map((report) => (
          <div
            key={report._id}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-white truncate flex-1 mr-2">
                {report.title}
              </h4>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full border ${priorityColors[report.priority]}`}>
                  {report.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[report.status]}`}>
                  {report.status.replace("_", " ")}
                </span>
              </div>
            </div>
            
            <p className="text-white/60 text-sm mb-3">{report.category}</p>
            
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>{new Date(report._creationTime).toLocaleDateString()}</span>
              <div className="flex items-center space-x-1">
                <span>👍</span>
                <span>{report.upvotes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
