import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Search, Settings, Home, Bookmark, LogOut, Send, MoreVertical, Flame, ArrowRight, User, Mic, Star, MapPin, Leaf, RefreshCw, UtensilsCrossed, Calculator, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView';
import { useGroqChat, LAGOS_LOCATIONS } from '../hooks/useGroqChat';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'recipes', icon: ChefHat, label: 'Recipe Generator' },
  { id: 'macros', icon: Flame, label: 'Macro Tracker' },
  { id: 'dietary', icon: Leaf, label: 'Dietary Adapt' },
  { id: 'explore', icon: Search, label: 'Explore Map' },
  { id: 'saved', icon: Bookmark, label: 'Saved Spots' },
  { id: 'preferences', icon: Settings, label: 'Preferences' },
];

const QUICK_ACTIONS = [
  "Somewhere cheap around Yaba",
  "A nice spot for a first date in VI",
  "Craving correct amala right now",
  "Late night food in Lekki"
];

const RECIPES = ["Jollof Rice", "Beef Suya", "Vegan Egusi", "Plantain Frittata", "Pounded Yam", "Efo Riro"];

// Recipe Generator Component
function RecipeGenerator({ callAI, preferences }) {
  const [recipeIdx, setRecipeIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeContent, setRecipeContent] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState("");

  const handleGenerate = async (recipeName) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setSelectedRecipe(recipeName);

    try {
      const systemPrompt = `You are ChopSense, a Nigerian food AI that generates detailed recipes. 
Generate a complete recipe for ${recipeName} considering the user's preferences:
- Dietary restrictions: ${Object.entries(preferences.dietary || {}).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'None'}
- Spice tolerance: ${preferences.spiceLevel || 'Medium'}
- Meal size: ${preferences.mealSize || 'Regular'}

Include: ingredients with Nigerian measurements, step-by-step instructions, prep time, cooking time, and nutritional info.
Format in markdown with clear sections.`;

      const response = await callAI(`Generate a recipe for ${recipeName}`, systemPrompt);
      setRecipeContent(response);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setRecipeContent("Sorry, I couldn't generate the recipe right now. Please try again.");
    }

    setIsGenerating(false);
  };

  const handleRegenerate = () => {
    if (selectedRecipe) {
      handleGenerate(selectedRecipe);
    } else {
      setRecipeIdx((prev) => (prev + 1) % RECIPES.length);
      handleGenerate(RECIPES[recipeIdx]);
    }
  };

  return (
    <div className="flex-1 p-8 h-full overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recipe Generator</h1>
            <p className="text-white/60">Generate authentic Nigerian recipes tailored to your preferences</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="p-3 rounded-full bg-gold/20 hover:bg-gold/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={cn("text-gold", isGenerating && "animate-spin")} />
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {RECIPES.map((recipe, idx) => (
            <motion.button
              key={recipe}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenerate(recipe)}
              disabled={isGenerating}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                selectedRecipe === recipe
                  ? "bg-gold text-navy border-gold shadow-[0_0_15px_rgba(212,162,76,0.3)]"
                  : "bg-transparent border-white/20 text-white/60 hover:border-gold/50 hover:text-white"
              )}
            >
              {recipe}
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 border border-white/10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-forest to-emerald-400 flex items-center justify-center shadow-lg">
              <UtensilsCrossed size={24} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-white/60">ChopSense AI</div>
              <div className="font-semibold">Recipe Generator</div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="h-4 w-3/4 bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-full bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="h-4 w-5/6 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                <div className="h-4 w-4/6 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
              </motion.div>
            ) : recipeContent ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-xl bg-forest/20 border border-forest/30">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-3" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold text-gold mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 text-white/80" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 ml-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 ml-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1 text-white/70" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-gold" {...props} />,
                    }}
                  >
                    {recipeContent}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <UtensilsCrossed size={48} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Select a recipe above to generate a detailed recipe</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// Macro Tracker Component
