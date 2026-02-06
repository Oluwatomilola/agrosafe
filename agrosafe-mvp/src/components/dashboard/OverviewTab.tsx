import { motion } from "framer-motion";
import { Package, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { MOCK_BATCHES, MOCK_FARMER } from "@/lib/constants";

const OverviewTab = () => {
  const verifiedBatches = MOCK_BATCHES.filter(b => b.status === "verified").length;
  const pendingBatches = MOCK_BATCHES.filter(b => b.status === "pending").length;
  
  const stats = [
    {
      label: "Total Batches",
      value: MOCK_BATCHES.length,
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Verified",
      value: verifiedBatches,
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Pending",
      value: pendingBatches,
      icon: Clock,
      color: "bg-accent/20 text-accent-foreground",
    },
    {
      label: "Farm Size",
      value: MOCK_FARMER.farmSize,
      icon: TrendingUp,
      color: "bg-sky/50 text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Welcome back, {MOCK_FARMER.name.split(" ")[0]}!</h2>
        <p className="text-muted-foreground mt-1">Here's an overview of your farm activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Recent Batches</h3>
        <div className="space-y-3">
          {MOCK_BATCHES.slice(0, 3).map((batch) => (
            <div key={batch.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{batch.produceType}</p>
                  <p className="text-sm text-muted-foreground">{batch.quantity} • {batch.harvestDate}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                batch.status === "verified" 
                  ? "bg-emerald-500/10 text-emerald-600" 
                  : "bg-accent/20 text-accent-foreground"
              }`}>
                {batch.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
