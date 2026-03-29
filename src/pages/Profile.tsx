import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, Loader2, Link as LinkIcon, Briefcase, Wallet, Sparkles } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [travellerType, setTravellerType] = useState(profile?.traveller_type || "");
  const [budgetPreference, setBudgetPreference] = useState(profile?.budget_preference || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
      traveller_type: travellerType || null,
      budget_preference: budgetPreference || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="pt-6 pb-16">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="relative mx-auto w-24 h-24 mb-6">
              {/* Glowing animated background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-accent to-blue-500 blur-md animate-pulse opacity-50 dark:opacity-70"></div>
              
              <div className="relative w-full h-full rounded-full bg-card border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-xl z-10 bg-gradient-to-br from-card to-muted">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-primary/60" />
                )}
              </div>
            </div>
            <h1 className="font-heading text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2">
              Edit Profile
            </h1>
            <p className="text-muted-foreground text-lg">Update your travel intelligence parameters</p>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSave} className="relative bg-white/60 dark:bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-8 sm:p-10 space-y-7 shadow-2xl shadow-primary/5">
            
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div className="space-y-3">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                  <User className="h-4 w-4 text-primary" /> Full Name
                </Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" className="bg-background/50 border-border/50 h-12 focus-visible:ring-primary/30" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="avatarUrl" className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                  <LinkIcon className="h-4 w-4 text-accent" /> Avatar URL
                </Label>
                <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg" className="bg-background/50 border-border/50 h-12 focus-visible:ring-primary/30" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-4 border-t border-border/40">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                  <Briefcase className="h-4 w-4 text-blue-500" /> Default Traveller Type
                </Label>
                <Select value={travellerType} onValueChange={setTravellerType}>
                  <SelectTrigger className="bg-background/50 border-border/50 h-12">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                  <Wallet className="h-4 w-4 text-green-500" /> Default Budget Preference
                </Label>
                <Select value={budgetPreference} onValueChange={setBudgetPreference}>
                  <SelectTrigger className="bg-background/50 border-border/50 h-12">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frugal">Frugal</SelectItem>
                    <SelectItem value="comfort">Comfort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" variant="hero" className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                )}
                <span>{saving ? "Synthesizing..." : "Save Intelligence Profile"}</span>
              </Button>
            </div>
          </motion.form>
        </div>
      </div>

    </div>
  );
};

export default Profile;
