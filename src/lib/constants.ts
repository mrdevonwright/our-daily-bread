import type { BibleVerseData, TestimonialData, RecipeStep } from "./types";

// =============================================
// Bible verses for the About page
// =============================================

export const BIBLE_VERSES: BibleVerseData[] = [
  {
    reference: "Matthew 6:11",
    text: "Give us this day our daily bread.",
    theme: "The Prayer That Started It All",
    reflection:
      "In the heart of the Lord's Prayer, Jesus taught us to ask God for daily provision. This movement takes that prayer literally—redirecting everyday bread purchases back into the hands of our local church communities. Every loaf baked and sold is an answer to that ancient prayer.",
  },
  {
    reference: "John 6:35",
    text: "Then Jesus declared, 'I am the bread of life. Whoever comes to me will never go hungry, and whoever believes in me will never be thirsty.'",
    theme: "Bread of Life",
    reflection:
      "Jesus used the most common food of his day as a symbol for himself. When we bake and share bread, we participate in a tradition as ancient as faith itself. Physical bread sustains the body; Jesus, the Bread of Life, sustains the soul.",
  },
  {
    reference: "John 6:48–51",
    text: "I am the bread of life. Your ancestors ate the manna in the wilderness, yet they died. But here is the bread that comes down from heaven, which anyone may eat and not die. I am the living bread that came down from heaven. Whoever eats this bread will live forever.",
    theme: "Living Bread",
    reflection:
      "Physical bread sustains us day to day. This movement uses physical bread to point to the One who sustains us eternally. Every Sunday loaf is a reminder that we are fed by something far greater than flour and water.",
  },
  {
    reference: "Matthew 26:26",
    text: "While they were eating, Jesus took bread, and when he had given thanks, he broke it and gave it to his disciples, saying, 'Take and eat; this is my body.'",
    theme: "The Breaking of Bread",
    reflection:
      "From the Last Supper to Sunday communion, breaking bread together is one of the most sacred acts in Christian community. When bakers in our movement give thanks and share bread with their congregation, they echo this timeless act of love.",
  },
  {
    reference: "Exodus 16:4",
    text: "Then the Lord said to Moses, 'I will rain down bread from heaven for you. The people are to go out each day and gather enough for that day.'",
    theme: "Daily Provision",
    reflection:
      "God provided manna in the desert—just enough for each day. Our movement mirrors this: local bakers providing fresh bread each Sunday, trusting that God will provide as we serve our neighbors. One loaf at a time. One Sunday at a time.",
  },
  {
    reference: "Matthew 4:4",
    text: "Jesus answered, 'It is written: Man shall not live on bread alone, but on every word that comes from the mouth of God.'",
    theme: "More Than Bread",
    reflection:
      "We bake bread. We sell bread. But this movement is ultimately about something far greater than flour—it is about building the Kingdom, strengthening the local church, and living out our faith in the most practical of ways.",
  },
];

// =============================================
// National impact statistics
// =============================================

export const NATIONAL_BREAD_STATS = {
  annual_us_bread_market_billions: 30,
  avg_household_annual_spend: 312,
  avg_weekly_per_person: 6,
  us_churches_total: 380_000,
  us_christians_millions: 230,
  christian_households_millions: 85,
} as const;

// Impact calculator constants
export const CALCULATOR = {
  annual_spend_per_person: 312, // avg annual bread spend per person
  loaf_price: 6,                // typical artisan sourdough price
  weeks_per_year: 52,
} as const;

// =============================================
// Testimonials
// =============================================

