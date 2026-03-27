import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, MapPin, Calendar, Users, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PlanTrip = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulated — will connect to AI backend later
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              AI-Powered Planning
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
              Plan your trip
            </h1>
            <p className="text-muted-foreground text-lg">
              Fill in the details and let our 4 AI agents craft your perfect plan
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Origin
                </Label>
                <Input id="origin" placeholder="e.g. Visakhapatnam" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> Destination
                </Label>
                <Input id="destination" placeholder="e.g. Manali" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Start Date
                </Label>
                <Input id="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> End Date
                </Label>
                <Input id="endDate" type="date" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> Group Size
                </Label>
                <Input type="number" min={1} max={20} placeholder="1" required />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> Traveller Type
                </Label>
                <Select required>
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
                <Label className="flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-primary" /> Budget Tier
                </Label>
                <Select required>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frugal">Frugal</SelectItem>
                    <SelectItem value="comfort">Comfort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mustVisit">Must-Visit Places (optional)</Label>
              <Textarea
                id="mustVisit"
                placeholder="e.g. Rohtang Pass, Solang Valley, Old Manali..."
                className="resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Separate places with commas. The AI will build the itinerary around these.
              </p>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full text-base py-6"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  AI agents are working...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate My Trip Plan
                </>
              )}
            </Button>
          </motion.form>

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 bg-card border border-border rounded-xl p-6"
            >
              <div className="space-y-4">
                {["Travel Logistics Analyst", "Budgeting Specialist", "Local Experience Curator", "Chief Travel Planner"].map((agent, i) => (
                  <div key={agent} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "gradient-primary text-primary-foreground animate-pulse-soft" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {agent}
                    </span>
                    {i === 0 && <Loader2 className="h-4 w-4 animate-spin text-primary ml-auto" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlanTrip;
