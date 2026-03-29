import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AgentsSection from "@/components/landing/AgentsSection";
import PersonaSection from "@/components/landing/PersonaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AgentsSection />
      <PersonaSection />
    </div>
  );
};

export default Index;
