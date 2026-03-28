
-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  traveller_type TEXT CHECK (traveller_type IN ('student', 'family', 'solo', 'professional')),
  budget_preference TEXT CHECK (budget_preference IN ('frugal', 'comfort')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create destinations table
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  best_time TEXT NOT NULL,
  image_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  highlights TEXT[] DEFAULT '{}',
  nearby_facilities TEXT[] DEFAULT '{}',
  safety_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view destinations" ON public.destinations FOR SELECT USING (true);

-- Create wishlists table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- Create trips table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  group_size INTEGER NOT NULL DEFAULT 1,
  traveller_type TEXT NOT NULL,
  budget_tier TEXT NOT NULL,
  must_visit TEXT,
  plan_content TEXT,
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed destinations data
INSERT INTO public.destinations (name, description, category, best_time, image_url, latitude, longitude, highlights, nearby_facilities, safety_info) VALUES
('Kerala', 'Serene backwaters, lush hills, and Ayurvedic retreats in God''s Own Country. Experience houseboat cruises through palm-fringed canals, explore spice plantations in Munnar, and rejuvenate with traditional Ayurvedic treatments.', 'Backwaters', 'Sep–Mar', '/assets/dest-kerala.jpg', 10.8505, 76.2711, ARRAY['Alleppey Backwaters', 'Munnar Tea Gardens', 'Fort Kochi', 'Periyar Wildlife Sanctuary', 'Varkala Beach'], ARRAY['Cochin International Airport', 'Government Medical College Kochi', 'KSRTC Bus Terminal'], 'Kerala is generally safe for tourists. Keep emergency number 112 handy. Tourist helpline: 1800-425-4747.'),
('Goa', 'Golden beaches, vibrant nightlife, and Portuguese heritage charm. From the lively shores of Baga and Calangute to the serene beauty of Palolem, Goa offers an unforgettable coastal experience.', 'Beach', 'Nov–Feb', '/assets/dest-goa.jpg', 15.2993, 74.1240, ARRAY['Baga Beach', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Fort Aguada', 'Anjuna Flea Market'], ARRAY['Goa International Airport', 'Goa Medical College', 'Kadamba Bus Terminal'], 'Goa is tourist-friendly. Avoid isolated beaches at night. Tourist police: 1800-233-7654.'),
('Manali', 'Snow-capped peaks, adventure sports, and cozy mountain cafes. Nestled in the Kullu Valley, Manali is a gateway to high-altitude treks, paragliding, and the iconic Rohtang Pass.', 'Mountains', 'Mar–Jun', '/assets/dest-manali.jpg', 32.2396, 77.1887, ARRAY['Rohtang Pass', 'Solang Valley', 'Old Manali', 'Hadimba Temple', 'Jogini Waterfall'], ARRAY['Bhuntar Airport (50km)', 'Civil Hospital Manali', 'HRTC Bus Stand'], 'Check road conditions before traveling to Rohtang Pass. Altitude sickness possible above 3000m. Emergency: 112.'),
('Jaipur', 'Majestic forts, pink-hued architecture, and royal Rajasthani culture. The Pink City dazzles with its grand palaces, bustling bazaars, and a rich tapestry of art and cuisine.', 'Heritage', 'Oct–Mar', '/assets/dest-jaipur.jpg', 26.9124, 75.7873, ARRAY['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort'], ARRAY['Jaipur International Airport', 'SMS Hospital', 'Sindhi Camp Bus Terminal'], 'Jaipur is safe for tourists. Beware of overcharging auto-rickshaws. Tourist helpline: 1363.'),
('Ladakh', 'Turquoise lakes, Buddhist monasteries, and the world''s highest roads. A land of dramatic landscapes, Ladakh offers spiritual solace and heart-pumping adventure in equal measure.', 'Adventure', 'Jun–Sep', '/assets/dest-ladakh.jpg', 34.1526, 77.5771, ARRAY['Pangong Lake', 'Nubra Valley', 'Khardung La', 'Thiksey Monastery', 'Magnetic Hill'], ARRAY['Kushok Bakula Airport Leh', 'SNM Hospital Leh', 'Leh Bus Stand'], 'Acclimatize for 1-2 days before high-altitude activities. Carry altitude sickness medication. Emergency: 112.'),
('Udaipur', 'The City of Lakes, known for its stunning palaces, romantic boat rides, and vibrant culture. Udaipur''s lakeside setting and regal architecture make it one of India''s most enchanting cities.', 'Heritage', 'Oct–Mar', NULL, 24.5854, 73.7125, ARRAY['City Palace', 'Lake Pichola', 'Jag Mandir', 'Saheliyon-ki-Bari', 'Monsoon Palace'], ARRAY['Maharana Pratap Airport', 'GBH Hospital', 'Udaipur Bus Stand'], 'Udaipur is very safe for tourists. Drink bottled water. Tourist helpline: 1363.'),
('Rishikesh', 'The yoga capital of the world, nestled along the Ganges. Rishikesh blends spiritual experiences with white-water rafting, bungee jumping, and serene ashram stays.', 'Adventure', 'Sep–Nov', NULL, 30.0869, 78.2676, ARRAY['Laxman Jhula', 'Ram Jhula', 'Triveni Ghat', 'Beatles Ashram', 'Neer Garh Waterfall'], ARRAY['Jolly Grant Airport (35km)', 'AIIMS Rishikesh', 'ISBT Rishikesh'], 'Use certified operators for rafting and bungee. Avoid swimming in strong river currents. Emergency: 112.'),
('Varanasi', 'One of the oldest living cities in the world, where ancient ghats meet the holy Ganges. Varanasi is a spiritual powerhouse offering mesmerizing evening aartis and timeless cultural immersion.', 'Heritage', 'Oct–Mar', NULL, 25.3176, 83.0068, ARRAY['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Sarnath', 'Assi Ghat', 'Ramnagar Fort'], ARRAY['Lal Bahadur Shastri Airport', 'BHU Hospital', 'Varanasi Junction Railway'], 'Varanasi is crowded but safe. Watch belongings in busy ghats. Tourist helpline: 1800-111-363.'),
('Andaman Islands', 'Crystal-clear waters, pristine beaches, and rich marine biodiversity. The Andaman Islands are a tropical paradise perfect for snorkeling, scuba diving, and exploring untouched nature.', 'Beach', 'Nov–May', NULL, 11.7401, 92.6586, ARRAY['Havelock Island (Radhanagar Beach)', 'Neil Island', 'Cellular Jail', 'Ross Island', 'Baratang Island'], ARRAY['Veer Savarkar Airport', 'GB Pant Hospital', 'Phoenix Bay Jetty'], 'Check weather before boat trips. Carry reef-safe sunscreen. Emergency: 112.'),
('Darjeeling', 'Rolling tea gardens, stunning Himalayan views, and the iconic toy train. Darjeeling offers colonial charm, Buddhist monasteries, and breathtaking sunrise views from Tiger Hill.', 'Mountains', 'Mar–May', NULL, 27.0410, 88.2663, ARRAY['Tiger Hill', 'Darjeeling Himalayan Railway', 'Batasia Loop', 'Peace Pagoda', 'Happy Valley Tea Estate'], ARRAY['Bagdogra Airport (67km)', 'Darjeeling District Hospital', 'Darjeeling Bus Stand'], 'Carry warm clothing even in summer. Roads can be narrow and winding. Emergency: 112.');
