import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

function getAI() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const systemPrompt = `
You are a professional, expert Bike Fitter. The user has previously received advice regarding their bike fit, and they are now asking follow-up questions.
Answer clearly, concisely, and continue to evaluate based on biomechanics and bike geometry. 
Provide small adjustments, and tell them to test. Keep the tone helpful. Use markdown.
`;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { messages, historyId } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }

        // Verify history belongs to user
        const history = await prisma.bikeFitAdvice.findUnique({ where: { id: historyId } });
        if (!history || history.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Format for Gemini Chat
        const promptFlow = messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join("\\n");

        const response = await getAI().models.generateContent({
            model: "gemini-2.5-pro",
            contents: promptFlow,
            config: {
                systemInstruction: systemPrompt,
            }
        });

        const reply = response.text || "Failed to generate reply.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
    }
}
