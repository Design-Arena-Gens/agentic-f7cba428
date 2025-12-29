import { clsx } from "clsx";
import type { AgentTone } from "@/lib/responseEngine";

export type ChatRole = "user" | "agent";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  tone?: AgentTone;
  suggestedActions?: string[];
  summaryChips?: string[];
  statusMessage?: string;
  statusTone?: "info" | "success" | "warning" | "danger";
  escalated?: boolean;
}

const toneEmoji: Record<AgentTone, string> = {
  neutral: "🤝",
  reassuring: "😊",
  escalated: "🚀",
  celebratory: "🎉"
};

const statusToneClass = {
  info: { bg: "rgba(15, 122, 229, 0.12)", color: "#0f7ae5" },
  success: { bg: "rgba(12, 135, 52, 0.12)", color: "#0c8734" },
  warning: { bg: "rgba(227, 146, 0, 0.14)", color: "#c27100" },
  danger: { bg: "rgba(204, 44, 44, 0.12)", color: "#b02b2b" }
} as const;

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("bn-BD", {
    hour: "numeric",
    minute: "2-digit"
  });
}

export function ChatBubble({
  message
}: {
  message: ChatMessage;
}) {
  const isUser = message.role === "user";
  const avatar = isUser ? "আপনি" : "সামিহা";
  const badgeTone = message.tone && !isUser ? toneEmoji[message.tone] : null;

  const statusStyle =
    message.statusMessage && message.statusTone
      ? statusToneClass[message.statusTone] ?? statusToneClass.info
      : undefined;

  return (
    <div className={clsx("message", isUser ? "user" : "agent")}>
      <div className="avatar">{isUser ? "U" : "A"}</div>
      <div>
        <div className="meta">
          <strong>{avatar}</strong>
          <span>{formatTime(message.timestamp)}</span>
          {badgeTone ? <span className="pill">{badgeTone} সহায়তা</span> : null}
          {message.escalated ? <span className="pill">⚡ এস্কেলেটেড</span> : null}
        </div>
        <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br/>") }} />
        {message.summaryChips && message.summaryChips.length > 0 ? (
          <div className="quick-actions" style={{ marginTop: 12 }}>
            {message.summaryChips.map((chip) => (
              <span
                key={chip}
                className="pill"
                style={{
                  background: "rgba(15, 122, 229, 0.08)",
                  color: "#1060b5",
                  fontWeight: 500
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        {message.statusMessage && statusStyle ? (
          <div
            className="status-banner"
            style={{ background: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.color }}
          >
            <strong>স্ট্যাটাস</strong>
            <span>{message.statusMessage}</span>
          </div>
        ) : null}
        {!isUser && message.suggestedActions && message.suggestedActions.length > 0 ? (
          <div className="quick-actions" style={{ marginTop: 14 }}>
            {message.suggestedActions.map((item) => (
              <span
                key={item}
                className="pill"
                style={{
                  background: "rgba(15, 122, 229, 0.08)",
                  color: "#0f7ae5"
                }}
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
