import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DestinationCard from "@/components/DestinationCard";
import keralaImg from "@/assets/dest-kerala.jpg";
import goaImg from "@/assets/dest-goa.jpg";
import manaliImg from "@/assets/dest-manali.jpg";
import jaipurImg from "@/assets/dest-jaipur.jpg";
import ladakhImg from "@/assets/dest-ladakh.jpg";

const allDestinations = [
  { name: "Kerala", image: keralaImg, category: "Backwaters", bestTime: "Sep–Mar", description: "Serene backwaters, lush hills, and Ayurvedic retreats in God's Own Country." },
  { name: "Goa", image: goaImg, category: "Beach", bestTime: "Nov–Feb", description: "Golden beaches, vibrant nightlife, and Portuguese heritage charm." },
  { name: "Manali", image: manaliImg, category: "Mountains", bestTime: "Mar–Jun", description: "Snow-capped peaks, adventure sports, and cozy mountain cafes." },
  { name: "Jaipur", image: jaipurImg, category: "Heritage", bestTime: "Oct–Mar", description: "Majestic forts, pink-hued architecture, and royal Rajasthani culture." },
  { name: "Ladakh", image: ladakhImg, category: "Adventure", bestTime: "Jun–Sep", description: "Turquoise lakes, Buddhist monasteries, and the world's highest roads." },
];

const categories = ["All", "Beach", "Mountains", "Heritage", "Backwaters", "Adventure"];

const Discover = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allDestinations.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || d.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover destinations
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Browse India's most loved travel spots and add them to your wishlist
            </p>
          </motion.div>

          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DestinationCard {...dest} />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
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
