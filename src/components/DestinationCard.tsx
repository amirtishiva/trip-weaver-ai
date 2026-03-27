import { Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DestinationCardProps {
  name: string;
  image: string;
  category: string;
  bestTime: string;
  description: string;
}

const DestinationCard = ({ name, image, category, bestTime, description }: DestinationCardProps) => {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={640}
          height={800}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full h-9 w-9"
          onClick={() => setWishlisted(!wishlisted)}
        >
          <Heart className={`h-4 w-4 transition-colors ${wishlisted ? "fill-accent text-accent" : "text-foreground"}`} />
        </Button>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            India
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {bestTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
