import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DestinationCard from "@/components/DestinationCard";
import { supabase } from "@/integrations/supabase/client";

const categories = ["All", "Beach", "Mountains", "Heritage", "Backwaters", "Adventure"];

const Discover = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      const { data } = await supabase.from("destinations").select("*").order("name");
      setDestinations(data || []);
      setLoading(false);
    };
    fetchDestinations();
  }, []);

  const filtered = destinations.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || d.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Discover destinations</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Browse India's most loved travel spots and add them to your wishlist</p>
          </motion.div>

          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search destinations..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat)}>
                {cat}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((dest, i) => (
                <motion.div key={dest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <DestinationCard id={dest.id} name={dest.name} image_url={dest.image_url} category={dest.category} best_time={dest.best_time} description={dest.description} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No destinations found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Discover;
