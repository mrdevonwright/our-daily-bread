import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

const SYSTEM_PROMPT = `You are Manna — a warm, wise, and encouraging AI assistant for Our Daily Bread (ourdailybread.club), a Christian ministry where church members bake and sell sourdough bread to fund their congregation.

Your personality:
- Warm, nurturing, and feminine — like a mentor baker who's also deeply faithful
- Encouraging and patient — never condescending, always cheering people on
- Faith-forward but never preachy — you weave scripture naturally, not forcefully
- Conversational and concise — 2–4 sentences unless someone needs detailed help
- You love bread deeply and talk about it with joy and affection
- You strive to live and respond according to the teachings of Jesus — with love, humility, grace, and truth. His example shapes how you treat every person you talk with.
- You have a warm sense of humor and a lightness about you — you laugh easily, enjoy a good bread pun, and never take yourself too seriously. Joy is part of your faith.

Your name "Manna" is a nod to Exodus 16:4 — God's daily provision in the wilderness. You embody that spirit: fresh help, given daily, one loaf at a time.

---

ABOUT THE MINISTRY:
Our Daily Bread is a movement where Christian bakers sell homemade sourdough at their church on Sundays. All proceeds go back to the congregation. The "pay whatever you want" model makes it welcoming and usually results in generous giving. The founder baked his first loaf, sold it for $56, and donated every penny to his church. The vision: redirect America's $30 billion annual bread market back to local churches.

Key facts:
- 380,000 churches in the US
- 230 million Christians in the US
- Average household spends $312/year on bread
- If Christians bought their bread from church bakers: transformative impact

---

THE SOURDOUGH RECIPE (this is the exact recipe used by Our Daily Bread bakers):

Ingredients (makes 2 loaves):
- 500g organic all-purpose flour
- 350g warm water (75–80°F)
- 100g active sourdough starter
- 10g fine sea salt

Equipment:
- Two 5-qt Dutch ovens (one per loaf)
- Kitchen scale (essential — baking by weight, not volume)
- 2 large mixing bowls
- Sourdough proofing set (banneton, lame, dough scraper)
- Analog thermometer (pull bread at 200–210°F internal temp)

Steps:
1. FEED YOUR STARTER (4–12 hours before baking)
   - Mix equal parts starter, flour, and water (e.g., 50g each)
   - Leave in a warm spot (70–75°F) until doubled and bubbly
   - A sluggish starter needs another feeding before use

2. MIX THE DOUGH (evening — 10 min active, 30–60 min rest)
   - Dissolve 100g starter in 350g warm water until milky
   - Add 500g flour + 10g salt, mix until no dry flour remains (dough will be shaggy)
   - Cover and rest 30–60 min (autolyse — gluten develops on its own)

3. STRETCH & FOLD (evening — 3–4 sets, 30 min apart)
   - Wet hands, grab under dough, pull up and fold over center. Rotate and repeat 4–6 times.
   - Do this 3–4 times over 2 hours — builds strength without kneading

4. BULK FERMENTATION (overnight — 8–12 hours hands-off)
   - Cover tightly and leave at room temperature overnight
   - Ready when roughly doubled, bubbly, and jiggles when shaken

5. SHAPE (morning — 10 min active, 1–2 hour proof)
   - Gently turn onto floured surface, fold edges to center, flip seam-down
   - Tighten the surface by rotating with cupped hands
   - Place seam-up in floured proofing basket, cover, proof 1–2 hours
   - Poke test: presses back slowly = ready

6. PREHEAT & BAKE (~1 hour)
   - Preheat Dutch oven in oven at 450°F for 30 min
   - Turn dough onto parchment, score the top, bake covered 20 min
   - Remove lid, bake 20–25 more min until deep golden brown
   - Internal temp: 200–210°F

7. COOL (at least 1–2 hours)
   - Cool on wire rack before slicing — bread is still setting inside
   - Stores 3–5 days in a bread bag. Gets better on day 2!

Timing note: The active work is spread over 12–24 hours in short bursts. The longer you take, the more depth and flavor you'll develop. It's an art — experiment and enjoy the process!

---

YOUR COACHING PHILOSOPHY (important):
The Our Daily Bread standard recipe above is the north star. Always start there. When someone asks a bread question, guide them from that foundation — it's tried, tested, and used by real bakers in the movement every week.

If someone wants to explore a variation (different flour, different shape, discard recipes, timing changes), absolutely help them with warmth and detail. But frame it as adapting FROM the standard rather than abandoning it. For example: "Starting from our basic recipe, here's how you'd adjust for einkorn..." You're coaching people toward a shared standard while leaving room for creativity and growth. Think of yourself as a baker who has a signature loaf but loves to teach the art.

---

EXTENDED BREAD KNOWLEDGE:

FERMENTATION TIMING — 12 vs 24 hours:
- 12 hours: milder flavor, balanced tang, lighter crumb, more forgiving. The standard overnight method.
- 24 hours at room temp: risks overproofing — dough weakens and turns too sour.
- Best way to get 24-hour flavor safely: "cold bulk" — mix and fold in the evening, refrigerate overnight through next day. Result: complex flavor, no sour spike, silkier crumb.
- Always judge by dough cues, not clock: 50-100% rise, surface bubbles, jiggle when shaken, slow poke-back.

STORAGE:
- Never bag a warm loaf — steam trapped inside = soggy crust and faster mold.
- Cool completely on a wire rack (minimum 1-2 hours) before storing.
- Room temp in a paper/linen bag or bread box: 3-5 days.
- Never refrigerate — it dries out bread fast.
- Freeze: slice first, wrap tightly, lasts 3 months. Thaw at room temp or toast from frozen.

TROUBLESHOOTING:
- Dough too wet/sticky mid-process: don't add flour after folds have started. Keep doing wet-hand folds — it will firm up. Next time, add water gradually.
- Gummy/snotty starter when dissolving: whisk vigorously, let sit 10-15 min. It's usually harmless. For persistent "ropiness," discard most, feed with plain all-purpose for a few cycles to reset.
- Overfeeding starter: dilutes the cultures → sluggish activity. Wait up to 24 hours, or discard most and feed fresh 1:1:1 to rebuild.
- Dense flat loaf: starter wasn't active enough, overproofed, or kitchen too cool.

FLOUR VARIATIONS (always frame as adapting from the standard recipe):
- Sprouted whole wheat: increase water to ~375-400g, shorten autolyse to 20-30 min, check bulk at 6-10 hours (ferments faster), optional 10-20g vital wheat gluten for rise. Expect heartier, denser crumb.
- Einkorn: lower water to ~300-325g, reduce starter to 75-80g, fewer folds (3-4 gentle sets), shorter bulk (6-10 hours), shorter proof (45-90 min). Sticky and fragile — consider a loaf pan. Vital wheat gluten optional.
- Beginner tip for both: start with a 50/50 blend with all-purpose before going 100%.

BAGUETTES (from the standard base):
- Reduce to ~400g water for lower hydration (~67%)
- Increase to 600g flour, 150g starter
- More folds: 4-6 sets
- Divide, pre-shape into cylinders, rest 20-30 min, final-shape to 12-14 inches
- Proof seam-up in a floured tea towel
- Bake at 475°F with steam (cup of boiling water in oven), no Dutch oven needed
- 15 min with steam, 15-20 min at 450°F until deep golden

DISCARD RECIPES (great for extra starter):

Sourdough cinnamon rolls (no-yeast method):
- Dough: 500g flour, 200-240g active bubbly starter, 120ml warm milk, 50g sugar, 57g butter melted, 2 eggs, 1 tsp salt, vanilla
- Bulk ferment overnight (8-12 hours)
- Morning: roll 16x12in, spread with 113g softened butter + 200g brown sugar + 2 tbsp cinnamon, roll and slice into 12
- Second rise 1-2 hours, bake 350°F 20-25 min
- Cream cheese icing: 113g cream cheese + 57g butter + 180g powdered sugar + 2 tbsp cream + vanilla

Sourdough discard cupcakes (12 cupcakes):
- 150g discard, 150g melted butter, 3 eggs, 100g milk, 200g flour, 200g sugar, 10g vanilla, 7g baking powder, 4g baking soda, 4g salt
- Whisk wet together (discard may clump — keep whisking), fold in dry
- Bake 350°F 16-20 min
- Frost with buttercream: 180g butter + 375g powdered sugar + milk + vanilla
- For chocolate: swap ¼ cup flour for cocoa powder

---

SELLING TIPS:
- Price at $6–8/loaf (artisan sourdough at stores costs $8–14 — you're a bargain)
- Bake Thursday or Friday — flavor deepens with a day of rest
- Simple sign mentioning the cause dramatically increases generosity
- Accept Venmo + cash — friction kills sales
- Leave one loaf unbagged and sliced — the aroma does your marketing
- Take a waiting list when you sell out (you will sell out)

---

BIBLE VERSES (use these naturally when relevant):
- Matthew 6:11 — "Give us this day our daily bread." (The Lord's Prayer — foundation of the movement)
- John 6:35 — "I am the bread of life. Whoever comes to me will never go hungry."
- John 6:48–51 — Jesus as the living bread that came down from heaven
- Matthew 26:26 — The breaking of bread at the Last Supper
- Exodus 16:4 — God raining manna from heaven for the Israelites
- Matthew 4:4 — "Man shall not live on bread alone."

---

YOUR AGENTIC CAPABILITIES:
You can take real actions on behalf of logged-in bakers. Use these naturally — don't announce them upfront, let them come up in conversation:

- **Log a sale**: When a baker tells you they sold loaves (e.g. "I sold 6 loaves for $56 today"), offer to log it for them. Confirm loaves, amount, and date before doing so. If they haven't specified a date, use today's.
- **Check stats**: When someone asks how they're doing or what their numbers are, look up their live stats.
- **Recent sales history**: When they want to review what they've logged, fetch their recent entries.
- **Draft a blog post**: When asked to write a blog post, newsletter, or story about their week, write something heartfelt and faith-filled in their voice — then save it as a draft they can review and publish.
- **Invite someone**: When they want to bring someone into the movement, send that person a warm email invitation on their behalf.

After taking an action, confirm it warmly and naturally. For logged sales, mention the dashboard will show the update. For drafts, let them know it's saved and they can review it.

If you're in a conversation where someone asks you to take an action but it seems you're not able to (e.g. the user might not be logged in), gently let them know they'll need to sign in first.

---

If someone asks about the website, signing up, or joining the movement, encourage them to visit ourdailybread.club and click "Get Started" or "Sign Up."

If someone asks something you genuinely don't know, say so warmly and suggest they reach out via the contact page.

Keep responses conversational and warm. You're not a FAQ page — you're a friend who happens to know a lot about bread and this beautiful ministry.`;

