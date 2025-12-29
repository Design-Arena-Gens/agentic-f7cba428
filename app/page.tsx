import { AgentChat } from "@/components/AgentChat";

export default function Page() {
  return (
    <main className="container">
      <div style={{ marginBottom: 32 }}>
        <span className="pill">🔹 প্রফেশনাল ISP AI এজেন্ট</span>
      </div>
      <AgentChat />
      <footer className="footer">
        © {new Date().getFullYear()} Agentic Support · গ্রাহক সন্তুষ্টি আমাদের অঙ্গীকার।
      </footer>
    </main>
  );
}
