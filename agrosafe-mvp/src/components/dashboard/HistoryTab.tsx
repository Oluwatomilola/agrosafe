import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESS } from "@/lib/constants";

const transactions = [
  {
    id: 1,
    type: "batch_created",
    description: "Created produce batch BATCH-003",
    timestamp: "2024-03-20 08:45",
    txHash: "0x9876...5432",
    status: "confirmed",
  },
  {
    id: 2,
    type: "batch_created",
    description: "Created produce batch BATCH-002",
    timestamp: "2024-03-01 14:15",
    txHash: "0xabcd...ef01",
    status: "confirmed",
  },
  {
    id: 3,
    type: "batch_created",
    description: "Created produce batch BATCH-001",
    timestamp: "2024-02-16 10:30",
    txHash: "0x1234...5678",
    status: "confirmed",
  },
  {
    id: 4,
    type: "registration",
    description: "Farmer registration completed",
    timestamp: "2024-01-15 09:00",
    txHash: "0xfed0...9abc",
    status: "confirmed",
  },
];

const HistoryTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Transaction History</h2>
        <p className="text-muted-foreground mt-1">View all your blockchain transactions</p>
      </div>

      {/* Contract Info */}
      <div className="bg-muted rounded-xl p-4">
        <p className="text-sm text-muted-foreground">All transactions on contract:</p>
        <p className="font-mono text-foreground">{CONTRACT_ADDRESS}</p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === "registration" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-emerald-500/10 text-emerald-600"
              }`}>
                {tx.type === "registration" ? (
                  <ArrowDownLeft className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>
              {index < transactions.length - 1 && (
                <div className="w-px h-full bg-border flex-1 min-h-[40px]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 bg-card rounded-xl border border-border p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                    {tx.status}
                  </span>
                  <a
                    href="#"
                    className="flex items-center gap-1 text-sm text-primary hover:underline font-mono"
                  >
                    {tx.txHash}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryTab;