export const TESTIMONIALS: TestimonialData[] = [
  {
    quote:
      "We started with 3 bakers and 12 loaves. By month three, we had 14 bakers and raised over $800 for our building fund. The congregation looks forward to it every single Sunday.",
    author: "Pastor Mike Reynolds",
    church: "Grace Community Church — Nashville, TN",
  },
  {
    quote:
      "My sourdough was just a hobby before this. Now it's ministry. People line up before service just for my loaves. It has transformed how I think about my gifts.",
    author: "Sarah Whitmore",
    church: "Cornerstone Baptist — Dallas, TX",
  },
  {
    quote:
      "The recipe on this site is exactly what we use. Simple enough for beginners, delicious enough that people come back every week. God is doing something beautiful here.",
    author: "David & Carol Shen",
    church: "First Presbyterian — Portland, OR",
  },
];

// =============================================
// Sourdough recipe steps
// =============================================

export const RECIPE_INGREDIENTS = [
  { item: "Organic all-purpose flour", amount: "500g", link: "/resources#sourdough-essentials" },
  { item: "Warm water (75–80°F)", amount: "350g", link: null },
  { item: "Active sourdough starter", amount: "100g", link: "/resources#sourdough-essentials" },
  { item: "Fine sea salt", amount: "10g", link: "/resources#sourdough-essentials" },
];

export const RECIPE_EQUIPMENT = [
  { item: "Two 5-qt Dutch ovens (one per loaf)", link: "/resources#sourdough-essentials" },
  { item: "Kitchen scale — essential for accuracy", link: "/resources#nice-to-haves" },
  { item: "2 large mixing bowls", link: "/resources#sourdough-essentials" },
  { item: "Sourdough proofing set (banneton, lame & tools)", link: "/resources#sourdough-essentials" },
  { item: "Analog thermometer — pull at 200–210°F", link: "/resources#nice-to-haves" },
  { item: "Two hands, a loving heart, and the word of Christ", link: null },
];

