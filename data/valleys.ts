export type ChapterId = "hills" | "waters" | "shores" | "land";

export type Valley = {
  slug: string;
  name: string;
  place: string;
  blurb: string;
  chapter: ChapterId;
  /** Shown in the short list on the landing page. */
  featured?: boolean;
};

/** Ordered north to south. Copy comes from the client brochure (assets/COMFY VALLEY.pdf). */
export const valleys: Valley[] = [
  { slug: "farm-valley", name: "Comfy Farm Valley", place: "Kasaragod", chapter: "land", featured: true, blurb: "Fifteen acres of soulful farmland where life moves with the sun, soil, and seasons." },
  { slug: "industry-view-valley", name: "Comfy Industry View Valley", place: "Kannur", chapter: "land", blurb: "A rare opportunity to witness industry, innovation, and guided learning experiences." },
  { slug: "dam-view-valley", name: "Comfy Dam View Valley", place: "Banasura, Wayanad", chapter: "hills", featured: true, blurb: "A serene forest retreat overlooking reservoir waters and mist-covered hills." },
  { slug: "beach-residency", name: "Comfy Beach Residency", place: "Calicut", chapter: "shores", blurb: "A premium coastal stay where history, trade, and timeless beaches converge." },
  { slug: "hill-view-valley", name: "Comfy Hill View Valley", place: "Malappuram", chapter: "hills", blurb: "Off-road adventures and hilltop stays in the untouched peaks of Malabar." },
  { slug: "paddy-view-valley", name: "Comfy Paddy View Valley", place: "Palakkad", chapter: "land", blurb: "Agrahar-style village living amid endless green paddy fields and heritage homes." },
  { slug: "ayur-valley", name: "Comfy Ayur Valley", place: "Thrissur", chapter: "land", blurb: "Traditional Ayurvedic healing blended with modern wellness comfort." },
  { slug: "waterfalls-valley", name: "Comfy Waterfalls Valley", place: "Athirapally", chapter: "waters", featured: true, blurb: "Stay near the roar of Kerala's most iconic waterfalls." },
  { slug: "fort-valley", name: "Comfy Fort Valley", place: "Fort Kochi", chapter: "land", blurb: "Colonial charm, heritage streets, and timeless coastal ambiance." },
  { slug: "tea-view-valley", name: "Comfy Tea View Valley", place: "Wagamon AVT", chapter: "hills", featured: true, blurb: "Unbroken tea-garden views floating above valley clouds." },
  { slug: "jungle-valley", name: "Comfy Jungle Valley", place: "Wagamon", chapter: "hills", blurb: "A deep-forest life: raw, untouched, and completely immersive." },
  { slug: "houseboat-services", name: "Comfy Houseboat Services", place: "Vembanad Lake", chapter: "waters", blurb: "Authentic kettuvallam cruises through Kerala's living backwater culture." },
  { slug: "island-view-valley", name: "Comfy Island View Valley", place: "Munroe Island", chapter: "waters", featured: true, blurb: "A 200-degree backwater panorama designed for peaceful private stays." },
  { slug: "sea-view-valley", name: "Comfy Sea View Valley", place: "Varkala", chapter: "shores", featured: true, blurb: "Cliffside sea views and curated beach experiences." },
  { slug: "chillax", name: "Comfy Chillax", place: "Ponmudi", chapter: "hills", blurb: "Hill-road relaxation hub with cafés, waterfalls, and adventure zones." },
  { slug: "port-view-valley", name: "Comfy Port View Valley", place: "Kovalam", chapter: "shores", blurb: "Witness the grandeur of the open sea and Vizhinjam Port skyline." },
  { slug: "hideouts", name: "Comfy Hideouts", place: "Poovar", chapter: "shores", blurb: "Minimalistic private retreats with pools and quiet luxury." },
];

export const featuredValleys = valleys.filter((v) => v.featured);

export type Chapter = {
  id: ChapterId;
  numeral: string;
  name: string;
  /** Lines from the brochure's opening passage. */
  line: string;
  image: string;
  mist?: boolean;
};

export const chapters: Chapter[] = [
  { id: "hills", numeral: "I", name: "The Hills", line: "Where hills breathe cool whispers,", image: "/images/mist.webp", mist: true },
  { id: "waters", numeral: "II", name: "The Backwaters", line: "backwaters sing silent songs,", image: "/images/ch-waters.webp" },
  { id: "shores", numeral: "III", name: "The Shores", line: "waves kiss the sands,", image: "/images/ch-shores.webp" },
  { id: "land", numeral: "IV", name: "The Living Land", line: "and every mile tells a new cultural story.", image: "/images/ch-land.webp", mist: true },
];

export const contact = {
  phone: "+91 94008 19957",
  phoneHref: "tel:+919400819957",
  email: "info@comfyvalley.com",
  website: "www.comfyvalley.com",
  address: "Comfy Valley Private Limited, Kerala, India",
};
