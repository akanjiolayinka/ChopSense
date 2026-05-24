// Drives the mocked conversation. It fakes the multi-stage agent pipeline with
// timed transitions — typing indicator, parsed context, agent reply, then the
// restaurant cards — so the chat feels like a real reasoning system.

import { useCallback, useRef, useState } from "react";

import { getRestaurant, matchResponseSet } from "../data/mockData";

let idCounter = 0;
const nextId = () => `m_${Date.now()}_${idCounter++}`;

const WELCOME = {
  id: "welcome",
  role: "agent",
  kind: "text",
  text:
    "Hey! 👋 I'm ChopSense — your personal food guide for Lagos. Tell me what you're in the mood for, where you are, and I'll find the perfect spot. Or just say 'surprise me' and I'll figure it out.",
};

export function useChat() {
  const [messages, setMessages] = useState([WELCOME]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeContext, setActiveContext] = useState(null);
  const [pins, setPins] = useState([]);
  const [focusedRestaurant, setFocusedRestaurant] = useState(null);
  const timers = useRef([]);

  const schedule = useCallback((fn, delay) => {
    const t = setTimeout(fn, delay);
    timers.current.push(t);
  }, []);

  const sendMessage = useCallback(
    (rawText) => {
      const text = (rawText || "").trim();
      if (!text || isThinking) return;

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", kind: "text", text },
      ]);
      setIsThinking(true);

      const set = matchResponseSet(text);
      const restaurants = set.restaurantIds.map(getRestaurant).filter(Boolean);

      // Stage 2 — the parsed context appears mid-think, as if the agent just
      // finished understanding the request.
      schedule(() => setActiveContext(set.context), 900);

      // Stage 3 + 4 — reasoning trace card, agent reply, then the cards and
      // the map pins land together.
      schedule(() => {
        setIsThinking(false);
        const traceText = `📍 ${set.context.area} · 👥 ${set.context.group} · 💰 Budget: ${set.context.budget} · 🎯 ${set.context.occasion}`;
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "agent", kind: "trace", text: traceText },
          { id: nextId(), role: "agent", kind: "text", text: set.agentText },
          {
            id: nextId(),
            role: "agent",
            kind: "recommendations",
            restaurants,
          },
        ]);
        setPins(
          restaurants.map((r, i) => ({
            number: i + 1,
            id: r.id,
            name: r.name,
            location: r.location,
            category: r.category,
          }))
        );
      }, 1500);
    },
    [isThinking, schedule]
  );

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMessages([WELCOME]);
    setIsThinking(false);
    setActiveContext(null);
    setPins([]);
    setFocusedRestaurant(null);
  }, []);

  return {
    messages,
    isThinking,
    activeContext,
    pins,
    focusedRestaurant,
    setFocusedRestaurant,
    sendMessage,
    reset,
  };
}
