import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "Traveloop — Plan Your Perfect Journey",
  description: "Personalized travel planning made easy. Build itineraries, track budgets, discover activities, and share stories with fellow travelers.",
  keywords: ["travel planning", "trip itinerary", "travel budget", "travel community", "destination guide"],
  authors: [{ name: "Traveloop" }],
  openGraph: {
    title: "Traveloop — Plan Your Perfect Journey",
    description: "Personalized travel planning made easy. Build itineraries, track budgets, discover activities, and share stories with fellow travelers.",
    url: "https://traveloop-dun.vercel.app",
    siteName: "Traveloop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Traveloop — Plan Your Perfect Journey",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traveloop — Plan Your Perfect Journey",
    description: "Personalized travel planning made easy.",
    images: ["https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative bg-paper text-earth">
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
