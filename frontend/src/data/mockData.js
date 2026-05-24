// Mock catalogue and conversation scripts for the demo build.
// Everything here is hardcoded — no API calls — but the names, areas and
// pricing are real Lagos references so the experience reads as authentic.

export const restaurants = [
  {
    id: "cova",
    name: "Cova Restaurant & Lounge",
    category: "Continental · Rooftop",
    price_range: "₦₦₦",
    rating: 4.6,
    location: { lat: 6.4281, lng: 3.4219 },
    address: "Adeola Odeku St, Victoria Island",
    one_line_reason: "Rooftop views, group-friendly tables, fits a vibey night out.",
    image_placeholder_color: "#2E8B57",
  },
  {
    id: "shiro",
    name: "Shiro Lagos",
    category: "Asian Fusion · Fine Dining",
    price_range: "₦₦₦₦",
    rating: 4.7,
    location: { lat: 6.4318, lng: 3.4216 },
    address: "Landmark Centre, Victoria Island",
    one_line_reason: "Elegant, quiet enough to talk — built for impressing a client.",
    image_placeholder_color: "#F2B137",
  },
  {
    id: "mama-cass",
    name: "Mama Cass",
    category: "Nigerian · Buffet",
    price_range: "₦₦",
    rating: 4.3,
    location: { lat: 6.4395, lng: 3.4759 },
    address: "Admiralty Way, Lekki Phase 1",
    one_line_reason: "Filling Nigerian plates, walking distance, easy on the wallet.",
    image_placeholder_color: "#2E8B57",
  },
  {
    id: "the-yellow-chilli",
    name: "The Yellow Chilli",
    category: "Nigerian · Contemporary",
    price_range: "₦₦₦",
    rating: 4.5,
    location: { lat: 6.4324, lng: 3.4286 },
    address: "Oju Olobun Cl, Victoria Island",
    one_line_reason: "Proper jollof and pepper soup done right — a safe Naija classic.",
    image_placeholder_color: "#F2B137",
  },
  {
    id: "terra-kulture",
    name: "Terra Kulture",
    category: "Nigerian · Cultural",
    price_range: "₦₦",
    rating: 4.4,
    location: { lat: 6.4262, lng: 3.4288 },
    address: "Tiamiyu Savage St, Victoria Island",
    one_line_reason: "Calm, cultural setting with hearty local dishes — great for a chilled lunch.",
    image_placeholder_color: "#A9B6C9",
  },
  {
    id: "bungalow",
    name: "Bungalow Restaurant",
    category: "Continental · Casual",
    price_range: "₦₦₦",
    rating: 4.4,
    location: { lat: 6.4486, lng: 3.4736 },
    address: "Admiralty Way, Lekki Phase 1",
    one_line_reason: "Big menu, lively crowd, handles a group of four without stress.",
    image_placeholder_color: "#2E8B57",
  },
  {
    id: "z-kitchen",
    name: "Z Kitchen",
    category: "Continental · Brunch",
    price_range: "₦₦₦",
    rating: 4.5,
    location: { lat: 6.4407, lng: 3.4538 },
    address: "Kofo Abayomi, Victoria Island",
    one_line_reason: "Cosy, intimate corners — a soft spot for date night.",
    image_placeholder_color: "#F2B137",
  },
  {
    id: "rsvp",
    name: "RSVP Lagos",
    category: "Continental · Lounge",
    price_range: "₦₦₦₦",
    rating: 4.6,
    location: { lat: 6.4302, lng: 3.4197 },
    address: "Saka Tinubu, Victoria Island",
    one_line_reason: "Dim lighting, refined plates — turns dinner into an occasion.",
    image_placeholder_color: "#2E8B57",
  },
  {
    id: "ghana-high",
    name: "Ghana High Restaurant",
    category: "West African · Buka",
    price_range: "₦",
    rating: 4.2,
    location: { lat: 6.4356, lng: 3.4267 },
    address: "Saka Jojo St, Victoria Island",
    one_line_reason: "Banku, tilapia and serious value — buka energy, no pretence.",
    image_placeholder_color: "#A9B6C9",
  },
  {
    id: "ofada-boy",
    name: "Ofada Boy",
    category: "Nigerian · Street Food",
    price_range: "₦",
    rating: 4.3,
    location: { lat: 6.5009, lng: 3.3641 },
    address: "Allen Avenue, Ikeja",
    one_line_reason: "Ofada rice and ayamase that slaps — cheap, fast, filling.",
    image_placeholder_color: "#2E8B57",
  },
  {
    id: "the-place",
    name: "The Place",
    category: "Nigerian · Fast Food",
    price_range: "₦₦",
    rating: 4.1,
    location: { lat: 6.4541, lng: 3.4707 },
    address: "Admiralty Way, Lekki Phase 1",
    one_line_reason: "Quick rice and chicken when you're hungry now and short on time.",
    image_placeholder_color: "#F2B137",
  },
  {
    id: "nok-by-alara",
    name: "Nok by Alara",
    category: "Pan-African · Fine Dining",
    price_range: "₦₦₦₦",
    rating: 4.7,
    location: { lat: 6.4283, lng: 3.4361 },
    address: "Akin Olugbade St, Victoria Island",
    one_line_reason: "Stylish Pan-African plates in a gallery setting — special-occasion worthy.",
    image_placeholder_color: "#2E8B57",
  },
  {
    id: "cactus",
    name: "Cactus Restaurant",
    category: "Continental · Patisserie",
    price_range: "₦₦₦",
    rating: 4.4,
    location: { lat: 6.4221, lng: 3.4106 },
    address: "Maroko Rd, Victoria Island",
    one_line_reason: "Waterfront brunch with pastries — easy daytime hangout.",
    image_placeholder_color: "#A9B6C9",
  },
  {
    id: "iya-eba",
    name: "Iya Eba Kitchen",
    category: "Nigerian · Buka",
    price_range: "₦",
    rating: 4.0,
    location: { lat: 6.5005, lng: 3.3553 },
    address: "Opebi Link Rd, Ikeja",
    one_line_reason: "Swallow and soup like home — the budget hero of the list.",
    image_placeholder_color: "#2E8B57",
  },
  {
    id: "craft-gourmet",
    name: "Craft Gourmet",
    category: "Seafood · Grill",
    price_range: "₦₦₦",
    rating: 4.5,
    location: { lat: 6.4438, lng: 3.4699 },
    address: "Fola Osibo, Lekki Phase 1",
    one_line_reason: "Grilled prawns and a relaxed deck — seafood lovers' pick.",
    image_placeholder_color: "#F2B137",
  },
];

