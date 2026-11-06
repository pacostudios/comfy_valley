import Nav from "@/components/Nav";
import ScrollIndicator from "@/components/ScrollIndicator";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Valleys from "@/components/Valleys";
import Rhythm from "@/components/Rhythm";
import Closing from "@/components/Closing";

const HOME_SECTIONS = ["home", "about", "valleys", "gallery", "contact"];

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollIndicator sections={HOME_SECTIONS} />
      <main>
        <Hero />
        <Manifesto />
        <Valleys />
        <Rhythm />
        <Closing />
      </main>
    </>
  );
}
