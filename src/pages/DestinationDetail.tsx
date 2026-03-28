import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Heart, Shield, Cloud, Thermometer, Droplets, Wind, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Local asset map for seeded destinations
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

interface WeatherData {
  city: string;
  current: { temp: number; feelsLike: number; humidity: number; description: string; icon: string; windSpeed: number };
  forecast: { date: string; temp: number; tempMin: number; tempMax: number; humidity: number; description: string; icon: string }[];
}

const DestinationDetail = () => {
  const { name } = useParams<{ name: string }>();
  const { user } = useAuth();
  const [destination, setDestination] = useState<any>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      const { data } = await supabase
        .from("destinations")
        .select("*")
        .eq("name", decodeURIComponent(name || ""))
        .single();

      if (data) {
        setDestination(data);
        fetchWeather(data.latitude, data.longitude);
        if (user) checkWishlist(data.id);
      }
      setLoading(false);
    };
    fetchDestination();
  }, [name, user]);

  const fetchWeather = async (lat: number, lon: number) => {
    setWeatherLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather?lat=${lat}&lon=${lon}`;
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      if (resp.ok) {
        const weatherData = await resp.json();
        setWeather(weatherData);
      }
    } catch (e) {
      console.error("Weather fetch failed:", e);
    } finally {
      setWeatherLoading(false);
    }
  };

  const checkWishlist = async (destId: string) => {
    const { data } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user!.id)
      .eq("destination_id", destId)
      .maybeSingle();
    setWishlisted(!!data);
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    if (!destination) return;

    if (wishlisted) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("destination_id", destination.id);
      setWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, destination_id: destination.id });
      setWishlisted(true);
      toast.success("Added to wishlist!");
    }
  };

  const resolveImage = (url: string | null) => {
    if (!url) return "/placeholder.svg";
    return imageMap[url] || url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Destination not found</h1>
          <Link to="/discover"><Button variant="hero">Browse destinations</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero Image */}
        <div className="relative h-[50vh] overflow-hidden">
          <img src={resolveImage(destination.image_url)} alt={destination.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto px-4">
              <Link to="/discover" className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to Discover
              </Link>
              <div className="flex items-end justify-between">
                <div>
                  <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">{destination.category}</span>
                  <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3">{destination.name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> India</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Best: {destination.best_time}</span>
                  </div>
                </div>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm" onClick={toggleWishlist}>
                  <Heart className={`h-5 w-5 transition-colors ${wishlisted ? "fill-accent text-accent" : "text-foreground"}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{destination.description}</p>
              </motion.div>

              {destination.highlights?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Top Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {destination.highlights.map((h: string) => (
                      <div key={h} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground">{h}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {destination.safety_info && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Safety Information
                  </h2>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-muted-foreground text-sm">{destination.safety_info}</p>
                  </div>
                </motion.div>
              )}

              {destination.nearby_facilities?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Nearby Facilities</h2>
                  <div className="space-y-2">
                    {destination.nearby_facilities.map((f: string) => (
                      <div key={f} className="bg-card border border-border rounded-lg p-3 text-sm text-muted-foreground">{f}</div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - Weather + CTA */}
            <div className="space-y-6">
              {/* Weather Widget */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" /> Weather Forecast
                </h3>
                {weatherLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : weather ? (
                  <div>
                    <div className="text-center mb-4">
                      <img src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`} alt={weather.current.description} className="mx-auto h-16 w-16" />
                      <p className="font-heading text-3xl font-bold text-foreground">{weather.current.temp}°C</p>
                      <p className="text-sm text-muted-foreground capitalize">{weather.current.description}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <Thermometer className="h-4 w-4 mx-auto text-accent mb-1" />
                        <p className="text-xs text-muted-foreground">Feels like</p>
                        <p className="text-sm font-medium text-foreground">{weather.current.feelsLike}°C</p>
                      </div>
                      <div className="text-center">
                        <Droplets className="h-4 w-4 mx-auto text-primary mb-1" />
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="text-sm font-medium text-foreground">{weather.current.humidity}%</p>
                      </div>
                      <div className="text-center">
                        <Wind className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">Wind</p>
                        <p className="text-sm font-medium text-foreground">{weather.current.windSpeed} m/s</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground mb-2">5-Day Forecast</p>
                      <div className="space-y-2">
                        {weather.forecast.map((f) => (
                          <div key={f.date} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{new Date(f.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}</span>
                            <span className="flex items-center gap-1">
                              <img src={`https://openweathermap.org/img/wn/${f.icon}.png`} alt={f.description} className="h-6 w-6" />
                              <span className="text-foreground font-medium">{f.tempMax}°</span>
                              <span className="text-muted-foreground">{f.tempMin}°</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-4">Weather data temporarily unavailable</p>
                )}
              </motion.div>

              {/* Plan Trip CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Ready to visit {destination.name}?</h3>
                <p className="text-sm text-muted-foreground mb-4">Let our AI plan your perfect trip with logistics, budget, and itinerary.</p>
                <Link to={`/plan?destination=${encodeURIComponent(destination.name)}`}>
                  <Button variant="hero" className="w-full">Plan a Trip Here</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DestinationDetail;
