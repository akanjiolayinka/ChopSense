import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const LAGOS_LOCATIONS = [
  // Island - Victoria Island
  { keywords: ['vi', 'victoria island', 'date', 'fancy', 'nice', 'rsvp'], name: "RSVP Lagos", area: "Victoria Island", lat: 6.4281, lng: 3.4219, description: "Upscale dining, poolside bar, perfect for dates.", price: "₦₦₦₦", rating: 4.8, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop", tags: ["Date Night", "Upscale"] },
  { keywords: ['vi', 'nok', 'alara', 'african', 'contemporary'], name: "Nok by Alara", area: "Victoria Island", lat: 6.4285, lng: 3.4180, description: "Contemporary African dining in a stunning architectural space.", price: "₦₦₦", rating: 4.7, image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=600&auto=format&fit=crop", tags: ["African", "Fine Dining"] },
  { keywords: ['vi', 'ocean basket', 'seafood', 'platter'], name: "Ocean Basket", area: "Victoria Island", lat: 6.4251, lng: 3.4211, description: "Popular seafood spot known for giant sharing platters.", price: "₦₦", rating: 4.5, image: "https://images.unsplash.com/photo-1555986958-3011a09d6c16?q=80&w=600&auto=format&fit=crop", tags: ["Seafood", "Group"] },
  { keywords: ['vi', 'craft', 'gourmet', 'brunch', 'breakfast'], name: "Craft Gourmet", area: "Victoria Island", lat: 6.4290, lng: 3.4250, description: "Excellent brunch spot with amazing pastries and coffee.", price: "₦₦₦", rating: 4.6, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop", tags: ["Brunch", "Cafe"] },
  { keywords: ['vi', 'hard rock', 'burger', 'music', 'drinks'], name: "Hard Rock Cafe", area: "Victoria Island", lat: 6.4222, lng: 3.4411, description: "Classic American burgers, live music, and ocean views.", price: "₦₦₦", rating: 4.4, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop", tags: ["American", "Live Music"] },
  
  // Island - Lekki
  { keywords: ['lekki', 'phase 1', 'late night', 'shawarma', 'marcopolo', 'sailors'], name: "Sailors Lounge", area: "Lekki Phase 1", lat: 6.4474, lng: 3.4723, description: "Overwater lounge with great seafood, drinks, and late-night vibes.", price: "₦₦₦", rating: 4.5, image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=600&auto=format&fit=crop", tags: ["Waterfront", "Lounge"] },
  { keywords: ['lekki', 'circus', 'the circus', 'aesthetic', 'pictures'], name: "The Circus", area: "Lekki Phase 1", lat: 6.4480, lng: 3.4700, description: "Highly aesthetic cafe and restaurant, perfect for Instagram.", price: "₦₦₦", rating: 4.3, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop", tags: ["Aesthetic", "Cafe"] },
  { keywords: ['lekki', 'woks', 'chinese', 'asian'], name: "Woks & Koi", area: "Lekki Phase 1", lat: 6.4455, lng: 3.4688, description: "Premium Chinese dining with an intimate atmosphere.", price: "₦₦₦", rating: 4.6, image: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=600&auto=format&fit=crop", tags: ["Asian", "Intimate"] },
  { keywords: ['lekki', 'farm city', 'outdoor', 'grill', 'fish'], name: "Farm City", area: "Lekki", lat: 6.4490, lng: 3.4750, description: "24/7 outdoor spot known for grilled catfish and lively atmosphere.", price: "₦₦", rating: 4.2, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop", tags: ["Outdoor", "Grill"] },
  { keywords: ['lekki', 'ebony', 'life', 'jinja', 'asian'], name: "Jinja (EbonyLife)", area: "Victoria Island/Lekki", lat: 6.4300, lng: 3.4400, description: "Exquisite pan-Asian fusion inside EbonyLife Place.", price: "₦₦₦₦", rating: 4.7, image: "https://images.unsplash.com/photo-1579684947550-22e945225d9a?q=80&w=600&auto=format&fit=crop", tags: ["Fusion", "Luxury"] },

  // Mainland - Yaba
  { keywords: ['yaba', 'akoka', 'unilag', 'cheap', 'white house', 'amala'], name: "White House Buka", area: "Yaba", lat: 6.5056, lng: 3.3746, description: "Legendary mainland spot for authentic amala and local stews.", price: "₦", rating: 4.8, image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=600&auto=format&fit=crop", tags: ["Local", "Cheap Eats"] },
  { keywords: ['yaba', 'purple', 'bistro', 'pasta', 'affordable'], name: "Purple Bistro", area: "Yaba", lat: 6.5080, lng: 3.3760, description: "Cozy spot offering affordable pasta and mocktails for students.", price: "₦", rating: 4.2, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=600&auto=format&fit=crop", tags: ["Cozy", "Pasta"] },
  { keywords: ['yaba', 'lihao', 'chinese', 'mainland'], name: "Lihao Chinese", area: "Yaba", lat: 6.5030, lng: 3.3720, description: "Classic Chinese takeaway and dine-in near UNILAG.", price: "₦₦", rating: 4.1, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop", tags: ["Chinese", "Casual"] },

  // Mainland - Surulere
  { keywords: ['amala', 'shitta', 'surulere', 'local'], name: "Amala Shitta", area: "Surulere", lat: 6.4975, lng: 3.3533, description: "Surulere's finest local amala joint. Very busy but worth it.", price: "₦", rating: 4.6, image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop", tags: ["Local", "Street Food"] },
  { keywords: ['surulere', 'titos', 'pizza', 'fast food'], name: "Tito's Pizza", area: "Surulere", lat: 6.4950, lng: 3.3500, description: "Neighborhood favorite for thick-crust pizzas and quick bites.", price: "₦₦", rating: 4.0, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop", tags: ["Pizza", "Fast Food"] },
  { keywords: ['surulere', 'leisure', 'mall', 'filmhouse', 'eatery'], name: "Leisure Mall Food Court", area: "Surulere", lat: 6.4990, lng: 3.3550, description: "Multiple options including chicken, burgers, and ice cream.", price: "₦", rating: 4.0, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop", tags: ["Mall", "Variety"] },

  // Mainland - Ikeja
  { keywords: ['ikeja', 'mainland', 'gra', 'the place'], name: "The Place", area: "Ikeja GRA", lat: 6.5888, lng: 3.3585, description: "Clean, reliable, and premium fast-food serving Nigerian staples.", price: "₦₦", rating: 4.4, image: "https://images.unsplash.com/photo-1627308595229-7830f5c90683?q=80&w=600&auto=format&fit=crop", tags: ["Fast Food", "Reliable"] },
  { keywords: ['ikeja', 'gra', 'pool', 'lounge', 'orchid', 'bistro'], name: "Orchid House", area: "Ikeja GRA", lat: 6.5850, lng: 3.3590, description: "Beautiful garden setting with a mix of continental and Thai cuisine.", price: "₦₦₦", rating: 4.5, image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=600&auto=format&fit=crop", tags: ["Garden", "Thai"] },
  { keywords: ['ikeja', 'gra', 'yellow', 'chilli', 'seafood', 'premium'], name: "Yellow Chilli", area: "Ikeja GRA", lat: 6.5860, lng: 3.3560, description: "Premium Nigerian dining known for their iconic seafood okra.", price: "₦₦₦", rating: 4.7, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop", tags: ["Fine Dining", "Nigerian"] },
  { keywords: ['ikeja', 'city', 'mall', 'icm', 'spur'], name: "Spur Steak Ranches", area: "Ikeja (ICM)", lat: 6.6130, lng: 3.3580, description: "Family-friendly steakhouse located inside the Ikeja City Mall.", price: "₦₦", rating: 4.3, image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=600&auto=format&fit=crop", tags: ["Steak", "Family"] },
  
  // Mainland - Gbagada & Magodo
  { keywords: ['gbagada', 'dominos', 'pizza'], name: "Domino's Gbagada", area: "Gbagada", lat: 6.5510, lng: 3.3880, description: "Quick, hot pizza delivery and dine-in for the neighborhood.", price: "₦₦", rating: 4.1, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop", tags: ["Pizza", "Fast"] },
  { keywords: ['magodo', 'chicken', 'republic', 'refuel'], name: "Chicken Republic", area: "Magodo", lat: 6.6180, lng: 3.3750, description: "Home of the famous Refuel meal. Classic spicy fried chicken.", price: "₦", rating: 4.2, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop", tags: ["Chicken", "Cheap Eats"] },

  // General/Fallback high quality spots
  { keywords: ['sushi', 'izimisan', 'japanese', 'vi'], name: "Izimisan", area: "Victoria Island", lat: 6.4270, lng: 3.4240, description: "Top-tier authentic Japanese sushi and sake bar.", price: "₦₦₦₦", rating: 4.8, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop", tags: ["Sushi", "Japanese"] },
  { keywords: ['suya', 'gloves', 'university', 'yaba', 'street'], name: "University Suya", area: "Yaba", lat: 6.5050, lng: 3.3700, description: "The most famous spicy grilled beef (suya) spot on the mainland.", price: "₦", rating: 4.9, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop", tags: ["Street Food", "Late Night"] }
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export function useGroqChat(preferences = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 6.5244, lng: 3.3792 }); // Default: Lagos center

  // Helper function for AI calls
  const callAI = async (userPrompt, systemPromptOverride = null) => {
    const systemPrompt = systemPromptOverride || SYSTEM_PROMPT;
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Groq API Error:", error);
      throw error;
    }
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation not available, using default Lagos center");
        }
      );
    }
  }, []);

  // Dynamically build the system prompt based on preferences
  const activeDiet = preferences.dietary
    ? Object.entries(preferences.dietary).filter(([_, v]) => v).map(([k]) => k).join(', ')
    : '';

  const SYSTEM_PROMPT = `You are ChopSense, a highly knowledgeable Lagos foodie friend and conversational Nigerian food intelligence agent.
You understand who the user is, where they are, and what they're feeling, and you tell them exactly where to eat next.
You are NOT a boring AI. You are a real Lagosian.
You must strictly adhere to the user's language preference and dietary restrictions.

USER PREFERENCES:
- Language Style: ${preferences.language || 'Heavy Pidgin / Street'}
- Dietary Restrictions: ${activeDiet || 'None'}
- Vibe/Atmosphere: ${preferences.atmosphere || 'Any'}
- Budget Level: ${preferences.budget || 'Standard'}
- Transportation: ${preferences.transport || 'Uber/Bolt'}
- Spice Tolerance: ${preferences.spiceLevel || 'Medium'}
- Meal Size: ${preferences.mealSize || 'Regular'}
- Typical Occasion: ${preferences.occasion || 'Casual'}
- Cuisine Preference: ${preferences.cuisinePreference || 'Nigerian'}

CRITICAL INSTRUCTION: Reply ENTIRELY in the requested language style (${preferences.language}). 
- If Yoruba, Igbo, or Hausa is selected, your response MUST be heavily infused with that language, using local slang, proverbs, and conversational warmth native to that culture, mixed with Nigerian English/Pidgin as appropriate for a modern Lagosian.
- If Heavy Pidgin, use street-level Lagos Pidgin for everything.
- If Formal English, be polite but maintain Nigerian cultural context.

When a user asks for a recommendation, you must:
1. Reason about their context (who they are with, mood, budget, location, spice tolerance, occasion).
2. Look at your internal knowledge of Lagos restaurants (use the ones we know about).
3. Recommend 1 or 2 specific places and explain WHY it fits their exact mood/budget/spice level/occasion.
4. Adhere strictly to the requested language setting. Do NOT break character.
5. If they have dietary restrictions, explicitly mention how the recommendation caters to it.
6. Consider their spice tolerance - if they want "Mild", avoid very spicy suya spots. If "Extra Hot", recommend places with authentic pepper.
7. Consider their meal size preference - if "Small", suggest places with good appetizers/tapas. If "Extra Large", suggest spots known for generous portions.
8. Consider their occasion - if "Date Night", recommend romantic spots. If "Business", suggest quieter, professional venues.

Keep your responses concise, highly conversational, and culturally authentic. Do not output JSON.`;

  const [messages, setMessages] = useState([
    { role: 'system', content: SYSTEM_PROMPT }
  ]);

  useEffect(() => {
    setMessages(prev => {
      const newMsgs = [...prev];
      if (newMsgs.length > 0 && newMsgs[0].role === 'system') {
        newMsgs[0].content = SYSTEM_PROMPT;
      } else {
        newMsgs.unshift({ role: 'system', content: SYSTEM_PROMPT });
      }
      return newMsgs;
    });
  }, [preferences.language, preferences.dietary, preferences.atmosphere, preferences.budget, preferences.transport, preferences.spiceLevel, preferences.mealSize, preferences.occasion, preferences.cuisinePreference]);

  const sendMessage = async (userText) => {
    setIsLoading(true);
    
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: newMessages,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseRaw = data.choices[0].message.content;
      
      // Match locations based on keywords in the AI's response or the user's prompt
      const combinedText = (userText + " " + aiResponseRaw).toLowerCase();
      let matchedLocations = [];
      
      for (const loc of LAGOS_LOCATIONS) {
        if (loc.keywords.some(kw => combinedText.includes(kw))) {
          const distance = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            loc.lat, 
            loc.lng
          );
          matchedLocations.push({
            name: loc.name,
            area: loc.area,
            lat: loc.lat,
            lng: loc.lng,
            description: loc.description,
            price: loc.price,
            rating: loc.rating,
            image: loc.image,
            tags: loc.tags,
            distance: distance.toFixed(1) // Distance in km with 1 decimal
          });
        }
      }

      // Sort by distance (closest first)
      matchedLocations.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // Limit to top 3 closest results to avoid spamming
      matchedLocations = matchedLocations.slice(0, 3);

      // Fallback location if none matched
      if (matchedLocations.length === 0) {
        const fallbackLoc = LAGOS_LOCATIONS[0];
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          fallbackLoc.lat, 
          fallbackLoc.lng
        );
        matchedLocations.push({
          name: fallbackLoc.name,
          area: fallbackLoc.area,
          lat: fallbackLoc.lat,
          lng: fallbackLoc.lng,
          description: fallbackLoc.description,
          price: fallbackLoc.price,
          rating: fallbackLoc.rating,
          image: fallbackLoc.image,
          tags: fallbackLoc.tags,
          distance: distance.toFixed(1)
        });
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponseRaw }]);
      setIsLoading(false);
      
      return {
        reply: aiResponseRaw,
        locations: matchedLocations
      };

    } catch (error) {
      console.error("Groq API Error:", error);
      setIsLoading(false);
      return {
        reply: "Ah, network network. My brain dey buffer small. Abeg try again.",
        locations: [{ name: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792, description: "General Lagos Area" }]
      };
    }
  };

  return { sendMessage, isLoading, userLocation, callAI };
}
