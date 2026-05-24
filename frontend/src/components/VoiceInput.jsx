import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useToast } from "./Toast.jsx";

// Mocked voice capture. It really does ask for the mic via MediaRecorder so
// the gesture feels authentic, but nothing is transcribed — after a short
// "recording" beat it drops a canned Pidgin request into the chat.
const MOCK_TRANSCRIPT = "Abeg find me better jollof for Lekki, I dey hungry";

export default function VoiceInput({ onCapture, disabled }) {
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);
  const notify = useToast();

  useEffect(() => {
    return () => stopStream();
  }, []);

  const stopStream = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.stream) {
      recorder.stream.getTracks().forEach((t) => t.stop());
    }
    recorderRef.current = null;
  };

  const toggle = async () => {
    if (disabled) return;
    if (recording) {
      setRecording(false);
      stopStream();
      onCapture?.(MOCK_TRANSCRIPT);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(stream);
      setRecording(true);
      notify("Listening... (demo)", { duration: 1500 });
      // Auto-stop after a short beat so the demo always resolves.
      setTimeout(() => {
        if (recorderRef.current) {
          setRecording(false);
          stopStream();
          onCapture?.(MOCK_TRANSCRIPT);
        }
      }, 2200);
    } catch {
      // No mic / denied permission — still demo the flow gracefully.
      notify("Mic unavailable — using a sample voice note", { tone: "default" });
      onCapture?.(MOCK_TRANSCRIPT);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      aria-label="Voice input"
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
        recording
          ? "bg-green text-white"
          : "border border-navy-line bg-navy-soft text-blue-gray hover:text-cream"
      } disabled:opacity-50`}
    >
      {recording && (
        <motion.span
          className="absolute inset-0 rounded-full bg-green/40"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}
      <Mic size={18} />
    </button>
  );
}
