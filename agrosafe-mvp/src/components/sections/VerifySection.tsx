import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, User, MapPin, Calendar, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationResult {
  farmerId: string;
  farmerName: string;
  location: string;
  produceName: string;
  quantity: string;
  harvestDate: string;
  verified: boolean;
}

const VerifySection = () => {
  const { toast } = useToast();
  const [produceId, setProduceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produceId.trim()) {
      toast({
        title: "Enter Produce ID",
        description: "Please enter a valid produce ID to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulated blockchain lookup
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Demo result
    setResult({
      farmerId: "0xABCD...1234",
      farmerName: "John Farmer",
      location: "Lagos, Nigeria",
      produceName: "Organic Rice",
      quantity: "500 kg",
      harvestDate: "2025-01-10",
      verified: true,
    });
    
    setIsLoading(false);
    
    toast({
      title: "Verification Complete!",
      description: "Produce authenticity confirmed on blockchain.",
    });
  };

  return (
    <section id="verify" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Verify Authenticity
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Verify Produce Origin
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter a produce ID to verify its authenticity and trace its origin
            back to the registered farmer on the blockchain.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* Search Form */}
          <form onSubmit={handleVerify} className="mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter Produce ID (e.g., AGRO-2025-00123)"
                  value={produceId}
                  onChange={(e) => setProduceId(e.target.value)}
                  className="h-14 pl-12 text-lg"
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="h-14 px-8"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>

          {/* Demo hint */}
          <p className="text-center text-sm text-muted-foreground mb-8">
            Try entering any ID to see a demo verification result
          </p>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-3xl p-8 shadow-lg border border-primary/20"
            >
              {/* Verified Badge */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary">
                    Verified on Blockchain
                  </h3>
                  <p className="text-muted-foreground">Authenticity Confirmed</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Farmer</p>
                    <p className="font-semibold text-foreground">{result.farmerName}</p>
                    <p className="text-xs text-muted-foreground">{result.farmerId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Origin</p>
                    <p className="font-semibold text-foreground">{result.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produce</p>
                    <p className="font-semibold text-foreground">{result.produceName}</p>
                    <p className="text-xs text-muted-foreground">{result.quantity}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Harvest Date</p>
                    <p className="font-semibold text-foreground">{result.harvestDate}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default VerifySection;