function MacroTracker() {
  const [selectedFood, setSelectedFood] = useState("");
  const [macros, setMacros] = useState(null);

  const FOODS = [
    { name: "Jollof Rice (1 plate)", calories: 350, protein: 12, carbs: 65, fat: 8, fiber: 3 },
    { name: "Eba & Egusi (1 serving)", calories: 420, protein: 18, carbs: 45, fat: 22, fiber: 5 },
    { name: "Amala & Ewedu (1 serving)", calories: 380, protein: 15, carbs: 50, fat: 18, fiber: 4 },
    { name: "Suya (10 sticks)", calories: 280, protein: 25, carbs: 5, fat: 18, fiber: 2 },
    { name: "Pounded Yam (1 wrap)", calories: 320, protein: 8, carbs: 70, fat: 2, fiber: 3 },
    { name: "Fried Plantain (Dodo)", calories: 200, protein: 2, carbs: 28, fat: 10, fiber: 2 },
    { name: "Moimoi (2 pieces)", calories: 180, protein: 12, carbs: 20, fat: 8, fiber: 4 },
    { name: "Beans & Plantain", calories: 350, protein: 14, carbs: 55, fat: 12, fiber: 8 },
    { name: "Pepper Soup (1 bowl)", calories: 250, protein: 20, carbs: 15, fat: 12, fiber: 3 },
    { name: "Banga Soup (1 bowl)", calories: 320, protein: 18, carbs: 25, fat: 18, fiber: 4 },
    { name: "Chicken Stew (1 plate)", calories: 380, protein: 28, carbs: 20, fat: 22, fiber: 2 },
    { name: "Fish Pepper Soup", calories: 220, protein: 24, carbs: 12, fat: 10, fiber: 2 },
    { name: "Gizdodo (1 plate)", calories: 420, protein: 12, carbs: 55, fat: 18, fiber: 5 },
    { name: "Coconut Rice (1 plate)", calories: 380, protein: 10, carbs: 60, fat: 14, fiber: 4 },
    { name: "Fried Rice (1 plate)", calories: 400, protein: 14, carbs: 58, fat: 16, fiber: 3 },
    { name: "Ofada Rice & Sauce", calories: 360, protein: 16, carbs: 52, fat: 14, fiber: 4 },
    { name: "Abacha & Ugba", calories: 280, protein: 8, carbs: 40, fat: 12, fiber: 6 },
    { name: "Nkwobi (1 bowl)", calories: 450, protein: 32, carbs: 15, fat: 30, fiber: 2 },
    { name: "Isi Ewu (1 bowl)", calories: 420, protein: 28, carbs: 18, fat: 28, fiber: 3 },
    { name: "Boli & Fish", calories: 320, protein: 22, carbs: 35, fat: 14, fiber: 4 },
  ];

  const handleCalculate = () => {
    const food = FOODS.find(f => f.name === selectedFood);
    if (food) {
      setMacros(food);
    }
  };

  return (
    <div className="flex-1 p-8 h-full overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Macro Tracker</h1>
          <p className="text-white/60">Track nutritional values for your favorite Nigerian dishes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Food Selection */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-panel rounded-3xl p-6 border border-white/10"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2"><Calculator size={18} className="text-gold" /> Select Food</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Choose a dish</label>
                <select
                  value={selectedFood}
                  onChange={(e) => setSelectedFood(e.target.value)}
                  className="w-full bg-navy border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-gold/50 text-white"
                >
                  <option value="">Select a dish...</option>
                  {FOODS.map(food => (
                    <option key={food.name} value={food.name}>{food.name}</option>
                  ))}
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCalculate}
                disabled={!selectedFood}
                className="w-full py-3 rounded-xl bg-gold text-navy font-bold disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                Calculate Macros
              </motion.button>
            </div>
          </motion.div>

          {/* Macro Display */}
          {macros && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-white/10"
              >
                <h3 className="font-bold mb-6">{macros.name}</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gold">{macros.calories}</div>
                    <div className="text-xs text-white/60">Calories</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-forest">{macros.protein}g</div>
                    <div className="text-xs text-white/60">Protein</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-400">{macros.carbs}g</div>
                    <div className="text-xs text-white/60">Carbs</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-rose-400">{macros.fat}g</div>
                    <div className="text-xs text-white/60">Fat</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-400">{macros.fiber}g</div>
                    <div className="text-xs text-white/60">Fiber</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Calories</span>
                      <span className="font-bold">{macros.calories} kcal</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(macros.calories / 500) * 100}%` }}
                        className="h-full bg-gold"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Protein</span>
                      <span className="font-bold">{macros.protein}g</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(macros.protein / 35) * 100}%` }}
                        className="h-full bg-forest"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Carbs</span>
                      <span className="font-bold">{macros.carbs}g</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(macros.carbs / 80) * 100}%` }}
                        className="h-full bg-blue-400"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Fat</span>
                      <span className="font-bold">{macros.fat}g</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(macros.fat / 35) * 100}%` }}
                        className="h-full bg-rose-400"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Fiber</span>
                      <span className="font-bold">{macros.fiber}g</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(macros.fiber / 10) * 100}%` }}
                        className="h-full bg-purple-400"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-6 border border-white/10"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2"><Flame size={18} className="text-orange-400" /> Quick Comparison</h3>
                <div className="space-y-3">
                  {FOODS.slice(0, 5).map((food, idx) => (
                    <motion.div
                      key={food.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => { setSelectedFood(food.name); setMacros(food); }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span className="text-sm text-white/80">{food.name}</span>
                      <span className="text-xs font-mono text-gold">{food.calories} kcal</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Dietary Adaptations Component
function DietaryAdaptations({ callAI, preferences }) {
  const [selectedDish, setSelectedDish] = useState("");
  const [restriction, setRestriction] = useState("");
  const [adaptation, setAdaptation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAdapt = async () => {
    if (!selectedDish || !restriction) return;

    setIsGenerating(true);

    try {
      const systemPrompt = `You are ChopSense, a Nigerian food AI that provides dietary adaptations for Nigerian dishes.
