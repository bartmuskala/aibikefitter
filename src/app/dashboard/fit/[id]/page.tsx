import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdviceClient from "./AdviceClient";

export default async function AdvicePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/");
    }

    const { id } = await params;

    const fitAdvice = await prisma.bikeFitAdvice.findUnique({
        where: {
            id,
        }
    });

    if (!fitAdvice || fitAdvice.userId !== session.user.id) {
        redirect("/dashboard");
    }

    return <AdviceClient fitAdvice={fitAdvice} />;
}
