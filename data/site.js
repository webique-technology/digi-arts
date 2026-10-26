// Static site content. Replace image: null with a path in /public/images/... (e.g. '/images/tile-decor.jpg')
export const SITE_INFO = {
  name: "Digi Art’s Store",
  announcement: "Free shipping on orders above Rs 999",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
};

const cat = (slug) => `/products?category=${slug}`;

export const NAV = [
  {
    label: "Bags & Boxes",
    href: "/products",
    children: [
      { label: "Gift Bags & Wraps", href: cat("gift-bags-wraps") },
      { label: "Small Gift Bags", href: cat("small-bags") },
      { label: "Boxes & Baskets", href: cat("boxes-baskets") },
      { label: "Shaped Boxes", href: cat("shaped-boxes") },
    ],
  },
  {
    label: "Diwali",
    href: cat("diwali"),
    children: [
      { label: "Diwali Box", href: cat("diwali-box") },
      { label: "Diwali Wall Decor", href: cat("diwali-wall-decor") },
      { label: "Diwali Floor Decor", href: cat("diwali-floor-decor") },
      { label: "Diwali Gift Sets", href: cat("gift-sets") },
    ],
  },
  {
    label: "Décor",
    href: cat("decor"),
    children: [
      { label: "Wall Decor", href: cat("wall-decor") },
      { label: "Floor Decor", href: cat("floor-decor") },
      { label: "Lamps", href: cat("lamps") },
    ],
  },
  { label: "Karwachauth", href: cat("karwachauth") },
  { label: "Gift Sets", href: cat("gift-sets") },
  { label: "Bulk Order", href: "/pages/bulk-orders" },
  {
    label: "Essentials",
    href: cat("essentials"),
    children: [
      { label: "DIY & Notebooks", href: cat("diy-notebooks") },
      { label: "Combos", href: cat("combos") },
      { label: "Birth Announcements", href: cat("birth-announcements") },
    ],
  },
];

