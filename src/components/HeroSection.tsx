import { Search } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden pb-0 bg-background">
      <div className="absolute inset-0">
        {/* Placeholder gradient for image fallback in case image isn't perfect, but we use the provided hero image. I'll add a subtle overlay to match original. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e5dcd6] to-[#aee4f7] mix-blend-multiply opacity-30 z-0"></div>
        <img
          src={heroImage}
          alt="Breathtaking mountain valley with winding road"
          className="w-full h-full object-cover object-bottom"
          style={{ height: "100%", width: "100%" }}
        />
        {/* The mockup has a very distinct sky and water gradient. To ensure the text is readable, I'll add a slight top gradient. */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-0" />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full mb-32 max-w-5xl">
        <h1 className="font-heading text-5xl md:text-7xl lg:text-[5rem] font-bold text-foreground leading-[1.05] mb-6 tracking-tight">
          Travel planning at <br />
          the <span className="text-[#0a2540] italic font-serif opacity-90">speed</span> of <br />
          thought.
        </h1>

        <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-xl font-medium leading-relaxed">
          Our multi-agent AI engine orchestrates every detail of your
          journey, from clandestine local gems to seamless logistics.
        </p>

        <div className="bg-white rounded-lg shadow-xl border border-border/50 p-1.5 flex flex-col sm:flex-row items-center w-full max-w-2xl gap-2 backdrop-blur-sm bg-white/95">
          <div className="flex-1 flex items-center px-4 py-3 sm:py-0 w-full">
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <input 
              type="text" 
              placeholder="Where do you dream of going?" 
              className="w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground font-medium text-base focus:ring-0" 
            />
          </div>
          <button className="w-full sm:w-auto bg-[#0a2540] hover:bg-[#0a2540]/90 text-white font-semibold py-3 px-8 rounded-md transition-all whitespace-nowrap shadow-md">
            Design my journey
          </button>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