const byId = Object.fromEntries(restaurants.map((r) => [r.id, r]));
export const getRestaurant = (id) => byId[id];

// Each response set is matched against keywords in the user's message. The
// agentText leans into natural Nigerian English and a little Pidgin where it
// fits, the way the real cultural-adaptation layer is meant to.
export const responseSets = [
  {
    key: "budget",
    keywords: ["budget", "cheap", "affordable", "small money", "₦", "naira"],
    context: { area: "Lekki", group: "Solo", budget: "₦3k", occasion: "Quick bite" },
    agentText:
      "Say no more — for that budget I'm pointing you to spots wey go fill you up without wahala. These three give you the most food for your money.",
    restaurantIds: ["the-place", "ofada-boy", "iya-eba"],
  },
  {
    key: "date",
    keywords: ["date", "romantic", "girlfriend", "boyfriend", "anniversary", "partner"],
    context: { area: "Victoria Island", group: "2 people", budget: "₦40k", occasion: "Date night" },
    agentText:
      "For a date night, ambience is everything. I'm leaning toward dim lights, quiet corners and plates that look as good as they taste. Book ahead for these.",
    restaurantIds: ["z-kitchen", "rsvp", "nok-by-alara"],
  },
  {
    key: "group",
    keywords: ["group", "friends", "hangout", "squad", "crew", "vibes", "link up"],
    context: { area: "Lekki", group: "4 people", budget: "₦15k", occasion: "Casual hangout" },
    agentText:
      "Group of friends, good vibes, shareable space — that's the brief. These three handle a crew comfortably and keep the energy up all night.",
    restaurantIds: ["cova", "bungalow", "craft-gourmet"],
  },
  {
    key: "business",
    keywords: ["business", "meeting", "client", "work lunch", "professional", "colleague"],
    context: { area: "Victoria Island", group: "2 people", budget: "₦50k", occasion: "Business lunch" },
    agentText:
      "Business setting needs calm, professional and quiet enough to actually talk. I'd pick somewhere polished that won't rush you. Here's where I'd take a visiting client.",
    restaurantIds: ["shiro", "the-yellow-chilli", "cactus"],
  },
  {
    key: "default",
    keywords: [],
    context: { area: "Lagos", group: "Flexible", budget: "Open", occasion: "General" },
    agentText:
      "Gotcha. Based on what you've told me, here are three solid spots that hit a good balance of food, vibes and value. Tell me more and I'll fine-tune it.",
    restaurantIds: ["the-yellow-chilli", "terra-kulture", "mama-cass"],
  },
];

