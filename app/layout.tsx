import type { Metadata } from "next";
import { Archivo, Inter, Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Comfy Valley | See Kerala Soul",
  description: "From misty hills to golden shores: immersive staycations and experience spaces across Kerala.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
