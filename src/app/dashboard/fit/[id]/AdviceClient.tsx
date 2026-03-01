"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import styles from "./page.module.css";
import { BikeFitAdvice } from "@prisma/client";

export default function AdviceClient({ fitAdvice }: { fitAdvice: BikeFitAdvice }) {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<{ role: "assistant" | "user", content: string }[]>([
        { role: "assistant", content: fitAdvice.advice },
    ]);
    const [chatInput, setChatInput] = useState("");
    const [loading, setLoading] = useState(false);

    // We parse the initial stored painPoints
    const painPoints = JSON.parse(fitAdvice.painPoints || "[]");

    const sendFollowUp = async () => {
        if (!chatInput.trim() || loading) return;

        const newMessages = [...messages, { role: "user" as const, content: chatInput }];
        setMessages(newMessages);
        setChatInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/gemini/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages,
                    historyId: fitAdvice.id
                })
            });

            if (!res.ok) throw new Error("Chat failed");

            const data = await res.json();
            setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        } catch (err) {
            console.error(err);
            alert(t("error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t("ai_advice")}</h1>

            <div className={styles.metaInfo}>
                <strong>Pain Points:</strong> {painPoints.map((p: any) => p.partId).join(", ")}
            </div>

            <div className={styles.chatContainer}>
                {messages.map((msg, i) => (
                    <div key={i} className={msg.role === "user" ? styles.userMsg : styles.aiMsg}>
                        <div className={styles.msgBubble}>
                            {/* For production, use a library like react-markdown. 
                  Here we use simple white-space pre-wrap logic. */}
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && <div className={styles.aiMsg}><div className={styles.msgBubble}>Thinking...</div></div>}
            </div>

            <div className={styles.chatInputWrapper}>
                <input
                    type="text"
                    className={styles.chatInput}
                    placeholder={t("chat_placeholder")}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendFollowUp()}
                />
                <button className={styles.sendBtn} onClick={sendFollowUp} disabled={loading || !chatInput.trim()}>
                    {t("send")}
                </button>
            </div>
        </div>
    );
}