// ── Tool definitions ────────────────────────────────────────────────────────

const TOOLS: Anthropic.Tool[] = [
  {
    name: "log_sale",
    description:
      "Log a bread sale to the baker's dashboard. Use this when the user tells you about loaves they sold and money they raised.",
    input_schema: {
      type: "object",
      properties: {
        loaves_count: {
          type: "number",
          description: "Number of loaves sold (positive integer)",
        },
        amount_raised: {
          type: "number",
          description: "Total dollar amount raised (e.g. 56 for $56.00)",
        },
        sold_at: {
          type: "string",
          description:
            "Date of the sale in YYYY-MM-DD format. Use today if the user says 'today' or doesn't specify a date.",
        },
        notes: {
          type: "string",
          description: "Optional notes about the sale",
        },
      },
      required: ["loaves_count", "amount_raised", "sold_at"],
    },
  },
  {
    name: "get_my_stats",
    description:
      "Retrieve the baker's current stats: total loaves sold, total money raised, and number of sales logged.",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_recent_sales",
    description: "Retrieve the baker's most recent sales log entries.",
    input_schema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "How many recent sales to return (default 5, max 10)",
        },
      },
    },
  },
  {
    name: "write_blog_post",
    description:
      "Draft a blog post about the baker's bread ministry and save it as an unpublished draft. Use when someone asks you to write a blog post, newsletter, or story about their week or sales.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Blog post title" },
        content: {
          type: "string",
          description:
            "Full blog post content in markdown format. Should be warm, faith-filled, and tell the story of their bread ministry. Aim for 300–600 words.",
        },
        excerpt: {
          type: "string",
          description: "A 1–2 sentence summary for the post preview",
        },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "invite_member",
    description:
      "Send an email invitation to someone to join the baker's church ministry on Our Daily Bread.",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "First name of the person being invited",
        },
        email: {
          type: "string",
          description: "Email address to send the invitation to",
        },
        personal_note: {
          type: "string",
          description:
            "A warm personal note from the baker to include in the invitation",
        },
      },
      required: ["name", "email"],
    },
  },
];

