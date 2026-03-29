import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, FileText, Plus, Loader2, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import TripPlanView from "@/components/TripPlanView";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data } = await supabase.from("trips").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setTrips(data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const deleteTrip = async (tripId: string) => {
    await supabase.from("trips").delete().eq("id", tripId);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  const completedTrips = trips.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
            </h1>
            <p className="text-muted-foreground text-lg">Manage your trips and plans</p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {[
                  { label: "Total Trips", value: String(trips.length), icon: Calendar },
                  { label: "Plans Generated", value: String(completedTrips.length), icon: FileText },
                  { label: "Generating", value: String(trips.filter((t) => t.status === "generating").length), icon: Loader2 },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-xl p-5">
                    <stat.icon className="h-5 w-5 text-primary mb-2" />
                    <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-semibold text-foreground">Your Trips</h2>
                  <Link to="/plan"><Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Trip</Button></Link>
                </div>
                {trips.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-12 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No trips planned yet</p>
                    <Link to="/plan"><Button variant="hero" size="sm">Plan your first trip</Button></Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trips.map((trip) => (
                      <div key={trip.id} className="bg-card border border-border rounded-xl p-5">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedTrip(expandedTrip === trip.id ? null : trip.id)}>
                          <div>
                            <h3 className="font-heading font-semibold text-foreground">{trip.origin} → {trip.destination}</h3>
                            <p className="text-sm text-muted-foreground">{new Date(trip.start_date).toLocaleDateString()} – {new Date(trip.end_date).toLocaleDateString()} | {trip.group_size} travellers</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                              trip.status === "completed" ? "bg-primary/15 text-primary" :
                              trip.status === "generating" ? "bg-accent/15 text-accent" :
                              "bg-destructive/15 text-destructive"
                            }`}>{trip.status}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}>
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                        {expandedTrip === trip.id && trip.plan_content && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <TripPlanView planContent={trip.plan_content} tripTitle={`${trip.origin} to ${trip.destination}`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
