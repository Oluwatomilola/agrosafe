import { motion } from "framer-motion";
import { UserPlus, PackageCheck, QrCode, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description:
      "Connect your wallet and register as a verified farmer on the blockchain. Your identity is secured and immutable.",
  },
  {
    icon: PackageCheck,
    title: "Record Produce",
    description:
      "Log your agricultural produce with detailed information including type, quantity, and harvest date.",
  },
  {
    icon: QrCode,
    title: "Get Verified ID",
    description:
      "Receive a unique blockchain-verified ID for each batch of produce that can be shared with buyers.",
  },
  {
    icon: ShieldCheck,
    title: "Build Trust",
    description:
      "Buyers can verify the authenticity and origin of produce, creating transparency in the supply chain.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            How AgroSafe Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our decentralized platform makes it easy for farmers to register and
            for buyers to verify the authenticity of agricultural produce.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shadow-md">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-glow/10 flex items-center justify-center mb-6">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
