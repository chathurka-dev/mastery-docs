import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { TopProgressBar } from "@/components/layout/TopProgressBar";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "MasteryDocs", template: "%s | MasteryDocs" },
  description: "Interactive learning documents for developers",
};

// Runs before React hydrates, reads localStorage, and sets data-theme
// to prevent a white flash when the user has dark mode saved.
const themeScript = `
  try {
    const raw = localStorage.getItem('mastery-theme');
    const theme = raw ? JSON.parse(raw)?.state?.theme : null;
    document.documentElement.setAttribute('data-theme', theme || 'light');
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
        {/* Flash-free theme init must be blocking, before any paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <TopProgressBar />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "toast-themed",
            success: { iconTheme: { primary: "#7c3aed", secondary: "currentColor" } },
            error: { iconTheme: { primary: "#f43f5e", secondary: "currentColor" } },
          }}
        />
      </body>
    </html>
  );
}
