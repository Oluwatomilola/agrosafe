import { motion } from "framer-motion";
import { Package, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BATCHES, CONTRACT_ADDRESS } from "@/lib/constants";

interface BatchesTabProps {
  onAddBatch: () => void;
}

const BatchesTab = ({ onAddBatch }: BatchesTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Produce Batches</h2>
          <p className="text-muted-foreground mt-1">View all your recorded produce batches</p>
        </div>
        <Button onClick={onAddBatch}>
          <Package className="w-4 h-4 mr-2" />
          Add New Batch
        </Button>
      </div>

      {/* Contract Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Contract Address</p>
          <p className="font-mono text-sm text-muted-foreground">{CONTRACT_ADDRESS}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </a>
        </Button>
      </div>

      {/* Batches Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Batch ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Produce</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Quantity</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Harvest Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_BATCHES.map((batch, index) => (
                <motion.tr
                  key={batch.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-foreground">{batch.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{batch.produceType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{batch.quantity}</td>
                  <td className="px-6 py-4 text-muted-foreground">{batch.harvestDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      batch.status === "verified"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-accent/20 text-accent-foreground"
                    }`}>
                      {batch.status === "verified" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {batch.txHash}
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BatchesTab;
