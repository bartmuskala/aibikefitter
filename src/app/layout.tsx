import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { I18nProvider } from "@/lib/i18n-provider"; // We'll add this soon

export const metadata: Metadata = {
  title: "AIBikeFitter",
  description: "AI-powered professional bike fit advice. Describe your pain, get adjustments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <I18nProvider>
            {children}
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
