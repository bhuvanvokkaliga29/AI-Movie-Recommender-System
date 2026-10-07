import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cinephile Analytics // Editorial Movie Intelligence",
  description:
    "An editorial intelligence instrument for cinema discovery. Serif analytics, multi-dimensional latent topology, and hybrid neural models on warm paper.",
  keywords: [
    "AI Movie Recommender",
    "Steep Editorial",
    "Movie Analytics",
    "Deep Learning",
    "Latent Vector Search",
    "Cinephile Intelligence",
  ],
  authors: [{ name: "Bhuvan Gowda H K" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-paper-white text-ink-black min-h-screen selection:bg-blush-peach selection:text-sienna-brown antialiased">
        {children}
      </body>
    </html>
  );
}
