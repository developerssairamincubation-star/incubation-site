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
