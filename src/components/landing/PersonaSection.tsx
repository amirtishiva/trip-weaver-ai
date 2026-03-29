import { GraduationCap, Users, User, Briefcase } from "lucide-react";
import Globe from "@/components/ui/globe";

const personas = [
  {
    icon: GraduationCap,
    title: "Student",
    description: "Culture-rich, budget-conscious exploration.",
  },
  {
    icon: Users,
    title: "Family",
    description: "Low-friction, high-engagement logistics.",
  },
  {
    icon: User,
    title: "Solo",
    description: "Flexible, spontaneous, and safe itineraries.",
  },
  {
    icon: Briefcase,
    title: "Professional",
    description: "Seamless, efficient, and seamless connectivity.",
  },
];

const PersonaSection = () => {
  return (
    <section id="personas" className="py-24 bg-[#f4f4f4] dark:bg-background/95">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          
          <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h4 className="text-xs font-bold text-[#0a2540] dark:text-primary tracking-widest uppercase mb-4">The Persona Engine</h4>
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Personalized for Every Journey
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              Our AI adapts its reasoning based on who you are traveling with and what you value most. Choose your profile and let the agents refine your experience.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              <span className="px-4 py-1.5 rounded-full border border-border text-xs font-semibold text-muted-foreground bg-white dark:bg-card">FRUGAL</span>
              <span className="px-4 py-1.5 rounded-full border-none text-xs font-semibold text-white bg-[#0a2540] dark:bg-primary dark:text-primary-foreground">COMFORT</span>
            </div>
          </div>

          <div className="lg:w-[320px] mx-auto w-full flex justify-center">
            <Globe />
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {personas.map((persona) => (
              <div key={persona.title} className="bg-white dark:bg-card rounded-xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-transparent dark:border-border h-full flex flex-col justify-center">
                <persona.icon className="h-8 w-8 text-[#0a2540] dark:text-primary mb-5" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">{persona.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{persona.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default PersonaSection;
