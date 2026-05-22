import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const MOCK_RESPONSES = {
  "somewhere cheap": "Ah, you want correct correct food without breaking bank! I've got you. Check out **White House Buka** in Yaba - their amala is legendary and very affordable. Or try **Purple Bistro** for budget-friendly pasta. Both are mainland spots with proper vibes!",
  "date": "For a proper date night in VI, you need to go to **RSVP Lagos**. The poolside setting is perfect, the food is top-tier, and the ambiance is just right for romance. Trust me, your date will be impressed!",
  "amala": "You're craving correct amala? **White House Buka** in Yaba is the answer! Their amala is smooth, the ewedu is fresh, and the assorted meat is on point. It's a mainland legend for a reason!",
  "late night": "For late night food in Lekki, **Sailors Lounge** is the move. Overwater vibes, good seafood, and they stay open late. The atmosphere is perfect for when you're hungry after a night out.",
  "default": "Tell me more - what area are you thinking? What's your budget? Are you going solo or with friends? I'll find you the perfect spot!"
};

export default function DemoChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm ChopSense, your Lagos food bestie. Tell me what you're craving and I'll find you the perfect spot!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = MOCK_RESPONSES.default;
      
      for (const [key, value] of Object.entries(MOCK_RESPONSES)) {
        if (key !== 'default' && lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      const aiMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section className="py-24 px-6 bg-navyDark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Try It Out</h2>
          <p className="text-white/60 text-lg">See how ChopSense works with a live demo</p>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navy shrink-0">
                    <Bot size={16} />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-gold text-navy' 
                    : 'bg-white/5 border border-white/10 text-white'
                }`}>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        strong: ({node, ...props}) => <strong className="font-bold text-gold" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
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
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-forest flex items-center justify-center text-navy shrink-0">
                  <Bot size={16} />
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

          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try: 'somewhere cheap around Yaba' or 'date night in VI'"
              className="flex-1 bg-navy border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-gold/50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-4 rounded-full bg-gold text-navy font-bold hover:bg-gold/90 transition-all disabled:opacity-50 disabled:hover:bg-gold"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
