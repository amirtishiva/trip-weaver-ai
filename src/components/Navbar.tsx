import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-lg shadow-black/5 rounded-2xl transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight text-[#0a2540] dark:text-white hover:opacity-80 transition-opacity">
          Trip Weaver AI
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {!user ? (
            <>
              <a href="#agents" className="text-sm font-medium text-[#0a2540]/80 dark:text-white/80 hover:text-[#0a2540] dark:hover:text-white transition-colors">Agents</a>
              <a href="#personas" className="text-sm font-medium text-[#0a2540]/80 dark:text-white/80 hover:text-[#0a2540] dark:hover:text-white transition-colors">Personas</a>
            </>
          ) : (
            <Link to="/dashboard" className="text-sm font-bold text-primary dark:text-primary hover:text-primary/80 transition-colors">
              Go to App Dashboard →
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-[#0a2540] dark:text-white rounded-full">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="ghost" onClick={handleSignOut} className="text-sm font-medium text-[#0a2540]/80 dark:text-white/80 hover:text-[#0a2540] dark:hover:text-white transition-colors px-0">
              Sign out
            </Button>
          ) : (
            <Link to="/auth" className="text-sm font-medium text-[#0a2540]/80 dark:text-white/80 hover:text-[#0a2540] dark:hover:text-white transition-colors">
              Sign in
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-[#0a2540] dark:text-white">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-[#0a2540] dark:text-white">
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
            className="md:hidden border-t border-white/20"
          >
            <div className="p-4 flex flex-col gap-4">
              {!user ? (
                <>
                  <a href="#agents" className="text-sm font-medium text-[#0a2540] dark:text-white" onClick={() => setMobileOpen(false)}>Agents</a>
                  <a href="#personas" className="text-sm font-medium text-[#0a2540] dark:text-white" onClick={() => setMobileOpen(false)}>Personas</a>
                  <Link to="/auth" className="text-sm font-medium text-[#0a2540] dark:text-white" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-sm font-bold text-primary" onClick={() => setMobileOpen(false)}>Go to App Dashboard →</Link>
                  <Button variant="ghost" className="w-full justify-start px-0 text-red-500" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
