import { motion } from "framer-motion";
import { ClipboardList, Cpu, FileCheck, Download } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Fill the form", description: "Tell us where, when, and how you travel." },
  { icon: Cpu, title: "AI agents work", description: "Four specialists build your plan in parallel." },
  { icon: FileCheck, title: "Review your plan", description: "A complete trip doc with budget, itinerary & more." },
  { icon: Download, title: "Download & go", description: "Get your PDF, book, and hit the road." },
];

const HowItWorks = () => {
  return (
    <section className="py-24 surface-cool">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-muted-foreground text-lg">From idea to itinerary in four simple steps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="absolute top-8 left-[60%] right-0 h-px bg-border hidden md:block last:hidden" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
