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
  { item: "Bread flour", amount: "900g (about 7 cups)" },
  { item: "Whole wheat flour", amount: "100g (about ¾ cup)" },
  { item: "Water (filtered, 75–80°F)", amount: "700g total" },
  { item: "Active sourdough starter", amount: "200g (about 1 cup)" },
  { item: "Fine sea salt", amount: "20g (about 1 tbsp)" },
];

export const RECIPE_EQUIPMENT = [
  "Dutch oven (5–7 quart, cast iron)",
  "Kitchen scale (essential for accuracy)",
  "Large mixing bowl",
  "Bench scraper",
  "Banneton proofing basket (or bowl lined with floured towel)",
  "Lame or sharp razor blade for scoring",
  "Instant-read thermometer",
];

export const RECIPE_STEPS: RecipeStep[] = [
  {
    day: "Day 1 — Evening (8–9 PM)",
    title: "Build Your Levain",
    duration: "5 minutes active · rises overnight",
    instructions: [
      "Combine 50g active starter, 50g bread flour, 50g whole wheat flour, and 100g water (75°F) in a jar.",
      "Stir until completely smooth with no dry flour.",
      "Cover loosely with a lid or plastic wrap and leave at room temperature (68–72°F).",
      "The levain is ready when it has doubled in size and is bubbly and domed on top (8–12 hours).",
    ],
  },
  {
    day: "Day 2 — Morning (8–9 AM)",
    title: "Autolyse — Let the Flour Hydrate",
    duration: "30–60 minutes passive",
    instructions: [
      "In a large bowl, combine 850g bread flour and 100g whole wheat flour.",
      "Add 600g water (80°F) and mix until no dry flour remains. It will look shaggy.",
      "Cover and rest 30–60 minutes. This rest develops gluten without kneading.",
    ],
  },
  {
    day: "Day 2 — After Autolyse (9–10 AM)",
    title: "Mix the Dough",
    duration: "15 minutes active",
    instructions: [
      "Add 200g levain to the autolysed dough. Squeeze and fold it in with your hands until fully incorporated.",
      "Dissolve 20g salt in 50g warm water, then add to the dough. Work it in thoroughly.",
      "Perform your first 'stretch and fold': grab one side of the dough, stretch it up, fold it over the center. Rotate the bowl 90° and repeat 4 times.",
      "Cover and rest 30 minutes.",
    ],
  },
  {
    day: "Day 2 — Bulk Fermentation (10 AM – 4 PM)",
    title: "Stretch & Fold — Build Strength",
    duration: "Repeat 4 times, every 30 minutes",
    instructions: [
      "Every 30 minutes for the first 2 hours, perform one set of stretch and folds (4 folds per set).",
      "After 4 sets, leave the dough undisturbed until it has grown by 50–75% and looks puffy with bubbles — about 4–6 hours total at room temperature.",
      "The dough is ready when it jiggles like jello and you can see bubbles through the sides of the bowl.",
    ],
  },
  {
    day: "Day 2 — Afternoon (4–5 PM)",
    title: "Pre-Shape & Bench Rest",
    duration: "30 minutes",
    instructions: [
      "Gently turn the dough onto an unfloured work surface.",
      "Using a bench scraper, fold the edges of the dough under itself to build surface tension into a rough ball.",
      "Leave uncovered on the counter for 30 minutes (bench rest).",
    ],
  },
  {
    day: "Day 2 — Evening (5–6 PM)",
    title: "Final Shape & Into the Fridge",
    duration: "15 minutes active · overnight cold proof",
    instructions: [
      "Flour your banneton basket well (rice flour works best to prevent sticking).",
      "Flip your dough and shape into a tight boule: fold the top third down, fold the sides in, roll the bottom up and over, creating surface tension.",
      "Place seam-side up in the banneton, cover with a linen or plastic wrap.",
      "Refrigerate for 12–18 hours. Cold fermentation develops flavor and makes scoring easier.",
    ],
  },
  {
    day: "Day 3 — Morning (Baking Day!)",
    title: "Score & Bake",
    duration: "1 hour total · 500°F oven",
    instructions: [
      "Place your Dutch oven in the oven and preheat to 500°F (260°C) for at least 45 minutes.",
      "Remove dough from fridge. Cut a piece of parchment paper to fit your Dutch oven.",
      "Gently turn the cold dough onto the parchment, seam-side down.",
      "Score quickly and confidently: one long slash at a 30–45° angle, or your desired pattern.",
      "Lift dough by parchment into the screaming-hot Dutch oven. Put the lid on.",
      "Bake covered at 500°F for 20 minutes (the steam creates the ear and crust).",
      "Remove lid, reduce heat to 450°F, bake another 20–25 minutes until deep golden brown.",
      "Internal temperature should reach 205–210°F.",
      "Cool on a wire rack for at least 1 hour before cutting — the loaf is still baking inside!",
    ],
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
