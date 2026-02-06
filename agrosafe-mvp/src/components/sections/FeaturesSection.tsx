import { motion } from "framer-motion";
import {
  Shield,
  Globe,
  Zap,
  Lock,
  BarChart3,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Immutable Records",
    description:
      "All farmer and produce data is stored on the blockchain, making it tamper-proof and permanent.",
  },
  {
    icon: Globe,
    title: "Decentralized",
    description:
      "No central authority controls the data. The network is distributed across multiple nodes worldwide.",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description:
      "Verify produce authenticity in seconds with our fast blockchain lookup system.",
  },
  {
    icon: Lock,
    title: "Secure Wallet Auth",
    description:
      "Connect securely with your crypto wallet. No passwords to remember or data breaches to worry about.",
  },
  {
    icon: BarChart3,
    title: "Supply Chain Transparency",
    description:
      "Track produce from farm to table with complete visibility at every step of the journey.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Access AgroSafe from any device. Register farmers and verify produce on the go.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built on cutting-edge blockchain technology to provide security,
            transparency, and trust in agricultural supply chains.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-8 h-full border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-glow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
