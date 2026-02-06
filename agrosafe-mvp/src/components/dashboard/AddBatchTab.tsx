import { useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, Scale, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CONTRACT_ADDRESS } from "@/lib/constants";

const AddBatchTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    produceType: "",
    quantity: "",
    unit: "kg",
    harvestDate: "",
    location: "",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockTxHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
    setTxHash(mockTxHash);
    setIsSubmitting(false);

    toast({
      title: "Batch Recorded on Blockchain!",
      description: `Transaction hash: ${mockTxHash}`,
    });
  };

  const resetForm = () => {
    setFormData({
      produceType: "",
      quantity: "",
      unit: "kg",
      harvestDate: "",
      location: "",
      notes: "",
    });
    setTxHash(null);
  };

  if (txHash) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Batch Recorded Successfully!</h2>
        <p className="text-muted-foreground mb-6">Your produce batch has been recorded on the blockchain.</p>
        
        <div className="bg-muted rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-2">Transaction Hash</p>
          <p className="font-mono text-foreground">{txHash}</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-2">Contract</p>
          <p className="font-mono text-sm text-foreground">{CONTRACT_ADDRESS}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Transaction
            </a>
          </Button>
          <Button onClick={resetForm}>
            <Package className="w-4 h-4 mr-2" />
            Add Another Batch
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Add New Produce Batch</h2>
        <p className="text-muted-foreground mt-1">Record your harvest on the blockchain for verification</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card rounded-xl border border-border p-6 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Produce Type *</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="e.g., Maize, Cassava, Tomatoes"
                className="pl-10"
                value={formData.produceType}
                onChange={(e) => setFormData({ ...formData, produceType: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quantity *</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="500"
                  className="pl-10"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <select
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="kg">kg</option>
                <option value="tons">tons</option>
                <option value="bags">bags</option>
                <option value="crates">crates</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Harvest Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10"
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Field/Location *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="e.g., Field A, Greenhouse 1"
                className="pl-10"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-foreground">Additional Notes</label>
            <Textarea
              placeholder="Any additional information about this batch..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Contract: <span className="font-mono">{CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-4)}</span>
          </p>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Recording on Blockchain...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Record Batch
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddBatchTab;
