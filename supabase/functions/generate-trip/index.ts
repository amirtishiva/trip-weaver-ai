import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function callAgent(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI agent failed [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { origin, destination, startDate, endDate, groupSize, travellerType, budgetTier, mustVisit } = await req.json();

    // Create trip record
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        origin, destination,
        start_date: startDate, end_date: endDate,
        group_size: groupSize,
        traveller_type: travellerType,
        budget_tier: budgetTier,
        must_visit: mustVisit || "",
        status: "generating",
      })
      .select()
      .single();

    if (tripError) throw new Error(`Failed to create trip: ${tripError.message}`);

    const tripContext = `Origin: ${origin}\nDestination: ${destination}\nDates: ${startDate} to ${endDate}\nGroup Size: ${groupSize}\nTraveller Type: ${travellerType}\nBudget Tier: ${budgetTier}\nMust-Visit Places: ${mustVisit || "None specified"}`;

    try {
      // Agent 1: Travel Logistics Analyst
      const logisticsOutput = await callAgent(LOVABLE_API_KEY,
        `You are a Travel Logistics Analyst specializing in Indian domestic travel. Research the most efficient and cost-effective travel and accommodation plans. Provide specific train numbers, bus operators, flight options, and accommodation recommendations for both Frugal and Comfort tiers. Tailor recommendations to the traveller type: ${travellerType}. Format output in clean Markdown.`,
        `Plan the logistics for this trip:\n${tripContext}\n\nProvide:\n1. Transportation options (trains with numbers, buses, flights) with approximate costs\n2. Accommodation strategy for ${budgetTier} tier\n3. Local transport recommendations at destination`
      );

      // Agent 2: Budgeting Specialist
      const budgetOutput = await callAgent(LOVABLE_API_KEY,
        `You are a Travel Budgeting Specialist. Create detailed, itemized budgets for Indian travel. Use the logistics information provided to build accurate cost estimates. Always provide both Frugal and Comfort tier comparisons. Format as Markdown tables.`,
        `Using this logistics plan:\n${logisticsOutput}\n\nTrip details:\n${tripContext}\n\nCreate:\n1. A detailed Markdown budget table comparing Frugal vs Comfort across: Travel, Accommodation, Food, Activities, Miscellaneous\n2. Per-person cost breakdown for group of ${groupSize}\n3. Money management tips for group trips`
      );

      // Agent 3: Local Experience Curator
      const mustVisitConstraint = mustVisit
        ? `IMPORTANT: The itinerary MUST include these places: ${mustVisit}. Schedule them on specific days and flag any logistical concerns.`
        : "Create a balanced, AI-curated itinerary with the best experiences.";

      const itineraryOutput = await callAgent(LOVABLE_API_KEY,
        `You are a Local Experience Curator and Destination Expert for India. Design rich, day-by-day itineraries with cultural highlights, adventure activities, culinary recommendations, and backup plans. Tailor to ${travellerType} traveller on ${budgetTier} budget. Format in Markdown.`,
        `Using logistics and budget context:\n${logisticsOutput}\n\n${budgetOutput}\n\nTrip details:\n${tripContext}\n\n${mustVisitConstraint}\n\nCreate:\n1. Day-by-day itinerary (Day 1, Day 2... Day N)\n2. Culinary guide with must-try dishes and recommended restaurants\n3. Adventure/activity guide with costs and safety tips\n4. 2+ contingency plans for weather or closures`
      );

      // Agent 4: Chief Travel Planner (Assembly)
      const finalPlan = await callAgent(LOVABLE_API_KEY,
        `You are the Chief Travel Planner. Synthesize all specialist outputs into one polished, cohesive trip plan document. Write a compelling intro (Trip Feasibility & Overview) and closing (Final Checklist & Responsible Tourism tips). Format as a professional, well-structured Markdown document with clear sections.`,
        `Assemble these specialist reports into one final trip plan document:\n\n## LOGISTICS REPORT\n${logisticsOutput}\n\n## BUDGET REPORT\n${budgetOutput}\n\n## ITINERARY & EXPERIENCES\n${itineraryOutput}\n\nTrip details:\n${tripContext}\n\nCreate a final document with:\n1. Trip Feasibility & Overview (intro)\n2. Transportation & Accommodation Plan\n3. Budget Breakdown\n4. Day-by-Day Itinerary\n5. Food & Culinary Guide\n6. Activities & Adventure Guide\n7. Contingency Plans\n8. Final Checklist & Responsible Tourism Tips`
      );

      // Update trip with completed plan
      await supabase.from("trips").update({
        plan_content: finalPlan,
        status: "completed",
      }).eq("id", trip.id);

      return new Response(JSON.stringify({ tripId: trip.id, plan: finalPlan }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (agentError) {
      await supabase.from("trips").update({ status: "failed" }).eq("id", trip.id);
      throw agentError;
    }

  } catch (e) {
    console.error("generate-trip error:", e);
    const status = e instanceof Error && e.message.includes("429") ? 429 : 500;
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
