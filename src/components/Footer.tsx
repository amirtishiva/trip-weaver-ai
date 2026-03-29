import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <div className="gradient-primary rounded-lg p-1.5">
              <Compass className="h-4 w-4 text-primary-foreground" />
            </div>
            TravelMind AI
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/plan" className="hover:text-foreground transition-colors">Plan a Trip</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 TravelMind AI. Built by The Centurions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
