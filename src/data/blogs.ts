export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface BlogImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  coverCaption?: string;
  author: BlogAuthor;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "locals-guide-licensed-sustainable-tour-operator-belize",
    title: "A Local's Guide to Choosing a Licensed & Sustainable Tour Operator in Belize",
    subtitle: "How to tell real eco-friendly operators from greenwashed tours, spot red flags, and protect the Belize you came to experience.",
    excerpt:
      "Every week someone messages me the same thing: 'I found a tour for half the price. Is it the same?' Sometimes it is. Often it isn't. And in Belize, the difference between a great day and a dangerous one, or between a trip that supports local families and one that quietly harms the places you came to see, usually comes down to one decision: who you book with.",
    publishedAt: "October 16, 2026",
    readTime: "6 min read",
    category: "Sustainable Travel",
    coverImage: "/images/blogimages/WhatsApp Image 2026-10-16 at 13.32.56.jpeg",
    coverImageAlt: "Scarlet macaw in flight over Belize jungle canopy",
    coverCaption: "Scarlet macaws in flight. Seeing wildlife like this is a privilege, not a guarantee, and good operators never chase it. (Photo: Celso Sho)",
    author: {
      name: "Wilder",
      role: "Owner, Wilder Belize Adventures",
      avatar: "/belize_new_logo.png",
    },
    tags: ["Belize Travel", "Eco-Tourism", "Travel Safety", "Local Guides", "Placencia"],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
