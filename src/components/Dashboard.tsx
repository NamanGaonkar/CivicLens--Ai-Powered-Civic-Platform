import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StatsCard } from "./StatsCard";
import { ReportsMap } from "./ReportsMap";
import { RecentReports } from "./RecentReports";
import { TrendsChart } from "./TrendsChart";
import { motion } from "framer-motion";
import { Database, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Dashboard() {
  const stats = useQuery(api.analytics.getDashboardStats);
  const reports = useQuery(api.reports.getReports, { limit: 10 });
  const seedDemoData = useMutation(api.demo.seedDemoData);

  const handleSeedDemo = async () => {
    try {
      const result = await seedDemoData();
      toast.success(result);
    } catch (error) {
      toast.error("Failed to seed demo data");
    }
  };

  if (!stats || !reports) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const hasNoData = stats.totalReports === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-2">City Dashboard</h2>
        <p className="text-white/70">Real-time civic engagement analytics</p>
        
        {hasNoData && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="glass-card p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Data Yet</h3>
              <p className="text-white/70 mb-4 text-sm">
                Get started by adding some demo data to see the dashboard in action
              </p>
              <motion.button
                onClick={handleSeedDemo}
                className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-blue-900 text-white font-semibold rounded-lg hover:from-red-700 hover:to-blue-900 transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Demo Data</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { title: "Total Reports", value: stats.totalReports, change: "+12%", icon: "📊", color: "blue" as const },
          { title: "Open Issues", value: stats.openReports, change: "-5%", icon: "🔓", color: "yellow" as const },
          { title: "Resolved", value: stats.resolvedReports, change: "+18%", icon: "✅", color: "green" as const },
          { title: "Resolution Rate", value: `${stats.resolutionRate}%`, change: "+3%", icon: "📈", color: "purple" as const }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts and Analytics */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 space-y-8"
        >
          <TrendsChart data={stats.trendsData} />
          <ReportsMap />
        </motion.div>

        {/* Right Column - Recent Activity */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          <RecentReports reports={reports} />
        </motion.div>
      </div>
      {/* AI Chatbot is rendered globally in App for authenticated views */}
    </motion.div>
  );
}