Generate a detailed dietary adaptation for ${selectedDish} to make it ${restriction}.
Consider the user's other preferences: spice level ${preferences.spiceLevel || 'Medium'}, meal size ${preferences.mealSize || 'Regular'}.

Provide:
1. The adapted dish name
2. Specific ingredient substitutions with Nigerian alternatives
3. Cooking adjustments if needed
4. Tips for maintaining authentic flavor
5. Any nutritional considerations

Format in markdown with clear sections.`;

      const response = await callAI(`Generate a ${restriction} adaptation for ${selectedDish}`, systemPrompt);
      setAdaptation({ content: response, isAI: true });
    } catch (error) {
      console.error("Error generating adaptation:", error);
      setAdaptation({ content: "Sorry, I couldn't generate the adaptation right now. Please try again.", isAI: false });
    }

    setIsGenerating(false);
  };

  return (
    <div className="flex-1 p-8 h-full overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dietary Adaptations</h1>
          <p className="text-white/60">Get intelligent substitutions for your dietary needs without losing authentic taste</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-panel rounded-3xl p-6 border border-white/10"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2"><Leaf size={18} className="text-green-400" /> Find Adaptation</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Select Dish</label>
                <select
                  value={selectedDish}
                  onChange={(e) => setSelectedDish(e.target.value)}
                  className="w-full bg-navy border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-gold/50 text-white"
                >
                  <option value="">Choose a dish...</option>
                  <option value="jollof">Jollof Rice</option>
                  <option value="egusi">Egusi Soup</option>
                  <option value="amala">Amala</option>
                  <option value="suya">Suya</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Dietary Restriction</label>
                <select
                  value={restriction}
                  onChange={(e) => setRestriction(e.target.value)}
                  className="w-full bg-navy border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-gold/50 text-white"
                >
                  <option value="">Choose restriction...</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="lowcarb">Low-Carb</option>
                  <option value="halal">Halal</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdapt}
                disabled={!selectedDish || !restriction || isGenerating}
                className="w-full py-3 rounded-xl bg-gold text-navy font-bold disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                {isGenerating ? 'Generating...' : 'Get Adaptation'}
              </motion.button>
            </div>
          </motion.div>

          {adaptation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-3xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                  <Leaf size={18} className="text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-white/60">AI-Generated Adaptation</div>
                  <div className="text-sm font-medium">{selectedDish} → {restriction}</div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-forest/20 border border-forest/30">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-3" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold text-gold mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 text-white/80" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 ml-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 ml-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1 text-white/70" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-gold" {...props} />,
                  }}
                >
                  {adaptation.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock saved spots data for the demo
const MOCK_SAVED_SPOTS = [
  LAGOS_LOCATIONS[0], // RSVP
  LAGOS_LOCATIONS[5], // Sailors
  LAGOS_LOCATIONS[10] // White House
];

export default function AppDashboard() {
  const [userName, setUserName] = useState("Demo User");
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prompt, setPrompt] = useState("");
  const [displayChat, setDisplayChat] = useState([]);
  const [mapLocations, setMapLocations] = useState([
    { name: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792, description: "Your current area." }
  ]);
  
  // State for functional preferences
  const [preferences, setPreferences] = useState({
    dietary: { vegetarian: false, vegan: false, halal: false, glutenFree: false, nutFree: false },
    language: 'Heavy Pidgin / Street',
    atmosphere: 'Any',
    budget: 'Standard',
    transport: 'Uber/Bolt',
    spiceLevel: 'Medium',
    mealSize: 'Regular',
    occasion: 'Casual',
    cuisinePreference: 'Nigerian',
    notifications: true,
    darkMode: true,
    theme: 'navy'
  });

  const { sendMessage, isLoading, userLocation, callAI } = useGroqChat(preferences);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem('chopsense_user');
    if (storedName) {
      setUserName(storedName);
    }
    
    // Load preferences
    const storedPrefs = localStorage.getItem('chopsense_prefs');
    if (storedPrefs) {
      setPreferences(JSON.parse(storedPrefs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chopsense_prefs', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = { role: 'user', content: prompt };
    setDisplayChat(prev => [...prev, userMessage]);
    setPrompt("");

    const response = await sendMessage(prompt);
    
    const aiMessage = { role: 'assistant', content: response.reply };
    setDisplayChat(prev => [...prev, aiMessage]);
    
    if (response.locations && response.locations.length > 0) {
      setMapLocations(response.locations);
    }
  };

  const renderContent = () => {
    if (activeTab === 'recipes') {
      return <RecipeGenerator callAI={callAI} preferences={preferences} />;
    }

    if (activeTab === 'macros') {
      return <MacroTracker />;
    }

    if (activeTab === 'dietary') {
      return <DietaryAdaptations callAI={callAI} preferences={preferences} />;
    }

    if (activeTab === 'explore') {
      return (
        <div className="flex-1 flex h-full overflow-hidden">
          {/* List View */}
          <div className="w-full lg:w-[45%] h-full flex flex-col border-r border-white/10 bg-navyDark/90 backdrop-blur-xl">
            <header className="p-6 border-b border-white/10 shrink-0">
              <h1 className="text-2xl font-bold mb-4">Explore Lagos</h1>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" placeholder="Search areas or cuisines..." className="w-full bg-navy border border-white/10 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-gold/50 shadow-inner" />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {LAGOS_LOCATIONS.map((loc, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  key={i} 
                  onClick={() => setMapLocations([loc])}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer flex gap-4 hover:shadow-lg hover:shadow-gold/5"
                >
                  <img src={loc.image} alt={loc.name} className="w-24 h-24 rounded-xl object-cover shrink-0 shadow-md" />
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-base text-white group-hover:text-gold transition-colors">{loc.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-navy bg-gold px-2 py-0.5 rounded-full"><Star size={10} className="fill-navy" /> {loc.rating}</div>
                      </div>
                      <div className="text-xs text-white/50 flex items-center gap-1 mb-2"><MapPin size={12} /> {loc.area}</div>
                    </div>
                    <div className="flex gap-2">
                      {loc.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded text-white/70">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Map View */}
          <div className="hidden lg:block w-[55%] h-full">
            <MapView locations={mapLocations} userLocation={userLocation} />
          </div>
        </div>
      );
    }

    if (activeTab === 'saved') {
      return (
        <div className="flex-1 p-8 h-full overflow-y-auto no-scrollbar">
          <h1 className="text-2xl font-bold mb-8">Your Saved Spots</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_SAVED_SPOTS.map((loc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => setMapLocations([loc])}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer group hover:shadow-xl hover:shadow-gold/10"
              >
                <div className="h-40 w-full relative">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navyDark via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center text-gold"><Bookmark size={16} className="fill-gold" /></div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="text-xs px-2 py-1 bg-navy/80 backdrop-blur-md rounded-md border border-white/10 font-bold text-gold">{loc.rating} ★</span>
                    <span className="text-xs px-2 py-1 bg-navy/80 backdrop-blur-md rounded-md border border-white/10 text-white">{loc.price}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-gold transition-colors">{loc.name}</h3>
                  <p className="text-white/50 text-sm mb-3 flex items-center gap-1"><MapPin size={14}/> {loc.area}</p>
                  <div className="flex gap-2">
                    {loc.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded text-white/70">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'preferences') {
      return (
        <div className="flex-1 p-8 h-full overflow-y-auto no-scrollbar">
          <h1 className="text-3xl font-bold mb-8">Preferences</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Dietary Restrictions */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2"><Flame size={18} className="text-rose-500" /> Dietary Restrictions</h3>
              <div className="flex flex-col gap-3">
                {[
                  { key: 'vegetarian', label: 'Vegetarian' },
                  { key: 'vegan', label: 'Vegan' },
                  { key: 'halal', label: 'Halal Certified' },
                  { key: 'glutenFree', label: 'Gluten-Free' },
                  { key: 'nutFree', label: 'Nut-Free' }
                ].map((diet, idx) => (
                  <motion.label
                    key={diet.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <span className="text-sm text-white/80 group-hover:text-white">{diet.label}</span>
                    <input
                      type="checkbox"
                      checked={preferences.dietary?.[diet.key] || false}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        dietary: { ...prev.dietary, [diet.key]: e.target.checked }
                      }))}
                      className="accent-gold w-4 h-4 cursor-pointer"
                    />
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Transport */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">🚗 Usual Transport</h3>
              <div className="flex flex-col gap-3">
                {['Walk', 'Uber/Bolt', 'Driving', 'Keke NAPEP'].map((t, idx) => (
                  <motion.label
                    key={t}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="transport"
                      checked={preferences.transport === t}
                      onChange={() => setPreferences(prev => ({...prev, transport: t}))}
                      className="accent-gold w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-white/80 group-hover:text-white">{t}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Spice Level */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">🌶️ Spice Tolerance</h3>
              <div className="flex flex-col gap-3">
                {['Mild', 'Medium', 'Hot', 'Extra Hot'].map((level, idx) => (
                  <motion.button
                    key={level}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreferences(prev => ({...prev, spiceLevel: level}))}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left",
                      preferences.spiceLevel === level
                        ? "bg-gold text-navy border-gold shadow-[0_0_15px_rgba(212,162,76,0.3)]"
                        : "bg-transparent border-white/20 text-white/60 hover:border-gold/50 hover:text-white"
                    )}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Atmosphere */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4">Preferred Vibe / Atmosphere</h3>
              <div className="flex flex-wrap gap-2">
                {['Any', 'Quiet & Chill', 'Loud & Lively', 'Romantic', 'Group Friendly', 'Aesthetic/Instagrammable', 'Family-Friendly', 'Business'].map((vibe, idx) => (
                  <motion.button
                    key={vibe}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreferences(prev => ({...prev, atmosphere: vibe}))}
                    className={cn(
                      "px-3 py-2 rounded-full text-xs font-medium transition-all border",
                      preferences.atmosphere === vibe
                        ? "bg-gold text-navy border-gold shadow-[0_0_15px_rgba(212,162,76,0.3)]"
                        : "bg-transparent border-white/20 text-white/60 hover:border-gold/50 hover:text-white"
                    )}
                  >
                    {vibe}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Budget */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4">Default Budget Level</h3>
              <div className="flex flex-col gap-2">
                {['Cheap Eats (₦)', 'Standard (₦₦)', 'Premium (₦₦₦)', 'Luxury (₦₦₦₦)'].map((b, i) => {
                  const val = ['Cheap', 'Standard', 'Premium', 'Luxury'][i];
                  return (
                    <motion.button
                      key={val}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPreferences(prev => ({...prev, budget: val}))}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left",
                        preferences.budget === val ? "bg-gold text-navy border-gold shadow-sm" : "bg-transparent border-white/20 text-white/40 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {b}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Meal Size */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">🍽️ Typical Meal Size</h3>
              <div className="flex flex-col gap-3">
                {['Small', 'Regular', 'Large', 'Extra Large'].map((size, idx) => (
                  <motion.button
                    key={size}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreferences(prev => ({...prev, mealSize: size}))}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left",
                      preferences.mealSize === size
                        ? "bg-forest text-white border-forest shadow-sm"
                        : "bg-transparent border-white/20 text-white/60 hover:border-forest/50 hover:text-white"
                    )}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Occasion */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">🎉 Typical Occasion</h3>
              <div className="flex flex-col gap-2">
                {['Casual', 'Date Night', 'Business', 'Family', 'Celebration', 'Late Night'].map((occ, idx) => (
                  <motion.button
                    key={occ}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreferences(prev => ({...prev, occasion: occ}))}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left",
                      preferences.occasion === occ
                        ? "bg-blue-400 text-navy border-blue-400 shadow-sm"
                        : "bg-transparent border-white/20 text-white/60 hover:border-blue-400/50 hover:text-white"
                    )}
                  >
                    {occ}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Cuisine Preference */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">🍲 Cuisine Preference</h3>
              <div className="flex flex-col gap-2">
                {['Nigerian', 'Continental', 'Asian', 'Middle Eastern', 'Latin American', 'Fusion'].map((cuisine, idx) => (
                  <motion.button
                    key={cuisine}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreferences(prev => ({...prev, cuisinePreference: cuisine}))}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left",
                      preferences.cuisinePreference === cuisine
                        ? "bg-purple-400 text-navy border-purple-400 shadow-sm"
                        : "bg-transparent border-white/20 text-white/60 hover:border-purple-400/50 hover:text-white"
                    )}
                  >
                    {cuisine}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Language Style */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-2 flex items-center gap-2">🗣️ Agent Persona Language</h3>
              <p className="text-xs text-white/50 mb-4">How do you want ChopSense to talk to you?</p>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={preferences.language || 'Heavy Pidgin / Street'}
                onChange={(e) => setPreferences(prev => ({...prev, language: e.target.value}))}
                className="bg-navy border border-white/10 rounded-xl w-full p-4 text-sm focus:outline-none focus:border-gold/50 text-white appearance-none cursor-pointer"
              >
                <option value="Heavy Pidgin / Street">Heavy Pidgin / Street</option>
                <option value="Mild Pidgin / Friendly">Mild Pidgin / Friendly</option>
                <option value="Formal English">Formal English</option>
                <option value="Yoruba">Yoruba (Omo Oduduwa)</option>
                <option value="Hausa">Hausa (Mutumin Arewa)</option>
                <option value="Igbo">Igbo (Nwa Diani)</option>
              </motion.select>
            </motion.div>

            {/* Theme Selection */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">🎨 Theme</h3>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Dark Navy', value: 'navy', color: 'bg-navy' },
                  { name: 'Forest Green', value: 'forest', color: 'bg-forest' },
                  { name: 'Deep Purple', value: 'purple', color: 'bg-purple-900' },
                  { name: 'Midnight Blue', value: 'blue', color: 'bg-blue-900' }
                ].map((theme, idx) => (
                  <motion.button
                    key={theme.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreferences(prev => ({...prev, theme: theme.value}))}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                      preferences.theme === theme.value
                        ? `${theme.color} text-white border-white/20 shadow-sm`
                        : "bg-transparent border-white/20 text-white/60 hover:border-white/30 hover:text-white"
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded-full", theme.color)} />
                    {theme.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Notifications Toggle */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">🔔 Notifications</h3>
              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between cursor-pointer group"
              >
                <span className="text-sm text-white/80 group-hover:text-white">Enable push notifications</span>
                <div
                  onClick={() => setPreferences(prev => ({...prev, notifications: !prev.notifications}))}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors cursor-pointer",
                    preferences.notifications ? "bg-gold" : "bg-white/20"
                  )}
                >
                  <motion.div
                    animate={{ x: preferences.notifications ? 24 : 0 }}
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                  />
                </div>
              </motion.label>
            </motion.div>

            {/* Pro Upgrade */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gold/10 to-forest/10 border border-gold/20 p-6 rounded-2xl text-center"
            >
              <h3 className="font-bold text-gold mb-2">ChopSense Pro</h3>
              <p className="text-sm text-white/60 mb-4">Unlock premium reservations, exclusive deals, and AI voice ordering.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gold text-navy font-bold px-6 py-2 rounded-full text-sm transition-transform"
              >
                Upgrade Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      );
    }

    // Default Dashboard (Chat + Map)
    return (
      <>
        {/* Chat Interface (Left) */}
        <div className="flex-1 flex flex-col h-full border-r border-white/10 relative z-10 w-full lg:max-w-[55%] xl:max-w-[50%]">
          {/* Header */}
          <header className="p-6 border-b border-white/10 shrink-0 bg-navy/50 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-white/60 text-sm">Welcome back, {userName}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <MoreVertical size={18} className="text-white/60" />
                </motion.button>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {QUICK_ACTIONS.map((action, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPrompt(action)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 whitespace-nowrap hover:bg-gold/20 hover:border-gold/30 hover:text-gold transition-all"
                >
                  {action}
                </motion.button>
              ))}
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {displayChat.length === 0 && (
              <div className="text-center py-12">
                <ChefHat size={48} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Ask me anything about Lagos food!</p>
              </div>
            )}
            {displayChat.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navy shrink-0">
                    <ChefHat size={16} strokeWidth={2.5} />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-4",
                  msg.role === 'user'
                    ? "bg-gold text-navy"
                    : "bg-white/5 border border-white/10 text-white"
                )}>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-gold" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 ml-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 ml-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navy shrink-0">
                  <ChefHat size={16} strokeWidth={2.5} />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/10 shrink-0 bg-navy/50 backdrop-blur-xl">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask about Lagos food..."
                  className="w-full bg-navy border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-gold/50 shadow-inner"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Mic size={16} className="text-white/60" />
                </motion.button>
              </div>
              <motion.button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 shrink-0 rounded-2xl bg-gold flex items-center justify-center text-navy hover:bg-gold/90 transition-all disabled:opacity-50 disabled:hover:bg-gold disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,162,76,0.2)]"
              >
                <Send size={20} className={prompt.trim() && !isLoading ? "ml-1" : ""} />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Live Map (Right Panel) */}
        <div className="hidden lg:block w-[45%] xl:w-[50%] p-4">
          <MapView locations={mapLocations} userLocation={userLocation} />
        </div>
      </>
    );
  };

  const getThemeClasses = () => {
    switch (preferences.theme) {
      case 'forest':
        return 'bg-forestDark';
      case 'purple':
        return 'bg-purple-950';
      case 'blue':
        return 'bg-blue-950';
      default:
        return 'bg-navyDark';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} text-white flex flex-col md:flex overflow-hidden transition-colors duration-500`}>
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-navy/50 backdrop-blur-xl flex flex-col justify-between hidden md:flex z-20">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navyDark">
              <ChefHat size={16} strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-tight text-lg">ChopSense</span>
          </Link>
          
          <nav className="space-y-2">
            {SIDEBAR_ITEMS.map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  activeTab === item.id
                    ? "bg-gold text-navy font-medium shadow-[0_0_15px_rgba(212,162,76,0.3)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </motion.button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Log Out</span>
          </motion.button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-navy/50 backdrop-blur-xl z-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navyDark">
            <ChefHat size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight">ChopSense</span>
        </Link>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white/5"
        >
          <MoreVertical size={20} className="text-white/60" />
        </motion.button>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-around p-4 border-b border-white/10 bg-navy/50 backdrop-blur-xl overflow-x-auto no-scrollbar">
        {SIDEBAR_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors shrink-0",
              activeTab === item.id
                ? "bg-gold text-navy"
                : "text-white/60"
            )}
          >
            <item.icon size={20} />
            <span className="text-xs">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
