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
The user is providing an array of precise anatomical pain points (e.g., Vastus Medialis, Internal Oblique, Achilles Tendon, Gluteus Maximus, Lower Back/Erector Spinae) localized on a 3D body model, along with a severity score (1-5) and optional remarks.

Your job is to:
1. Carefully evaluate the combination of precise muscular and tendinous pain points.
2. Relate these specific anatomical overloading patterns to potential bike geometry and fit issues (e.g. saddle height, saddle fore/aft, cleat position, reach, stack, handlebar width, drop).
3. Provide prioritized, actionable bike fit adjustments.
4. Explain *why* the adjustment helps that specific muscle or tendon in simple but professional terms (e.g., "Raising the saddle slightly reduces knee flexion at the top of the pedal stroke, which unloads the Vastus Medialis.").
5. Output the response in beautifully formatted markdown. Use headings, bullet points, and bold text for the actual adjustments.
6. Acknowledge previous advice if this is a follow-up (the user will provide conversation history).
7. Suggest the user tests the adjustments and reports back.
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
