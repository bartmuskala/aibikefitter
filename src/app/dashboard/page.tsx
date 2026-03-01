import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";
// Translation in Server Components is easier via passing texts but we'll use a simple approach for now,
// or we can make it a client component. Let's make the list rendering a client component to easily use react-i18next.

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    const history = await prisma.bikeFitAdvice.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className={styles.wrapper}>
            <DashboardClient initialHistory={history} />
        </div>
    );
}
