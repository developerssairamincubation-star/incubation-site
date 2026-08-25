export const SITE = {
  name: "Sri Sairam Techno Incubator Foundation",
  phone: "+91 78451 27111",
  emails: ["incubation@sairam.edu.in", "queries.rd@sairam.edu.in"],
  instagram: "@techno_incubator_sairam",
  address: "Sai Leo Nagar, West Tambaram, Chennai — 600 044",
  mapQuery: "Sri Sairam Techno Incubator Foundation, Sai Leo Nagar, West Tambaram, Chennai",
};

export const APPLICATION_EMAIL = "queries.rd@sairam.edu.in";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Thrust areas", href: "#thrust-areas" },
  { label: "Startups", href: "#startups" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export const HERO_SLIDES = [
  { src: "/images/hero/slide-1.jpg", alt: "Incubation co-working floor" },
  { src: "/images/hero/slide-2.jpg", alt: "Startup teams at work" },
  { src: "/images/hero/slide-3.jpg", alt: "Campus innovation labs" },
];

export const STATS = [
  { value: 92, label: "Startups Incubated" },
  { value: 32, label: "Women led startups" },
  { value: 12, label: "Defense startups" },
  { value: 7, label: "Thrust areas" },
];

export const FOCUS_AREAS = [
  {
    title: "Defence & Aerospace",
    description:
      "Dual-use technologies, avionics and systems engineered to defence-grade standards.",
  },
  {
    title: "Drones & UAV",
    description:
      "Unmanned platforms, payloads and the software stacks that keep them flying.",
  },
  {
    title: "Robotics",
    description:
      "Autonomous systems and applied robotics for the factory floor and beyond.",
  },
  {
    title: "Healthcare",
    description:
      "Devices, diagnostics and digital health products that reach real patients.",
  },
  {
    title: "Agriculture",
    description:
      "Precision farming, post-harvest technology and tools for the growing ecosystem.",
  },
  {
    title: "Solid waste management",
    description:
      "Circular-economy systems that turn waste streams into usable value.",
  },
  {
    title: "Additive manufacturing",
    description:
      "3D printing, rapid prototyping and new materials on the path to production.",
  },
];

export const DPIIT_RECOGNISED_STARTUPS = [
  "Armor Grandeur Private Limited",
  "Creasys Technologies LLP",
  "Universys Technologies",
  "Sanjmar Industries (OPC) Private Limited",
  "MAM Industries (OPC) Private Limited",
  "Genik Technologies Private Limited",
  "LMES Academy Private Limited",
  "Hakate Technologies Private Limited",
  "Ernosys Technologies LLP",
];

export const NON_DPIIT_RECOGNISED_STARTUPS = [
  "Techno Raise Private Limited",
  "Blunav Technologies Private Limited",
  "Ideal Engineerig Training and consultancy",
  "Sasa Printwear Pvt Ltd",
  "Vidhai Art Space",
  "Sri Sai Fusion Techno Works",
  "Jai Sriram Coatings",
  "Uru",
  "Creasys Technologies LLP",
  "Universys Technologies",
  "Bigus 12 Technologies",
  "Smile Healthcare Technologies",
  "Srikart Technologies & Solutions",
  "Flare Innovations",
  "Senter",
  "Vision",
  "Big Bucks Innovation",
  "Mice Berry India Private Limited",
  "Genik Technologies",
  "AH Enterprises",
  "Techyy Service Center",
  "10004U",
  "Skycatch Bots",
  "Sai Mistra Automations",
  "Softrate India",
  "Evalley Corporation",
  "Suvalaks Technologies",
  "Boomi Pooja Life Style Compact Homes",
  "Reva Engineering Services",
  "Task Development",
  "Solaris India Power Solution",
  "VNM Jothi Fabrication",
  "Sri Amman Engineering Works",
  "Curious Wings",
  "Pang Wangle Technologies",
  "Kalam Innovation",
  "GP Innotech Advanced Solution",
  "Sai Organic Pro Plus",
  "AD Astra Group Of Companies",
  "Agsaimo",
  "Zero Solutions",
  "ZPM Enterprises",
  "SPNP Company",
  "Klot Industries",
  "RSMH Enterprises",
  "Balaguhan Enterprises",
  "EDGES",
  "Monts India",
  "Grad",
  "Soorai Venkatesan Enterprises",
  "Dhurgeshraaman Technologies And Enterprises",
  "Revo Technologies And Enterprises",
  "Bjsai Enterprises",
  "APR Technologies",
  "Cyber Space Soluations",
  "Pencer Enterprises",
  "VSN Technology",
  "SJ Industries",
  "Extronics",
  "Infinity Limited",
  "Entdeckon",
  "Pavithram Ayurveda Pharmacy",
  "LMES Academy Private Limited",
  "Hakate Technologies Private limited",
  "Samudra Robotics",
  "Spark",
  "Armor Grandeur Private Limited",
  "Yash in Enterprises",
  "Toofan",
  "Mam Industries (OPS) Private Limited",
  "Sanjmar Industries (OPS) Private Limited",
  "Kalam Institute For Technical Education Kite",
  "Spark Tech",
  "Theran Siddha Pharmacy",
  "Wecosmart",
  "Techno Quest Consultancy",
  "Sparks",
  "Innoprime Plast Private Limited",
  "Ernosys Technologies LLP",
  "Ada Lovelace Foundation",
  "Ada Lovelace Software Private Limited",
  "M K Tech",
  "Vidhaan Educare Private Limited",
  "Nirloba It Private Limited",
  "Heptag Solutions Private Limited",
  "S3 Construction",
  "Math Software Square (OPC) private limited",
  "Fluezen technology Private limited",
  "Vecmocon Technologies Pvt Ltd",
  "HEBESEC Technologies Private Limited",
  "M K Tech",
  "spark invotech private Limited",
];

type EventInput = {
  slug: string;
  caption: string;
  title: string;
  details: string;
  photoCount: number;
};

// TODO: swap these titles/captions/details for the real event write-ups —
// placeholder copy for now, one entry per event folder supplied.
const EVENT_INPUTS: EventInput[] = [
  {
    slug: "ceo-with-guest",
    caption: "CEO & Guest",
    title: "A visit from our CEO and guest speakers",
    details:
      "Placeholder text for now — replace with the real story behind this visit. Our CEO joined guest speakers on campus for a walkthrough of the labs and a few informal conversations with the resident teams.",
    photoCount: 5,
  },
  {
    slug: "event",
    caption: "Campus Event",
    title: "Highlights from a recent campus event",
    details:
      "Placeholder text for now — swap in the real recap here. A quick look at one of the events hosted on campus this year, with the incubation community coming together for the day.",
    photoCount: 5,
  },
  {
    slug: "incubation-guest",
    caption: "Guest Visit",
    title: "Guests tour the incubation floor",
    details:
      "Placeholder text for now — replace with the actual visit summary. Visitors spent the afternoon exploring the incubation floor, meeting resident teams and hearing about ongoing projects.",
    photoCount: 5,
  },
  {
    slug: "medical-demo-day",
    caption: "Demo Day",
    title: "Medical innovation demo day",
    details:
      "Placeholder text for now — update with the real demo day write-up. Teams working on medical and healthcare technology presented their prototypes and progress to mentors and guests.",
    photoCount: 5,
  },
  {
    slug: "visit",
    caption: "Site Visit",
    title: "A walkthrough of the incubation campus",
    details:
      "Placeholder text for now — replace with the actual visit details. A guided walkthrough of the campus facilities, labs and workspaces for a group visiting the foundation.",
    photoCount: 5,
  },
];

export const GALLERY_ITEMS = EVENT_INPUTS.map((event) => {
  const album = Array.from({ length: event.photoCount }, (_, i) => ({
    src: `/images/events/${event.slug}/${i + 1}.jpg`,
    alt: `${event.title} — photo ${i + 1}`,
  }));
  // Prefer any file named "1" as the cover image, otherwise fall back
  // to the first entry — this ensures folders that include a 1.jpg
  // use it as the explore gallery cover.
  const cover = album.find((a) => a.src.endsWith(`/1.jpg`)) ?? album[0];
  return { ...event, album, src: cover.src };
});

export const ABOUT_ROWS = [
  {
    label: "Our vision",
    text: "A centre of excellence that builds a dynamic, sustainable ecosystem for real entrepreneurship.",
  },
  {
    label: "Our mission",
    text: "Nurture creativity and innovation among students, faculty and aspiring teams — and carry ideas all the way to products.",
  },
  {
    label: "What we do",
    text: "Sharpen engineers for industry, build an industry mindset early, and teach the real craft of making something people use.",
  },
  {
    label: "Who applies",
    text: "Students, faculty and external startups — at the idea, prototype or early-revenue stage.",
    link: { label: "See if you're a fit", href: "#contact" },
  },
];
