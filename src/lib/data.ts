export const SITE = {
  name: "Sri Sairam Techno Incubator Foundation",
  phone: "+91 78451 27111",
  emails: ["incubation@sairam.edu.in", "queries.rd@sairam.edu.in"],
  linkedin: "https://www.linkedin.com/in/sstif/",
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
  // Hidden by the Header until at least one team member is added in /admin.
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

// HERO_SLIDES, STARTUP_LOGOS and GALLERY_ITEMS below are the site's *initial*
// content only. Once the database is connected they're copied in as seed data
// and from then on are edited at /admin — changing them here won't update a
// live site. See src/lib/content/.
export const HERO_SLIDES = [
  { src: "/images/hero/slide-1.jpg", alt: "Incubation co-working floor" },
  { src: "/images/hero/slide-2.jpg", alt: "Startup teams at work" },
  { src: "/images/hero/slide-3.jpg", alt: "cosmos inauguration" },
  { src: "/images/hero/slide-4.jpg", alt: "CEO talk" },
  { src: "/images/hero/slide-5.jpg", alt: "poster" },
];

export const STATS = [
  { value: 165, label: "Startups Incubated" },
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

// Every incubated startup's logo, converted from the supplied PNGs to WebP and
// normalised to a 200px-tall box (widths vary with each mark's aspect ratio).
export const STARTUP_LOGOS: {
  name: string;
  src: string;
  width: number;
  height: number;
}[] = [
  {
    name: "4Friends",
    src: "/images/startup-logos/4friends.webp",
    width: 200,
    height: 200,
  },
  {
    name: "Adapt Robotics",
    src: "/images/startup-logos/adapt.webp",
    width: 195,
    height: 200,
  },
  {
    name: "Agsaimo",
    src: "/images/startup-logos/agsaimo.webp",
    width: 367,
    height: 200,
  },
  {
    name: "Airman",
    src: "/images/startup-logos/airman.webp",
    width: 1018,
    height: 200,
  },
  {
    name: "Apex Race Technologies",
    src: "/images/startup-logos/apex.webp",
    width: 436,
    height: 200,
  },
  {
    name: "Aquawrap",
    src: "/images/startup-logos/aquawrap.webp",
    width: 925,
    height: 200,
  },
  {
    name: "Armor Grandeur Private Limited",
    src: "/images/startup-logos/armor-grandeur.webp",
    width: 221,
    height: 200,
  },
  {
    name: "Authify",
    src: "/images/startup-logos/authify.webp",
    width: 644,
    height: 200,
  },
  {
    name: "Blunav Technologies Private Limited",
    src: "/images/startup-logos/blunav.webp",
    width: 1088,
    height: 200,
  },
  {
    name: "Curious Wings",
    src: "/images/startup-logos/curious.webp",
    width: 252,
    height: 200,
  },
  {
    name: "DD Chocolates",
    src: "/images/startup-logos/dd-chocolate.webp",
    width: 204,
    height: 200,
  },
  {
    name: "Ecomotive",
    src: "/images/startup-logos/ecomotive.webp",
    width: 849,
    height: 200,
  },
  {
    name: "Edwisely",
    src: "/images/startup-logos/ed-wisely.webp",
    width: 540,
    height: 200,
  },
  {
    name: "Fluezen Technology",
    src: "/images/startup-logos/fluzen.webp",
    width: 200,
    height: 200,
  },
  {
    name: "Genik Technologies Private Limited",
    src: "/images/startup-logos/genik.webp",
    width: 1026,
    height: 200,
  },
  {
    name: "GT",
    src: "/images/startup-logos/gt.webp",
    width: 222,
    height: 200,
  },
  {
    name: "HB",
    src: "/images/startup-logos/hb.webp",
    width: 304,
    height: 200,
  },
  {
    name: "Hebesec Technologies Private Limited",
    src: "/images/startup-logos/hebesec-tech.webp",
    width: 578,
    height: 200,
  },
  {
    name: "IASPL",
    src: "/images/startup-logos/iaspl.webp",
    width: 329,
    height: 200,
  },
  {
    name: "Innoprime Plast Private Limited",
    src: "/images/startup-logos/ippl.webp",
    width: 593,
    height: 200,
  },
  {
    // TODO: this logo (supplied as "iytr7uyrlo86r.png") carries no readable
    // wordmark, so the company behind it is unconfirmed — swap in the real
    // name and rename the file when you know it.
    name: "Incubated startup",
    src: "/images/startup-logos/iytr7uyrlo86r.webp",
    width: 271,
    height: 200,
  },
  {
    name: "Ji",
    src: "/images/startup-logos/ji.webp",
    width: 200,
    height: 200,
  },
  {
    name: "Kite Robotics",
    src: "/images/startup-logos/kites-robotics.webp",
    width: 200,
    height: 200,
  },
  {
    name: "LMES Academy Private Limited",
    src: "/images/startup-logos/lmes.webp",
    width: 729,
    height: 200,
  },
  {
    name: "Sri Matimaging Technologies",
    src: "/images/startup-logos/matimaging.webp",
    width: 753,
    height: 200,
  },
  {
    name: "Miceberry India Private Limited",
    src: "/images/startup-logos/miceberry.webp",
    width: 588,
    height: 200,
  },
  {
    name: "Neurotronix",
    src: "/images/startup-logos/neurotronix.webp",
    width: 145,
    height: 200,
  },
  {
    name: "Oneyes Infotech Solutions",
    src: "/images/startup-logos/oneyes.webp",
    width: 411,
    height: 200,
  },
  {
    name: "Pavithram Ayurveda Pharmacy",
    src: "/images/startup-logos/pavithram.webp",
    width: 347,
    height: 200,
  },
  {
    name: "PlayuNxt",
    src: "/images/startup-logos/playunxt.webp",
    width: 794,
    height: 200,
  },
  {
    name: "Printwear",
    src: "/images/startup-logos/printwear.webp",
    width: 729,
    height: 200,
  },
  {
    name: "SAK Automation Private Limited",
    src: "/images/startup-logos/sak.webp",
    width: 676,
    height: 200,
  },
  {
    name: "SIIT",
    src: "/images/startup-logos/siit.webp",
    width: 196,
    height: 200,
  },
  {
    name: "Silaii",
    src: "/images/startup-logos/silaii.webp",
    width: 359,
    height: 200,
  },
  {
    name: "Skycatch Bots",
    src: "/images/startup-logos/skycatch.webp",
    width: 200,
    height: 200,
  },
  {
    name: "Softrate",
    src: "/images/startup-logos/softrate.webp",
    width: 304,
    height: 200,
  },
  {
    name: "Spark Invotech Private Limited",
    src: "/images/startup-logos/spark-invotech.webp",
    width: 224,
    height: 200,
  },
  {
    name: "Spreco",
    src: "/images/startup-logos/spreco.webp",
    width: 340,
    height: 200,
  },
  {
    name: "Sri Sai Fusion Techno Works",
    src: "/images/startup-logos/sri-sai-fusion.webp",
    width: 293,
    height: 200,
  },
  {
    name: "Theeran Siddha Pharmacy",
    src: "/images/startup-logos/theeran-siddha.webp",
    width: 200,
    height: 200,
  },
  {
    name: "Tunett",
    src: "/images/startup-logos/tunett.webp",
    width: 278,
    height: 200,
  },
  {
    name: "Uru",
    src: "/images/startup-logos/uru.webp",
    width: 200,
    height: 200,
  },
  {
    name: "Vecmocon Technologies Private Limited",
    src: "/images/startup-logos/vecmocon.webp",
    width: 519,
    height: 200,
  },
  {
    name: "Vzync Studios Private Limited",
    src: "/images/startup-logos/vzync.webp",
    width: 230,
    height: 200,
  },
  {
    name: "Zecurit",
    src: "/images/startup-logos/zecurit.webp",
    width: 606,
    height: 200,
  },
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
    slug: "startup-smart",
    caption: "Smart Startup Growth",
    title: "Navigating the Landscape of Startup Growth",
    details:
      "On June 25, 2026, the Sri Sairam Techno Incubator Foundation (SSTIF) hosted a highly informative session titled 'Startup Smart: The Legal Foundations of Growth' at the Isaac Newton Hall. We were privileged to welcome Mr. Anbarasan Mahadevan, Strategic Growth Architect at AMConnect BizTech Private Limited, as our esteemed guest speaker. Navigating the complex foundational landscape is crucial for any emerging business, and Mr. Mahadevan delivered a masterclass on the subject. He provided our aspiring founders with actionable insights on selecting the optimal business structure, safeguarding intellectual property, and maintaining strict regulatory compliance. His deep expertise demystified the prerequisites needed to build a resilient and sustainable startup from the ground up. We extend our deepest gratitude to Mr. Mahadevan for his invaluable guidance and to our active participants for driving such an engaging dialogue. At SSTIF, we remain deeply committed to equipping innovators with the comprehensive mentorship and structural knowledge required to scale their visions successfully. Scroll down to view the photo gallery capturing the highlights and interactive moments from this essential session.",
    photoCount: 5,
  },
  {
    slug: "event",
    caption: "Campus Students Summit 2026",
    title: "Aligning Visions with National Tech Missions at the Campus Students Summit 2026",
    details:
      "The Sri Sairam Techno Incubator Foundation proudly hosted the Campus Students Summit 2026, marking a significant milestone in our mission to foster technological excellence. On January 28, 2025, we had the distinct honor of welcoming Dr. R. Gokulakrishnan, Scientist ‘F’ at STPI–Chennai under the Ministry of Electronics and Information Technology (MeitY), Government of India. His presence brought immense prestige to the event, offering a unique opportunity for our aspiring entrepreneurs to engage with a leading voice in the national tech landscape. During a highly engaging and insightful session, Dr. Gokulakrishnan shared his deep expertise and vision for the future of India's digital ecosystem. He motivated our dynamic students and emerging startups to push the boundaries of conventional thinking and actively pursue breakthrough innovations. Crucially, his address emphasized the importance of aligning these creative solutions with India’s broader national technology and startup missions. The interaction left the audience deeply inspired, sparking new ideas and a renewed commitment to building impactful, scalable ventures.",
    photoCount: 5,
  },
  {
    slug: "incubation-guest",
    caption: "Global Cyber Collaboration",
    title: "Shaping Future-Ready Talent with Macquarie University's Cyber Skills Academy",
    details:
      "On September 6, 2026, the Sri Sairam Techno Incubator Foundation was deeply honored to welcome Mr. Matt Bushby, Chief Executive Officer of the Cyber Skills Academy at Macquarie University. This landmark visit highlighted the vital role that international knowledge exchange plays in fostering a robust culture of innovation and entrepreneurship on our campus. Mr. Bushby shared his visionary perspectives on the rapidly evolving digital landscape, engaging our students and startups in meaningful conversations about the competencies required to succeed globally. By emphasizing the need for cross-border collaboration, his visit inspired our community to think bigger and build tech solutions with a worldwide impact. This foundational meeting sets the stage for strengthened global partnerships, ensuring that our institution remains at the forefront of developing future-ready digital talent.",
    photoCount: 5,
  },
  {
    slug: "cosmos-inaugration",
    caption: "COSMOS Centre Inauguration",
    title: "Inauguration of the COSMOS Space-TVET Centre",
    details:
      "August 2, 2026, marked a historic and deeply emotional milestone for Sairam Institutions with the inauguration of the COSMOS – Sri Leo Muthu Space-TVET Centre. The facility was officially opened by our esteemed alumnus, Dr. P. Veeramuthuvel, the visionary Project Director of India's historic Chandrayaan-3 mission. What makes this cutting-edge center truly exceptional is the deeply inspiring story behind its creation. After receiving the prestigious Tamil Nadu State Award for his monumental contributions to space exploration, Dr. Veeramuthuvel selflessly donated a portion of his prize to his alma mater to bring COSMOS to life. This extraordinary gesture of giving back reflects his profound humility and unwavering dedication to nurturing the next generation of space innovators. We extend our deepest gratitude to Dr. Veeramuthuvel for his immense generosity and continued commitment to shaping future-ready talent. We invite you to explore the gallery below to witness the proud and memorable moments from this stellar inauguration.",
    photoCount: 5,
  },
  {
    slug: "visit",
    caption: "Empowering Global Youth",
    title: "Strengthening Cross-Border Skill Development with the Government of Malaysia",
    details:
      "The Sri Sairam Techno Incubator Foundation and the Sri Leo Muthu TVET Centre were immensely honored to host a distinguished delegation from the Ministry of Education (MOE), Government of Malaysia, on July 28, 2026. This landmark visit served as a powerful testament to our growing global footprint in technological innovation and vocational education. The delegates extensively explored our dynamic ecosystem, engaging directly with our incubated startups and touring our future-ready TVET facilities. Discussions centered on vital avenues for international collaboration, cross-border academic partnerships, and capacity building to nurture cutting-edge talent. We extend our deepest gratitude to HCL for facilitating this invaluable knowledge exchange and for their unwavering support in connecting global institutions. This engagement lays a strong foundation for future joint initiatives aimed at empowering youth with sustainable, global-standard skills. Browse the gallery below to witness the key moments of this cross-border exchange.",
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

// The four headline numbers from SSTIF's "Powering Innovation, Building
// Impact" one-pager. `icon` is a key rather than a component so this stays
// framework-agnostic — About.tsx maps it to the matching StatIcons export.
export const FOUNDATION_STATS = [
  { icon: "rocket", value: "165", label: "Startups" },
  { icon: "building", value: "75,000+", label: "Sq ft. innovation space" },
  { icon: "rupee", value: "₹11 Cr", label: "External fundings" },
  {
    icon: "infra",
    value: "₹10+ Cr",
    label: "Infrastructure & research investment",
  },
] as const;

export const GLOBAL_COLLAB = {
  heading: "Global collaborations & initiatives",
  text: "Sairam Institutions' global outlook is equally impressive. It recently organised Build 2Gether International — a 24-hour AI SDG hackathon with ETH Zurich and Nanyang Technological University that drew 2,000+ participants across 500+ teams — and is hosting the ESG & Sustainability Leadership Summit 2026 in Chennai, bringing together leaders from academia, industry and governance.",
};

// Short summary of the wider Sairam Innovation Ecosystem, shown just below
// the foundation section with a link out to the group's own microsite.
export const ECOSYSTEM_LINK = "https://innovation.sairamgroup.in/";

export const ECOSYSTEM_STATS = [
  { value: "25,000+", label: "Students" },
  { value: "2,000+", label: "Faculty members" },
  { value: "2020", label: "SSTIF established" },
] as const;

export const ECOSYSTEM_CONTENT = {
  eyebrow: "The wider ecosystem",
  heading: "Part of the Sairam Innovation Ecosystem",
  paragraphs: [
    "Sairam Institutions is one of India's most progressive educational ecosystems, with 25,000+ students and 2,000+ faculty working across academic excellence, innovation, entrepreneurship and sustainability.",
    "SSTIF is its flagship platform — built in 2020 on the philosophy of “One Student, One Startup”, driving a competition-based innovation pedagogy aligned with the UN Sustainable Development Goals, and backed by industry partners including SIRD, Unnat Bharat Abhiyan, TIEMA, AIEMA and PETC.",
  ],
  quote: "One Student, One Startup",
};
