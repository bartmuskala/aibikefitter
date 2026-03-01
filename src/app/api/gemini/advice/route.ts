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
You are a professional, expert Bike Fitter with deep biomechanical and physiological knowledge.
The user is providing you with a list of pain points they experience while cycling, including the specific body part or muscle group, the severity of the pain (1-5), and additional remarks.
Your goal is to evaluate different possibilities for adjustments, explicitly considering:
- Saddle height
- Fore/aft saddle position
- Saddle tilt
- Handlebar (steering wheel) height
- Stem length
- Hoods position
- Cleat position (fore/aft, rotation, stance width)
- Crank length

Be structured in your response:
1. Identify the likely muscles or tendons involved in the user's pain points.
2. Outline the potential causes for each pain point in relation to bike fit.
3. Provide clear, actionable advice on what adjustments the user should make, explaining *why*.
4. Give a prioritized order in which they should make these adjustments (only change one thing at a time).

Use Markdown for formatting. Keep the tone professional, encouraging, and analytical.
`;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { painPoints } = await req.json();

        if (!painPoints || !Array.isArray(painPoints) || painPoints.length === 0) {
            return NextResponse.json({ error: "Invalid pain points data" }, { status: 400 });
        }

        const userMessage = `Here are my current pain points:\n` + painPoints.map((p: any) =>
            `- Part: ${p.partId}, Severity: ${p.level}/5. Remarks: ${p.remarks || "None"}`
        ).join("\n");

        const response = await getAI().models.generateContent({
            model: "gemini-2.5-pro",
            contents: userMessage,
            config: {
                systemInstruction: systemPrompt,
            }
        });

        const advice = response.text || "Failed to generate advice.";

        const history = await prisma.bikeFitAdvice.create({
            data: {
                userId: session.user.id,
                painPoints: JSON.stringify(painPoints),
                advice,
            }
        });

        return NextResponse.json(history);
    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Failed to generate advice" }, { status: 500 });
    }
}