export function matchResponseSet(message) {
  const text = (message || "").toLowerCase();
  for (const set of responseSets) {
    if (set.key === "default") continue;
    if (set.keywords.some((kw) => text.includes(kw))) return set;
  }
  return responseSets.find((s) => s.key === "default");
}

export const quickActions = [
  { label: "🍛 I'm hungry now", message: "I'm hungry now, something nearby and quick" },
  { label: "🎉 Planning a hangout", message: "Planning a hangout with my friends, good vibes" },
  { label: "💼 Business lunch", message: "I have a business lunch with a client" },
  { label: "❤️ Date night", message: "Looking for a romantic date night spot" },
  { label: "🏠 Something nearby", message: "Something nearby in Lekki" },
  { label: "💰 Budget-friendly", message: "Budget-friendly options, small money" },
];

export const onboardingAreas = [
  "Lekki",
  "Victoria Island",
  "Yaba",
  "Ikeja",
  "Surulere",
  "Mainland (Other)",
];

export const onboardingCuisines = [
  "Nigerian",
  "Chinese",
  "Italian",
  "Seafood",
  "Street Food",
  "Fast Food",
  "Continental",
  "Anything",
];

export const onboardingPriorities = [
  "Great food above everything",
  "Ambience and vibes matter",
  "Value for money always",
  "Good service or nothing",
];

export const recommendationHistory = [
  {
    id: "h1",
    title: "Solo lunch in Lekki",
    when: "2 days ago",
    summary: "3 restaurants recommended",
    restaurantIds: ["mama-cass", "the-place", "bungalow"],
  },
  {
    id: "h2",
    title: "Date night in VI",
    when: "5 days ago",
    summary: "2 restaurants recommended",
    restaurantIds: ["z-kitchen", "rsvp"],
  },
  {
    id: "h3",
    title: "Group hangout in Yaba",
    when: "1 week ago",
    summary: "3 restaurants recommended",
    restaurantIds: ["cova", "craft-gourmet", "terra-kulture"],
  },
];

export const savedRestaurantIds = [
  "cova",
  "shiro",
  "the-yellow-chilli",
  "craft-gourmet",
  "nok-by-alara",
  "mama-cass",
];

export const profileStats = [
  { value: "12", label: "Recommendations received" },
  { value: "6", label: "Restaurants saved" },
  { value: "3", label: "Areas explored" },
  { value: "🇳🇬", label: "Nigerian food lover" },
];

export const LAGOS_CENTER = { lat: 6.4474, lng: 3.4548 };
