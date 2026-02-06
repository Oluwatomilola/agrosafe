import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, User, Plus, History, Settings, BarChart3, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import OverviewTab from "@/components/dashboard/OverviewTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import BatchesTab from "@/components/dashboard/BatchesTab";
import AddBatchTab from "@/components/dashboard/AddBatchTab";
import HistoryTab from "@/components/dashboard/HistoryTab";
import SettingsTab from "@/components/dashboard/SettingsTab";

const mobileNavItems = [
  { id: "overview", icon: BarChart3 },
  { id: "profile", icon: User },
  { id: "batches", icon: Package },
  { id: "add-batch", icon: Plus },
  { id: "history", icon: History },
  { id: "settings", icon: Settings },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "profile":
        return <ProfileTab />;
      case "batches":
        return <BatchesTab onAddBatch={() => setActiveTab("add-batch")} />;
      case "add-batch":
        return <AddBatchTab />;
      case "history":
        return <HistoryTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", item.id === "add-batch" && isActive && "text-primary")} />
                {item.id === "add-batch" && (
                  <div className="absolute -top-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