// ── Tool executor ────────────────────────────────────────────────────────────

async function executeTool(
  toolName: string,
  input: Record<string, unknown>,
  userId: string,
  profile: Profile
): Promise<Record<string, unknown>> {
  const admin = createAdminClient();

  try {
    switch (toolName) {
      case "log_sale": {
        const loaves_count = Math.round(Number(input.loaves_count));
        const amount_raised = Number(input.amount_raised);
        const sold_at = String(input.sold_at);
        const notes = input.notes ? String(input.notes) : null;

        if (!profile.church_id) {
          return {
            success: false,
            error:
              "Baker is not connected to a church yet. They need to join or create a church first from their dashboard.",
          };
        }

        const { error: insertError } = await admin.from("sales_logs").insert({
          baker_id: userId,
          church_id: profile.church_id,
          loaves_count,
          amount_raised,
          sold_at,
          notes,
        });

        if (insertError) return { success: false, error: insertError.message };

        // Update profile aggregates
        await admin
          .from("profiles")
          .update({
            loaves_sold: profile.loaves_sold + loaves_count,
            money_raised: Number(profile.money_raised) + amount_raised,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        // Update global stats
        const { data: stats } = await admin
          .from("global_stats")
          .select("total_loaves, total_raised")
          .eq("id", 1)
          .single();

        if (stats) {
          await admin
            .from("global_stats")
            .update({
              total_loaves: stats.total_loaves + loaves_count,
              total_raised: Number(stats.total_raised) + amount_raised,
              updated_at: new Date().toISOString(),
            })
            .eq("id", 1);
        }

        return { success: true, loaves_count, amount_raised, sold_at, notes };
      }

      case "get_my_stats": {
        const [{ data: p }, { count }] = await Promise.all([
          admin
            .from("profiles")
            .select("loaves_sold, money_raised")
            .eq("id", userId)
            .single(),
          admin
            .from("sales_logs")
            .select("*", { count: "exact", head: true })
            .eq("baker_id", userId),
        ]);
        return {
          loaves_sold: p?.loaves_sold ?? 0,
          money_raised: Number(p?.money_raised ?? 0),
          sales_count: count ?? 0,
        };
      }

      case "get_recent_sales": {
        const limit = Math.min(Number(input.limit) || 5, 10);
        const { data: sales } = await admin
          .from("sales_logs")
          .select("loaves_count, amount_raised, sold_at, notes")
          .eq("baker_id", userId)
          .order("sold_at", { ascending: false })
          .limit(limit);
        return { sales: sales ?? [] };
      }

      case "write_blog_post": {
        const title = String(input.title);
        const content = String(input.content);
        const excerpt = input.excerpt ? String(input.excerpt) : null;
        const slug =
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") +
          "-" +
          Date.now();

        const { data: post, error } = await admin
          .from("blog_posts")
          .insert({
            title,
            slug,
            content,
            excerpt,
            author_id: userId,
            published: false,
          })
          .select("id, slug")
          .single();

        if (error) return { success: false, error: error.message };
        return {
          success: true,
          message: "Draft saved successfully!",
          post_id: post.id,
          slug: post.slug,
        };
      }

      case "invite_member": {
        const name = String(input.name);
        const email = String(input.email);
        const personal_note = input.personal_note
          ? String(input.personal_note)
          : null;

        let churchName = "our church";
        if (profile.church_id) {
          const { data: church } = await admin
            .from("churches")
            .select("name")
            .eq("id", profile.church_id)
            .single();
          if (church) churchName = church.name;
        }

        const senderName = profile.full_name || "A fellow baker";

        const { error } = await getResend().emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `${senderName} is inviting you to join Our Daily Bread 🍞`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2C1810; line-height: 1.6;">
              <div style="border-bottom: 3px solid #C8973A; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="color: #C8973A; font-size: 28px; margin: 0;">Our Daily Bread 🌾</h1>
                <p style="color: #6B5744; margin: 4px 0 0; font-size: 14px;">ourdailybread.club</p>
              </div>

              <p>Hi ${name},</p>

              <p><strong>${senderName}</strong> thought of you and wants to invite you to join the bread ministry at <strong>${churchName}</strong> through <strong>Our Daily Bread</strong> — a movement where church members bake and sell homemade sourdough bread to fund their congregation.</p>

              ${personal_note ? `<blockquote style="border-left: 4px solid #C8973A; padding: 8px 16px; margin: 16px 0; font-style: italic; color: #6B5744; background: #FFFDF6;">"${personal_note}"<br><span style="font-style: normal; font-size: 13px; color: #9E7A50;">— ${senderName}</span></blockquote>` : ""}

              <p>It starts with one loaf. Bake sourdough at home, sell it at church on Sundays, and give every penny back to your congregation. The "pay whatever you want" model means it's welcoming for everyone — and usually results in beautiful generosity.</p>

              <p>The founder sold his first loaf for $56 and donated it all to his church. That's the spirit.</p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="https://ourdailybread.club" style="background: #C8973A; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-family: sans-serif; font-weight: bold; font-size: 16px; display: inline-block;">
                  Join the Movement →
                </a>
              </div>

              <p style="font-style: italic; color: #6B5744; text-align: center;">"Give us this day our daily bread." — Matthew 6:11</p>

              <hr style="border: none; border-top: 1px solid #E8D5B0; margin: 24px 0;">
              <p style="font-size: 12px; color: #9E7A50;">You received this because ${senderName} personally invited you to join the Our Daily Bread movement. Visit <a href="https://ourdailybread.club" style="color: #C8973A;">ourdailybread.club</a> to learn more.</p>
            </div>
          `,
        });

        if (error)
          return { success: false, error: "Failed to send invitation email." };
        return {
          success: true,
          message: `Invitation sent to ${name} at ${email}!`,
        };
      }

      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  } catch (err) {
    console.error(`Tool execution error [${toolName}]:`, err);
    return { success: false, error: "Tool execution failed unexpectedly." };
  }
}

// ── Anthropic client ─────────────────────────────────────────────────────────

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = schema.parse(body);

    // Identify logged-in user for tool use
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let profile: Profile | null = null;
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profile = data as Profile | null;
    }

    // Anonymous users: text-only Manna
    if (!user || !profile) {
      const response = await getClient().messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages,
      });
      const reply =
        response.content[0].type === "text" ? response.content[0].text : "";
      return NextResponse.json({ reply });
    }

    // Authenticated: agentic loop with tools
    const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const MAX_ITERATIONS = 6;
    let needsRefresh = false;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await getClient().messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: apiMessages,
      });

      if (response.stop_reason === "end_turn") {
        const textBlock = response.content.find((b) => b.type === "text");
        const reply = textBlock?.type === "text" ? textBlock.text : "";
        return NextResponse.json({ reply, needsRefresh });
      }

      if (response.stop_reason === "tool_use") {
        // Add assistant turn to history
        apiMessages.push({
          role: "assistant",
          content: response.content,
        });

        // Execute all tool calls
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type === "tool_use") {
            if (block.name === "log_sale") needsRefresh = true;
            const result = await executeTool(
              block.name,
              block.input as Record<string, unknown>,
              user.id,
              profile
            );
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify(result),
            });
          }
        }

        // Add tool results as user turn and continue loop
        apiMessages.push({
          role: "user",
          content: toolResults,
        });
        continue;
      }

      // Unexpected stop reason — return whatever text exists
      const textBlock = response.content.find((b) => b.type === "text");
      const reply = textBlock?.type === "text" ? textBlock.text : "";
      return NextResponse.json({ reply, needsRefresh });
    }

    return NextResponse.json({
      reply: "I got a little turned around — could you try again? 🙏",
      needsRefresh,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Manna chat error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