export const RECIPE_STEPS: RecipeStep[] = [
  {
    day: "A Few Hours Before Baking",
    title: "Feed Your Starter",
    duration: "5 minutes active · 4–12 hours to activate",
    instructions: [
      "Use a 1:1:1 ratio by weight — equal parts starter, flour, and filtered water at room temperature. Example: 50g starter + 50g flour + 50g water.",
      "Stir well until fully combined, then cover loosely and leave in a warm spot (70–75°F).",
      "Your starter is ready when it has doubled in size and is bubbly and active — usually 4–12 hours. If it's sluggish, feed it once more before baking.",
    ],
    tip: "Don't over think feeding. The goal is to begin baking when the starter is just past its peak... but if you're a bit early or even many hours late, it's totally fine. Just try not to feed it right before you start mixing dough. Good to give it at least a few hours to digest if you can.",
  },
  {
    day: "Evening — ~10 minutes active",
    title: "Mix the Dough",
    duration: "10 minutes active · 30–60 minutes rest",
    instructions: [
      "In a large bowl, dissolve 100g active starter in 350g warm water (~80°F), stirring until milky.",
      "Add 500g flour and 10g salt. Mix with a spoon or your hands until no dry flour remains — the dough will look shaggy and sticky. No kneading needed.",
      "Cover with a damp towel and rest at room temperature for 30–60 minutes. This is autolyse: the flour absorbs the water and gluten begins to develop on its own.",
    ],
    tip: "Try mixing with a Danish dough whisk — it's a simple hook-shaped wire tool that cuts through shaggy dough effortlessly and barely needs washing. Way easier than a spoon or your hands for this initial mix.",
  },
  {
    day: "Evening — Repeated over ~2 hours",
    title: "Stretch & Fold",
    duration: "3–4 sets, 30 minutes apart",
    instructions: [
      "Wet your hands to prevent sticking. Reach under the dough, pull one side up, and fold it over the center. Rotate the bowl and repeat 4–6 times until the dough feels smoother.",
      "Cover and wait 30 minutes, then repeat. Do this 3–4 times total over the next 2 hours.",
      "Each set builds strength without kneading. The dough will become noticeably more elastic.",
    ],
    tip: "Try lifting the dough out of the bowl and doing your folds with both hands — it's easier and more satisfying! Just make sure to really wet your hands between each fold. It keeps the dough from sticking and makes the whole process much cleaner.",
  },
  {
    day: "Overnight — 8–12 hours",
    title: "Bulk Fermentation",
    duration: "Hands-off · 8–12 hours",
    instructions: [
      "After your last fold, cover the bowl with a wet towel and leave at room temperature overnight.",
      "The dough should roughly double in size, become airy with bubbles on top, and jiggle slightly when shaken.",
    ],
    tip: "If your kitchen is cool, it may take longer. If warm, check it earlier. It's ready when it looks pillowy and alive.",
  },
  {
    day: "Morning — ~10 minutes",
    title: "Shape the Loaf",
    duration: "10 minutes active · 1–2 hours to proof",
    instructions: [
      "Gently turn the dough out onto a lightly floured surface.",
      "Fold and pinch the edges into the center to form a ball, then flip it seam-side down. Cup your hands around it and rotate to tighten the surface — this tension is what gives the loaf a good rise.",
      "Place seam-side up in a well-floured proofing basket or a bowl lined with a floured tea towel.",
      "Cover and let it proof 1–2 hours at room temperature until puffy. It's ready when it springs back slowly (not immediately) when poked with a floured finger.",
    ],
    tip: "The dough will be quite stuck to the bowl! Before turning it out, gently pull the edges of the dough away from the sides to help free it. Then flip the bowl and give it a little jiggle — it'll come out much easier.",
  },
  {
    day: "Morning — ~1 hour",
    title: "Preheat & Bake",
    duration: "30 minutes preheat · 40–45 minutes baking",
    instructions: [
      "About 30 minutes before baking, place a Dutch oven (with lid) in your oven and preheat to 450°F.",
      "Once hot, carefully remove the Dutch oven. Turn the dough out onto parchment paper, seam-side down.",
      "Score the top with a sharp knife or razor — an X, a slash, or any pattern. This lets it expand in the oven.",
      "Lift the dough by the parchment into the pot. Drop a few ice cubes in alongside the dough, quickly cover with the lid, and get it back in the oven. The steam gives the dough maximum spring and softness. Bake covered for 20 minutes.",
      "Remove the lid and bake another 20–25 minutes until the crust is deep golden brown. The internal temperature should reach 200–210°F.",
    ],
  },
  {
    day: "After Baking",
    title: "Cool Before Slicing",
    duration: "At least 1–2 hours",
    instructions: [
      "Remove the loaf and cool on a wire rack for at least 1–2 hours before slicing.",
      "The bread is still setting inside as it cools — cutting too early gives you a gummy crumb.",
      "Enjoy with butter. Store in a bread bag or box; it keeps well for 3–5 days.",
    ],
    tip: "Especially enjoyable when shared with others :)",
  },
];

export const SELLING_TIPS = [
  {
    title: "Price with confidence",
    tip: "Artisan sourdough at grocery stores costs $8–14. At $6–8 per loaf you are delivering superior value. Do not undersell your work.",
  },
  {
    title: "Bake Thursday or Friday",
    tip: "Bake the day before or two days before Sunday. The crumb sets and flavor deepens with a day of rest.",
  },
  {
    title: "Create a simple sign",
    tip: "A handwritten sign mentioning the cause ('All proceeds support our church') dramatically increases sales and sets the tone.",
  },
  {
    title: "Accept Venmo and cash",
    tip: "Keep a Venmo QR code on your table and have small bills for change. Friction kills sales.",
  },
  {
    title: "Let people smell it",
    tip: "Keep one loaf unbagged and sliced. The aroma does your marketing for you.",
  },
  {
    title: "Build a waiting list",
    tip: "When you sell out (and you will), take names for next week. A waiting list creates urgency and excitement.",
  },
];

// =============================================
// US States for dropdowns
// =============================================

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

// Suggested donation amounts
export const DONATION_AMOUNTS = [10, 25, 50, 100, 250];
