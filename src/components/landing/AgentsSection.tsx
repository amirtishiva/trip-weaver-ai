import { ArrowRight, Plane, Wallet, Compass, LayoutList } from "lucide-react";
import RadialOrbitalTimeline, { TimelineItem } from "@/components/ui/radial-orbital-timeline";

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Logistics Analyst",
    date: "Node 1",
    content: "Solves the puzzle of flight connections, transfers, and optimal routing between stops.",
    category: "Logistics",
    icon: Plane,
    relatedIds: [2, 4],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Budget Specialist",
    date: "Node 2",
    content: "Real-time dynamic pricing analysis to ensure you get the best value without compromising quality.",
    category: "Budget",
    icon: Wallet,
    relatedIds: [1, 3],
    status: "completed",
    energy: 85,
  },
  {
    id: 3,
    title: "Experience Curator",
    date: "Node 3",
    content: "Sources hidden local eateries and private cultural access tailored to your specific taste profile.",
    category: "Experience",
    icon: Compass,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 95,
  },
  {
    id: 4,
    title: "Chief Planner",
    date: "Node 4",
    content: "Synthesizes all agent outputs into one cohesive, beautifully paced, polished itinerary.",
    category: "Planning",
    icon: LayoutList,
    relatedIds: [1, 2, 3],
    status: "pending",
    energy: 60,
  },
];

const AgentsSection = () => {
  return (
    <section id="agents" className="py-24 bg-[#faf9f6] dark:bg-background overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4 tracking-tight">
              Four Agents,<br />One Perfect Plan
            </h2>
            <p className="text-muted-foreground text-lg text-balance">
              Unlike basic LLMs, our system deploys four specialized intelligence nodes 
              that debate and collaborate to optimize every hour of your trip.
            </p>
          </div>
          <a href="#" className="flex items-center text-sm font-semibold text-[#0a2540] dark:text-primary hover:opacity-80 transition-opacity whitespace-nowrap">
            How the agents work <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="rounded-2xl border border-border shadow-2xl relative overflow-hidden bg-black/5 dark:bg-black/20">
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
