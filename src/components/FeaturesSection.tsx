import { motion } from "framer-motion";
import { Brain, IndianRupee, Map, FileText, Users, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "4 AI Agents",
    description: "Logistics analyst, budget specialist, experience curator, and chief planner work in sequence.",
  },
  {
    icon: IndianRupee,
    title: "Frugal & Comfort Tiers",
    description: "Every plan comes with two budget options — choose what fits your wallet.",
  },
  {
    icon: Map,
    title: "Day-by-Day Itinerary",
    description: "Custom itineraries honouring your must-visit places with alternatives if needed.",
  },
  {
    icon: FileText,
    title: "Downloadable PDF",
    description: "Get a polished, shareable trip document you can access offline anywhere.",
  },
  {
    icon: Users,
    title: "Traveller Types",
    description: "Student, Family, Solo, or Professional — AI adapts recommendations to you.",
  },
  {
    icon: Shield,
    title: "Safety & Alerts",
    description: "Real-time weather, safety alerts, and emergency contacts during your trip.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 surface-warm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need, one plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No more juggling between apps. Travel Wonders handles logistics, budgeting, activities, and documentation — all at once.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
