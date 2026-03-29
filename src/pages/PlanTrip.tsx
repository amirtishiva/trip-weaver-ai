import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, MapPin, Calendar, Users, Wallet, CheckCircle } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TripPlanView from "@/components/TripPlanView";
import { GlobePulse } from "@/components/ui/cobe-globe-pulse";

const agentNames = ["Discovery Agent", "Planning Agent", "Budgeting Agent", "Optimization Agent"];

const PlanTrip = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);
  const [planContent, setPlanContent] = useState<string | null>(null);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupSize, setGroupSize] = useState("1");
  const [travellerType, setTravellerType] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [mustVisit, setMustVisit] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsGenerating(true);
    setPlanContent(null);
    setActiveAgent(0);

    const agentInterval = setInterval(() => {
      setActiveAgent((prev) => {
        if (prev >= 3) { clearInterval(agentInterval); return 3; }
        return prev + 1;
      });
    }, 15000);

    try {
      const { data, error } = await supabase.functions.invoke("generate-trip", {
        body: {
          origin, destination, startDate, endDate,
          groupSize: parseInt(groupSize),
          travellerType, budgetAmount: parseFloat(budgetAmount),
          mustVisit: mustVisit || undefined,
        },
      });

      clearInterval(agentInterval);

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPlanContent(data.plan);
      setActiveAgent(4);
      toast.success("Your trip plan is ready!");
    } catch (error: any) {
      console.error("Trip generation error:", error);
      toast.error(error.message || "Failed to generate trip plan. Please try again.");
      clearInterval(agentInterval);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" /> AI-Powered Planning
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Plan your trip</h1>
            <p className="text-muted-foreground text-lg">Fill in the details and let our 4 AI agents craft your perfect plan</p>
          </motion.div>

          {!planContent ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> Origin</Label>
                    <Input id="origin" placeholder="e.g. Visakhapatnam" required value={origin} onChange={(e) => setOrigin(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" /> Destination</Label>
                    <Input id="destination" placeholder="e.g. Manali" required value={destination} onChange={(e) => setDestination(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> Start Date</Label>
                    <Input id="startDate" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> End Date</Label>
                    <Input id="endDate" type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> Group Size</Label>
                    <Input type="number" min={1} max={20} placeholder="1" required value={groupSize} onChange={(e) => setGroupSize(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> Traveller Type</Label>
                    <Select required value={travellerType} onValueChange={setTravellerType}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="solo">Solo</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-primary" /> Budget (₹ per person)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input type="number" min={1000} step={500} placeholder="e.g. 10000" className="pl-7" required value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mustVisit">Must-Visit Places (optional)</Label>
                  <Textarea id="mustVisit" placeholder="e.g. Rohtang Pass, Solang Valley, Old Manali..." className="resize-none" rows={3} value={mustVisit} onChange={(e) => setMustVisit(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Separate places with commas. The AI will build the itinerary around these.</p>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full text-base py-6" disabled={isGenerating || !travellerType || !budgetAmount}>
                  {isGenerating ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> AI agents are working...</>
                  ) : (
                    <><Sparkles className="h-5 w-5 mr-2" /> Generate My Trip Plan</>
                  )}
                </Button>
              </motion.form>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center space-y-6 lg:mt-8"
              >
                <div className="relative w-full aspect-square max-w-[450px]">
                  <GlobePulse className="w-full" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-primary/20 blur-2xl rounded-full" />
                </div>
                <div className="text-center space-y-2 max-w-sm">
                  <h3 className="font-heading text-xl font-bold">Visualize Your Journey</h3>
                  <p className="text-sm text-muted-foreground">
                    From your doorstep to the world's most breathtaking destinations. Our AI agents handle the complexity so you can enjoy the view.
                  </p>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h2 className="font-heading text-2xl font-bold text-foreground">Your Trip Plan</h2>
                </div>
                <Button variant="outline" onClick={() => { setPlanContent(null); setActiveAgent(-1); }}>
                  Plan Another Trip
                </Button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <TripPlanView planContent={planContent} tripTitle={`${origin} to ${destination}`} />
              </div>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-card border border-border rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">AI agents are analyzing your trip...</p>
              <div className="space-y-4">
                {agentNames.map((agent, i) => (
                  <div key={agent} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < activeAgent ? "bg-primary text-primary-foreground" :
                      i === activeAgent ? "gradient-primary text-primary-foreground animate-pulse" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {i < activeAgent ? "+" : i + 1}
                    </div>
                    <span className={`text-sm ${i <= activeAgent ? "text-foreground font-medium" : "text-muted-foreground"}`}>{agent}</span>
                    {i === activeAgent && <Loader2 className="h-4 w-4 animate-spin text-primary ml-auto" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PlanTrip;
