import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import RegisterSection from "@/components/sections/RegisterSection";
import VerifySection from "@/components/sections/VerifySection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <RegisterSection />
        <VerifySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
