import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Compass, Sparkles, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { label: "Discover", href: "/discover" },
  { label: "Plan a Trip", href: "/plan" },
  { label: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
          <div className="gradient-primary rounded-lg p-1.5">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          TravelMind
          <span className="text-xs font-medium bg-accent/15 text-accent px-2 py-0.5 rounded-full">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className="font-medium"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Link to="/plan">
            <Button variant="hero" size="sm" className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              Plan with AI
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="p-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link to="/plan" onClick={() => setMobileOpen(false)}>
                <Button variant="hero" className="w-full gap-1.5 mt-2">
                  <Sparkles className="h-4 w-4" />
                  Plan with AI
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
