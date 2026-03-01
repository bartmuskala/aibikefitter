import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "./layout.module.css";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.topNav}>
                <div className={styles.logo}>
                    <Link href="/dashboard">AIBikeFitter</Link>
                </div>
                <div className={styles.navActions}>
                    <LanguageSwitcher />
                    <AuthButton />
                </div>
            </header>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
