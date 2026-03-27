import { motion } from "framer-motion";
import { MapPin, Calendar, FileText, Heart, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back 👋
            </h1>
            <p className="text-muted-foreground text-lg">Manage your trips, wishlist, and bookings</p>
          </motion.div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Upcoming Trips", value: "0", icon: Calendar },
              { label: "Plans Generated", value: "0", icon: FileText },
              { label: "Wishlist", value: "0", icon: Heart },
              { label: "Notifications", value: "0", icon: Bell },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Upcoming trips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">Upcoming Trips</h2>
              <Link to="/plan">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" /> New Trip
                </Button>
              </Link>
            </div>
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <MapPin className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No trips planned yet</p>
              <Link to="/plan">
                <Button variant="hero" size="sm">Plan your first trip</Button>
              </Link>
            </div>
          </motion.div>

          {/* Wishlist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">Wishlist</h2>
              <Link to="/discover">
                <Button variant="ghost" size="sm" className="text-primary">Browse destinations</Button>
              </Link>
            </div>
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Heart className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
              <Link to="/discover">
                <Button variant="outline" size="sm">Discover places</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
