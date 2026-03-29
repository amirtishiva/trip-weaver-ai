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

const TABLE_FORMAT_RULES = `
STRICT OUTPUT RULES:
1. Output MUST be in clean pipe-delimited table format (rows and columns), NOT Markdown.
2. Do NOT use: Markdown syntax, asterisks (*), emojis, bullet points.
3. Each row represents a day-wise or category-wise breakdown.
4. Use clear column headers with pipes.

MANDATORY COLUMNS:
| Day/Category | Time/Duration | Location/Place | Activity/Description | Estimated Cost (INR) | Recommended Hotels | Recommended Restaurants | Transport Details | Notes/Tips | Emergency Contact Info |

ADDITIONAL RULES:
- Include realistic timing (morning, afternoon, evening or exact hours).
- Provide practical cost ranges in INR.
- Include real, commonly known hotels and restaurants.
- Emergency contacts must include: Local police, Hospital, Tourist helpline.
- Keep content concise. Each cell should contain short, precise information.
- Do NOT use long paragraphs. Every piece of info goes in a table cell.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { origin, destination, startDate, endDate, groupSize, travellerType, budgetAmount, mustVisit } = await req.json();

    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        origin, destination,
        start_date: startDate, end_date: endDate,
        group_size: groupSize,
        traveller_type: travellerType,
        budget_tier: "custom", // Placeholder to avoid schema issues
        must_visit: mustVisit || "",
        status: "generating",
      })
      .select()
      .single();

    if (tripError) {
      console.error("Database insert error:", tripError);
      throw new Error(`Database error: ${tripError.message}`);
    }

    const tripContext = `Origin: ${origin}\nDestination: ${destination}\nDates: ${startDate} to ${endDate}\nGroup Size: ${groupSize}\nTraveller Type: ${travellerType}\nBudget: ₹${budgetAmount} per person\nMust-Visit Places: ${mustVisit || "None specified"}`;

    try {
      // Agent 1: Discovery Agent
      const discoveryOutput = await callAgent(LOVABLE_API_KEY,
        `You are a Travel Discovery Agent specializing in Indian domestic travel. Research transportation options (trains with numbers, buses, flights) and accommodation for the destination.
${TABLE_FORMAT_RULES}`,
        `Research logistics for this trip:\n${tripContext}\n\nProvide a table with columns: Day/Category | Time/Duration | Location/Place | Activity/Description | Estimated Cost (INR) | Recommended Hotels | Recommended Restaurants | Transport Details | Notes/Tips | Emergency Contact Info\n\nCover: Transport options from origin to destination, local transport at destination, recommended hotels within the ₹${budgetAmount} per person total budget.`
      );

      // Agent 2: Planning Agent
      const planningOutput = await callAgent(LOVABLE_API_KEY,
        `You are a Travel Planning Agent. Create a day-by-day itinerary using the discovery information provided. Tailor to ${travellerType} traveller type.
${TABLE_FORMAT_RULES}`,
        `Using discovery data:\n${discoveryOutput}\n\nTrip details:\n${tripContext}\n\n${mustVisit ? `MUST include: ${mustVisit}` : "Create a balanced itinerary."}\n\nCreate a detailed day-by-day table with columns: Day/Category | Time/Duration | Location/Place | Activity/Description | Estimated Cost (INR) | Recommended Hotels | Recommended Restaurants | Transport Details | Notes/Tips | Emergency Contact Info`
      );

      // Agent 3: Budgeting Agent
      const budgetOutput = await callAgent(LOVABLE_API_KEY,
        `You are a Travel Budgeting Agent. Create itemized budget breakdowns.
${TABLE_FORMAT_RULES}`,
        `Using planning data:\n${planningOutput}\n\nTrip details:\n${tripContext}\n\nCreate budget tables with columns: Day/Category | Time/Duration | Location/Place | Activity/Description | Estimated Cost (INR) | Recommended Hotels | Recommended Restaurants | Transport Details | Notes/Tips | Emergency Contact Info\n\nInclude rows for: Travel costs, Accommodation per night, Food per day, Activities, Miscellaneous. Ensure the TOTAL cost for the entire trip does not exceed ₹${budgetAmount} per person. Show per-person costs for group of ${groupSize}.`
      );

      // Agent 4: Optimization Agent (Assembly)
      const finalPlan = await callAgent(LOVABLE_API_KEY,
        `You are the Travel Optimization Agent. Combine all specialist outputs into one clean, structured trip plan.
${TABLE_FORMAT_RULES}
CRITICAL: The final output must ONLY contain pipe-delimited tables with the mandatory columns. No markdown, no asterisks, no emojis, no bullet points. Start with a brief one-line trip summary, then tables only.`,
        `Combine these reports into one final trip plan:\n\nDISCOVERY:\n${discoveryOutput}\n\nPLANNING:\n${planningOutput}\n\nBUDGET:\n${budgetOutput}\n\nTrip: ${tripContext}\n\nOutput format:\nLine 1: Trip summary (plain text, one line)\nThen tables with sections:\n1. Transportation Plan table\n2. Day-by-Day Itinerary table (one row per activity)\n3. Budget Breakdown table\n4. Emergency Contacts table\n\nAll tables must use columns: Day/Category | Time/Duration | Location/Place | Activity/Description | Estimated Cost (INR) | Recommended Hotels | Recommended Restaurants | Transport Details | Notes/Tips | Emergency Contact Info`
      );

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