export const FOOTER_QUICK = [
  { label: "Search", href: "/products" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Bulk Orders", href: "/pages/bulk-orders" },
  { label: "Collaborate with us", href: "/pages/collaborate" },
  { label: "Partner with us", href: "/pages/partner" },
  { label: "Shop All", href: "/products" },
  { label: "FAQ's", href: "/pages/faq" },
];
export const FOOTER_CATS = [
  { label: "Gift Bags & Wraps", href: cat("gift-bags-wraps") },
  { label: "Boxes & Baskets", href: cat("boxes-baskets") },
  { label: "Ganpati", href: cat("ganpati") },
  { label: "Shagun", href: cat("shagun") },
  { label: "Gift Sets", href: cat("gift-sets") },
  { label: "Birth Announcements", href: cat("birth-announcements") },
  { label: "Decor", href: cat("decor") },
  { label: "Combos", href: cat("combos") },
  { label: "DIY & Notebooks", href: cat("diy-notebooks") },
  { label: "Bulk Order", href: "/pages/bulk-orders" },
];
export const POLICIES = [
  { label: "Refund policy", href: "/pages/refund-policy" },
  { label: "Privacy policy", href: "/pages/privacy-policy" },
  { label: "Terms of service", href: "/pages/terms-of-service" },
  { label: "Shipping policy", href: "/pages/shipping-policy" },
  { label: "Contact information", href: "/contact" },
];

export const HERO_FALLBACK = [
  {
    id: "f1",
    title: "Thoughtful gifts, made by hand",
    subtitle: "Make every celebration feel a little more special.",
    link_url: "/products",
    image_desktop: "/images/digi-art-slider-1.webp",
  },
  {
    id: "f2",
    title: "Gifts that make an impression",
    subtitle: "Discover keepsake boxes and beautifully wrapped moments.",
    link_url: "/products?category=gift-sets",
    image_desktop: "/images/split.jpg",
  },
  {
    id: "f3",
    title: "A little something, made with love",
    subtitle: "Shop handcrafted bags, décor and stationery.",
    link_url: "/products",
    image_desktop: "/images/tile-decor.jpg",
  },
];

export const HOME = {
  tiles: [
    {
      label: "Decor",
      href: cat("decor"),
      image: "/images/tile-decor.jpg",
      tone: "linear-gradient(160deg,#2b2321,#6b3b3b 60%,#a45a4a)",
    },
    {
      label: "Diwali Gift Sets",
      href: cat("gift-sets"),
      image: "/images/tile-gift-sets.jpg",
      tone: "linear-gradient(160deg,#4a2020,#8a2f2a 60%,#c0663f)",
    },
    {
      label: "Gift Bags",
      href: cat("gift-bags-wraps"),
      image: "/images/tile-gift-bags.jpg",
      tone: "linear-gradient(160deg,#27384a,#4a6a80 60%,#a9b9b0)",
    },
  ],
  customOrders: [1, 2, 3, 4, 5].map((n) => ({
    image: `/images/custom-${n}.jpg`,
    tone: "#eee",
  })),
  instagram: Array.from({ length: 6 }, (_, i) => ({
    id: i,
    image: `/images/insta-${i + 1}.jpg`,
  })),
  split: {
    title: "The New Boxes",
    text: "Send your memories to your loved ones",
    href: cat("boxes-baskets"),
    image: "/images/split.jpg",
    tone: "linear-gradient(135deg,#e8d9b8,#c9a36b)",
  },
  collections: [
    {
      label: "Shagun",
      href: cat("shagun"),
      image: "/images/col-shagun.jpg",
      tone: "linear-gradient(160deg,#a4281f,#e0a43a)",
    },
    {
      label: "Note books",
      href: cat("diy-notebooks"),
      image: "/images/col-notebooks.jpg",
      tone: "linear-gradient(160deg,#e9d8c9,#b98a6e)",
    },
    {
      label: "Lamps",
      href: cat("lamps"),
      image: "/images/col-lamps.jpg",
      tone: "linear-gradient(160deg,#f3d9a4,#8a5a2b)",
    },
    {
      label: "Shaped boxes",
      href: cat("shaped-boxes"),
      image: "/images/col-boxes.jpg",
      tone: "linear-gradient(160deg,#b24a2a,#e7a45a)",
    },
  ],
  story: {
    eyebrow: "Our story",
    title: "Made with love, by hand",
    text: [
      "Digi Art’s Store creates thoughtfully crafted gift bags, boxes, décor and stationery for every celebration. Each piece is designed with care and made to be kept, reused and loved.",
      "Based in Jaipur, we bring together thoughtful details, color and craftsmanship to make gifting feel personal. From a small gesture to a larger celebration, our collections are made to help you share the moment.",
    ],
    href: "/about",
    image: "/images/story.jpg",
    tone: "linear-gradient(160deg,#c9a77a,#6b4a2b)",
  },
  clients: [],
  coming: {
    eyebrow: "Pre-orders",
    title: "Coming soon",
    text: "Shop our new line of exclusive products.",
    href: "/products",
    image: "/images/coming.jpg",
    tone: "linear-gradient(160deg,#7a1f2b,#d7a15a)",
  },
  features: [
    "Worldwide shipping",
    "Sustainable products",
    "We value our artisan",
  ],
};

export const EXPLORE = [
  {
    label: "Diwali Box",
    href: cat("diwali-box"),
    image: "/images/explore-1.jpg",
  },
  {
    label: "Diwali Wall Decor",
    href: cat("diwali-wall-decor"),
    image: "/images/explore-2.jpg",
  },
  {
    label: "Diwali Floor Decor",
    href: cat("diwali-floor-decor"),
    image: "/images/explore-3.jpg",
  },
  {
    label: "Gift Sets",
    href: cat("gift-sets"),
    image: "/images/explore-4.jpg",
  },
  { label: "Decor", href: cat("decor"), image: "/images/explore-5.jpg" },
];

// Shown at the bottom of the product page
export const EXPLORE_PRODUCT = [
  {
    label: "Notebooks",
    href: cat("diy-notebooks"),
    image: "/images/col-notebooks.jpg",
  },
  {
    label: "Gift Sets",
    href: cat("gift-sets"),
    image: "/images/tile-gift-sets.jpg",
  },
  {
    label: "Gift Box",
    href: cat("boxes-baskets"),
    image: "/images/explore-1.jpg",
  },
  {
    label: "Gift Bags",
    href: cat("gift-bags-wraps"),
    image: "/images/tile-gift-bags.jpg",
  },
];

export const instagram = [
  {
    id: 1,
    type: "video",
    video: "/videos/insta-1.mp4",
    url: "https://www.instagram.com/",
    alt: "Handcrafted paper products making",
  },
  {
    id: 2,
    type: "video",
    video: "/videos/insta-2.mp4",
    url: "https://www.instagram.com/",
    alt: "Decorative gift packaging",
  },
  {
    id: 3,
    type: "video",
    video: "/videos/insta-3.mp4",
    url: "https://www.instagram.com/",
    alt: "Handcrafted product showcase",
  },
  {
    id: 4,
    type: "video",
    video: "/videos/insta-4.mp4",
    url: "https://www.instagram.com/",
    alt: "Decorative wall hanging",
  },
  {
    id: 5,
    type: "video",
    video: "/videos/insta-5.mp4",
    url: "https://www.instagram.com/",
    alt: "Gift packaging process",
  },
  {
    id: 6,
    type: "video",
    video: "/videos/insta-6.mp4",
    url: "https://www.instagram.com/",
    alt: "Decorative wall hanging",
  },
];
