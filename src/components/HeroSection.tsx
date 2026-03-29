import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Breathtaking mountain valley with winding road"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Trip Planning
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Plan your dream trip in{" "}
            <span className="text-accent">2 minutes</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg">
            Four AI agents work together to create your perfect trip plan — logistics, budget, itinerary, and more. Personalised for your travel style.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4">
            <Link to="/plan">
              <Button variant="accent" size="lg" className="text-base px-8 py-6">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Planning
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-6 mt-10 text-primary-foreground/70 text-sm">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Under 3 min</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> All India</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> 4 AI Agents</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
