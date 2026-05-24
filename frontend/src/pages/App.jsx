import { motion } from "framer-motion";
import { Send, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatMessage from "../components/ChatMessage.jsx";
import ContextCard from "../components/ContextCard.jsx";
import MapView from "../components/MapView.jsx";
import { Logo } from "../components/Navbar.jsx";
import QuickActions from "../components/QuickActions.jsx";
import VoiceInput from "../components/VoiceInput.jsx";
import { useAuth, getInitials } from "../hooks/useAuth.js";
import { useChat } from "../hooks/useChat.js";

export default function MainApp() {
  const {
    messages,
    isThinking,
    activeContext,
    pins,
    sendMessage,
    setFocusedRestaurant,
  } = useChat();
  const [input, setInput] = useState("");
  const [mobileView, setMobileView] = useState("chat"); // chat | map
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const submit = (text) => {
    sendMessage(text);
    setInput("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submit(input);
  };

  // When a card or pin is selected, swing the mobile view to the map / chat as
  // appropriate so the cross-panel link still works on a single screen.
  const viewOnMap = (id) => {
    setFocusedRestaurant(id);
    setMobileView("map");
  };

  const focusCard = (id) => {
    setMobileView("chat");
    setFocusedRestaurant(id);
    requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-navy-line bg-navy px-4 py-3">
        <Logo className="text-lg" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app/settings")}
            className="text-blue-gray transition-colors hover:text-cream"
            aria-label="Settings"
          >
            <SettingsIcon size={20} />
          </button>
          <button
            onClick={() => navigate("/app/profile")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy"
            aria-label="Profile"
          >
            {getInitials(user?.name)}
          </button>
        </div>
      </div>

      {/* Mobile view toggle */}
      <div className="flex gap-2 border-b border-navy-line bg-navy px-4 py-2 md:hidden">
        {["chat", "map"].map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors ${
              mobileView === v ? "bg-gold text-navy" : "bg-navy-soft text-blue-gray"
            }`}
          >
            {v === "chat" ? "💬 Chat" : "🗺️ Map"}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Chat panel */}
        <section
          className={`flex min-h-0 w-full flex-col md:flex md:w-3/5 ${
            mobileView === "chat" ? "flex" : "hidden"
          }`}
        >
          <div
            ref={scrollRef}
            className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-5"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                ref={(el) => {
                  if (m.kind === "recommendations") {
                    m.restaurants.forEach((r) => (cardRefs.current[r.id] = el));
                  }
                }}
              >
                <ChatMessage message={m} onViewMap={viewOnMap} />
              </div>
            ))}

            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-blue-gray"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                      className="h-2 w-2 rounded-full bg-gold"
                    />
                  ))}
                </div>
                ChopSense is thinking...
              </motion.div>
            )}
          </div>

          {/* Input area */}
          <div className="space-y-3 border-t border-navy-line bg-navy px-4 py-3">
            <QuickActions onSend={submit} disabled={isThinking} />
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you're looking for..."
                className="flex-1 rounded-full border border-navy-line bg-navy-soft px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
              />
              <VoiceInput onCapture={submit} disabled={isThinking} />
              <button
                type="submit"
                disabled={isThinking || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-navy transition-transform active:scale-95 disabled:opacity-40"
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>

        {/* Map panel */}
        <section
          className={`min-h-0 w-full flex-col border-l border-navy-line md:flex md:w-2/5 ${
            mobileView === "map" ? "flex" : "hidden"
          }`}
        >
          <div className="border-b border-navy-line bg-navy p-3">
            <ContextCard context={activeContext} />
          </div>
          <div className="min-h-0 flex-1">
            <MapView pins={pins} onPinClick={focusCard} />
          </div>
        </section>
      </div>
    </div>
  );
}
