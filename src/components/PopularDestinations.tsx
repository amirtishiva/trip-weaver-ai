import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DestinationCard from "./DestinationCard";
import keralaImg from "@/assets/dest-kerala.jpg";
import goaImg from "@/assets/dest-goa.jpg";
import manaliImg from "@/assets/dest-manali.jpg";
import jaipurImg from "@/assets/dest-jaipur.jpg";

const destinations = [
  { name: "Kerala", image: keralaImg, category: "Backwaters", bestTime: "Sep–Mar", description: "Serene backwaters, lush hills, and Ayurvedic retreats in God's Own Country." },
  { name: "Goa", image: goaImg, category: "Beach", bestTime: "Nov–Feb", description: "Golden beaches, vibrant nightlife, and Portuguese heritage charm." },
  { name: "Manali", image: manaliImg, category: "Mountains", bestTime: "Mar–Jun", description: "Snow-capped peaks, adventure sports, and cozy mountain cafes." },
  { name: "Jaipur", image: jaipurImg, category: "Heritage", bestTime: "Oct–Mar", description: "Majestic forts, pink-hued architecture, and royal Rajasthani culture." },
];

const PopularDestinations = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              Popular destinations
            </h2>
            <p className="text-muted-foreground text-lg">Handpicked places our travellers love</p>
          </div>
          <Link to="/discover" className="hidden md:block">
            <Button variant="ghost" className="gap-2 text-primary">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <DestinationCard {...dest} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/discover">
            <Button variant="outline" className="gap-2">
              View all destinations <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
