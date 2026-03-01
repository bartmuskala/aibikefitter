"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import styles from "./AuthButton.module.css";

export default function AuthButton() {
    const { data: session } = useSession();
    const { t } = useTranslation();
    const router = useRouter();

    if (session) {
        return (
            <div className={styles.authContainer}>
                <button className={styles.dashboardBtn} onClick={() => router.push("/dashboard")}>
                    {t("dashboard")}
                </button>
                <button className={styles.logoutBtn} onClick={() => signOut()}>
                    {t("logout")}
                </button>
            </div>
        );
    }

    return (
        <button className={styles.loginBtn} onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
            {t("login_google")}
        </button>
    );
}
