import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm your TravelMind AI assistant. Ask me anything about Indian travel destinations, trip planning tips, budgeting, or safety information!",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatbotWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Don't render if user is not logged in
  if (!user) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsTyping(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > allMessages.length) {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Simple table renderer for pipe-delimited tables in assistant messages
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const result: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      // Detect table: line with pipes and next line is separator
      if (lines[i].includes("|") && lines[i].trim().startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        if (tableLines.length >= 2) {
          const parseRow = (line: string) =>
            line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());

          const headers = parseRow(tableLines[0]);
          const isSeparator = (line: string) => /^\|[\s\-:|]+\|$/.test(line.trim());
          const dataStart = isSeparator(tableLines[1]) ? 2 : 1;
          const dataRows = tableLines.slice(dataStart).filter(l => !isSeparator(l)).map(parseRow);

          result.push(
            <div key={`table-${i}`} className="overflow-x-auto my-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    {headers.map((h, hi) => (
                      <th key={hi} className="border border-border bg-muted px-2 py-1 text-left font-semibold text-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="border border-border px-2 py-1 text-muted-foreground">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      result.push(<span key={`line-${i}`}>{lines[i]}{i < lines.length - 1 ? <br /> : null}</span>);
      i++;
    }

    return <>{result}</>;
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="fixed bottom-6 right-6 z-50">
            <Button onClick={() => setOpen(true)} variant="hero" size="icon" className="h-14 w-14 rounded-full shadow-2xl">
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "500px" }}
          >
            <div className="gradient-primary px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <div>
                  <p className="text-sm font-semibold text-primary-foreground font-heading">TravelMind AI</p>
                  <p className="text-xs text-primary-foreground/70">Your travel assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 rounded-full" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="gradient-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}>
                    {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="bg-accent rounded-full h-7 w-7 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2 items-start">
                  <div className="gradient-primary rounded-full h-7 w-7 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border p-3 shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about travel..." className="flex-1 rounded-full text-sm" />
                <Button type="submit" variant="hero" size="icon" className="rounded-full h-10 w-10 shrink-0" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
