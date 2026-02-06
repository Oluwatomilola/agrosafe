import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Check, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";

const RegisterSection = () => {
  const { toast } = useToast();
  const { isConnected, address, connect } = useWallet();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    farmSize: "",
    crops: "",
  });

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Connect Wallet First",
        description: "Please connect your wallet to register as a farmer.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Registration Submitted!",
      description: "Your farmer registration is being processed on the blockchain.",
    });
  };

  return (
    <section id="register" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Join the Network
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              Register as a Farmer
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of farmers who are already benefiting from
              blockchain-verified produce registration. Build trust with buyers
              and access new markets.
            </p>

            <div className="space-y-4">
              {[
                "Immutable farmer identity on blockchain",
                "Unique verification IDs for all produce",
                "Direct connection with verified buyers",
                "Complete ownership of your data",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
              {/* Wallet Connection */}
              <div className="mb-8">
                {isConnected ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Wallet Connected</p>
                      <p className="text-sm text-muted-foreground">{shortAddress}</p>
                    </div>
                  </div>
                ) : (
                  <Button variant="wallet" className="w-full" size="lg" onClick={connect}>
                    <Wallet className="w-5 h-5" />
                    Connect Wallet to Register
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State, Country"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.farmSize}
                    onChange={(e) =>
                      setFormData({ ...formData, farmSize: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crops">Primary Crops</Label>
                  <Textarea
                    id="crops"
                    placeholder="List your main crops (e.g., Rice, Wheat, Corn)"
                    value={formData.crops}
                    onChange={(e) =>
                      setFormData({ ...formData, crops: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <UserPlus className="w-5 h-5" />
                  Register on Blockchain
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
