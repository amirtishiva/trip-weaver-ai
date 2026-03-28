import { Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Local asset map
import keralaImg from "@/assets/dest-kerala.jpg";
import goaImg from "@/assets/dest-goa.jpg";
import manaliImg from "@/assets/dest-manali.jpg";
import jaipurImg from "@/assets/dest-jaipur.jpg";
import ladakhImg from "@/assets/dest-ladakh.jpg";

const imageMap: Record<string, string> = {
  "/assets/dest-kerala.jpg": keralaImg,
  "/assets/dest-goa.jpg": goaImg,
  "/assets/dest-manali.jpg": manaliImg,
  "/assets/dest-jaipur.jpg": jaipurImg,
  "/assets/dest-ladakh.jpg": ladakhImg,
};

interface DestinationCardProps {
  id?: string;
  name: string;
  image?: string;
  image_url?: string;
  category: string;
  bestTime?: string;
  best_time?: string;
  description: string;
}

const DestinationCard = ({ id, name, image, image_url, category, bestTime, best_time, description }: DestinationCardProps) => {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const resolvedBestTime = bestTime || best_time || "";
  const imgSrc = image || imageMap[image_url || ""] || image_url || "/placeholder.svg";

  useEffect(() => {
    if (user && id) {
      supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("destination_id", id)
        .maybeSingle()
        .then(({ data }) => setWishlisted(!!data));
    }
  }, [user, id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    if (!id) return;

    if (wishlisted) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("destination_id", id);
      setWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, destination_id: id });
      setWishlisted(true);
      toast.success("Added to wishlist!");
    }
  };

  return (
    <Link to={`/destination/${encodeURIComponent(name)}`}>
      <div className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <img src={imgSrc} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute top-3 left-3">
            <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full">{category}</span>
          </div>
          <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full h-9 w-9" onClick={toggleWishlist}>
            <Heart className={`h-4 w-4 transition-colors ${wishlisted ? "fill-accent text-accent" : "text-foreground"}`} />
          </Button>
        </div>
        <div className="p-5">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> India</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {resolvedBestTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
