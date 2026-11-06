import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ScrollIndicator from "@/components/ScrollIndicator";
import ValleysStory from "@/components/ValleysStory";
import { chapters } from "@/data/valleys";
import "./story.css";

export const metadata: Metadata = {
  title: "The Valleys | Comfy Valley",
  description: "One journey called Kerala: every Comfy Valley, from misty hills and silent backwaters to golden shores.",
};

export default function ValleysPage() {
  return (
    <>
      <Nav />
      <ScrollIndicator sections={["top", ...chapters.map((c) => c.id), "end"]} />
      <ValleysStory />
      <Footer />
    </>
  );
}
