import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FitClient from "./FitClient";

export default async function FitPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/");
    }

    return <FitClient />;
}
