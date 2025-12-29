'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatBubble, type ChatMessage } from "./ChatBubble";
import {
  createInitialState,
  generateAgentReply,
  quickActionTemplates,
  type AgentRuntimeState
} from "@/lib/responseEngine";

const introMessage: ChatMessage = {
  id: "intro",
  role: "agent",
  content:
    "হ্যালো! আমি সামিহা, আপনার প্রফেশনাল আইএসপি সাপোর্ট এজেন্ট। সহজ বাংলায় বিনা দোষারোপে সমস্যা সমাধানে আমি পাশে আছি। কীভাবে সাহায্য করতে পারি?",
  timestamp: new Date().toISOString(),
  tone: "reassuring",
  suggestedActions: ["ইন্টারনেট কাজ করছে না", "স্পিড কম", "বিল সংক্রান্ত প্রশ্ন করুন"]
};

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 10)}`;
}

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [input, setInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<AgentRuntimeState>(createInitialState());

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isAgentTyping]);

  const quickActions = useMemo(() => quickActionTemplates, []);

  const sendMessage = (draft: string) => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsAgentTyping(true);

    setTimeout(() => {
      const { reply, state } = generateAgentReply(trimmed, stateRef.current);
      stateRef.current = state;

      const agentMessage: ChatMessage = {
        id: createId(),
        role: "agent",
        content: reply.content,
        timestamp: new Date().toISOString(),
        tone: reply.tone,
        suggestedActions: reply.suggestedActions,
        summaryChips: reply.summaryChips,
        statusMessage: reply.statusMessage,
        statusTone: reply.statusTone,
        escalated: reply.escalated
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsAgentTyping(false);
    }, 550);
  };

  return (
    <div className="card gradient-bg">
      <h2>প্রফেশনাল ISP AI সাপোর্ট</h2>
      <p className="subtitle">
        ভদ্র, ধৈর্যশীল ও সমাধানমুখী সহায়তা। যেকোনো সমস্যায় প্রথম থেকে শেষ পর্যন্ত আপনার পাশে।
      </p>

      <div
        ref={containerRef}
        style={{
          marginTop: 24,
          maxHeight: 460,
          overflowY: "auto",
          paddingRight: 6,
          display: "flex",
          flexDirection: "column",
          gap: 18
        }}
      >
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isAgentTyping ? (
          <div className="message agent" style={{ maxWidth: "60%" }}>
            <div className="avatar">A</div>
            <div>
              <div className="meta">
                <strong>সামিহা</strong>
                <span>টাইপ করা হচ্ছে…</span>
              </div>
              <span>আপনার সমস্যার তথ্য যাচাই করে দেখছি…</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="input-area">
        <label className="section-title" htmlFor="message">
          আপনার বার্তা লিখুন
        </label>
        <textarea
          id="message"
          placeholder="সমস্যাটি সংক্ষেপে বর্ণনা করুন…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              sendMessage(input);
            }
          }}
          disabled={isAgentTyping}
        />
        <button type="button" onClick={() => sendMessage(input)} disabled={isAgentTyping}>
          প্রেরণ করুন
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="section-title">দ্রুত অ্যাকশন</div>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <button key={action} type="button" onClick={() => sendMessage(action)} disabled={isAgentTyping}>
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="status-banner" style={{ marginTop: 28 }}>
        <strong>সেবার প্রতিশ্রুতি</strong>
        <span>২৪/৭ সহায়তা · বিনয়ী যোগাযোগ · নিশ্চিত ফলো-আপ</span>
      </div>
    </div>
  );
}
