import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  persona?: "custodian" | "creator" | "regenerator" | "citizen" | null;
  structuredData?: object;
}

const personaKeywords = {
  custodian:
    "ethical investment platforms, impact investing dashboard, regenerative finance tools, conscious capitalism SaaS, wealth management ethics",
  creator:
    "AI for art and healing, global wisdom library, crisis into art platform, creative storytelling finance, cultural wisdom",
  regenerator:
    "fund my climate project, AI funding platform for NGOs, transparent regenerative capital, planetary healing finance",
  citizen:
    "where does my money go map, AI storytelling for the planet, ethical finance map app, conscience capitalism tools",
};

const baseStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Atlas Sanctum",
  description:
    "The world's first platform transforming capital into conscience and wealth into wisdom through regenerative finance.",
  url: "https://atlassanctum.com",
  logo: "https://atlassanctum.com/logo.png",
  sameAs: [
    "https://twitter.com/atlassanctum",
    "https://linkedin.com/company/atlassanctum",
  ],
  foundingDate: "2024",
  founder: {
    "@type": "Organization",
    name: "Atlas Sanctum Foundation",
  },
  applicationCategory: "FinTech",
  operatingSystem: "Web, iOS, Android",
  offers: {
    "@type": "Offer",
    category: "SaaS Platform",
    description: "Regenerative finance platform with AI-powered insights",
  },
};

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  type = "website",
  persona,
  structuredData,
}: SEOProps) {
  const location = useLocation();

  const defaultTitle =
    "Atlas Sanctum - Capital Becomes Conscience, Wealth Becomes Wisdom";
  const defaultDescription =
    "Transform finance for planetary healing with the world's first regenerative finance platform. Connect ethical capital to regenerative projects through AI-powered insights and immersive storytelling.";
  const defaultKeywords =
    "regenerative finance, ethical investing, impact investment platform, conscious capitalism, dignity coin, planetary healing, AI finance, Web3 sustainability";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords =
    keywords ||
    (persona
      ? `${defaultKeywords}, ${personaKeywords[persona]}`
      : defaultKeywords);
  const finalImage = image || "/og-image.jpg";
  const canonicalUrl = `https://atlassanctum.com${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Remove existing meta tags
    const existingMetas = document.querySelectorAll(
      "meta[name], meta[property]",
    );
    existingMetas.forEach((meta) => {
      if (
        meta.getAttribute("name")?.startsWith("description") ||
        meta.getAttribute("name")?.startsWith("keywords") ||
        meta.getAttribute("property")?.startsWith("og:") ||
        meta.getAttribute("property")?.startsWith("twitter:")
      ) {
        meta.remove();
      }
    });

    // Remove existing structured data
    const existingLD = document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (existingLD) {
      existingLD.remove();
    }

    // Add meta tags
    const metaTags = [
      // Basic SEO
      { name: "description", content: finalDescription },
      { name: "keywords", content: finalKeywords },
      { name: "author", content: "Atlas Sanctum" },
      { name: "robots", content: "index, follow, max-image-preview:large" },

      // Open Graph
      { property: "og:title", content: finalTitle },
      { property: "og:description", content: finalDescription },
      { property: "og:image", content: finalImage },
      { property: "og:url", content: canonicalUrl },
      { property: "og:type", content: type },
      { property: "og:site_name", content: "Atlas Sanctum" },
      { property: "og:locale", content: "en_US" },

      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: finalTitle },
      { name: "twitter:description", content: finalDescription },
      { name: "twitter:image", content: finalImage },
      { name: "twitter:site", content: "@atlassanctum" },

      // Mobile & App
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "Atlas Sanctum" },
      { name: "theme-color", content: "#D4AF37" }, // atlas-gold

      // PWA
      { name: "application-name", content: "Atlas Sanctum" },
      { name: "msapplication-TileColor", content: "#D4AF37" },

      // Performance
      { "http-equiv": "x-dns-prefetch-control", content: "on" },
    ];

    metaTags.forEach(({ name, property, content, "http-equiv": httpEquiv }) => {
      const meta = document.createElement("meta");
      if (name) meta.setAttribute("name", name);
      if (property) meta.setAttribute("property", property);
      if (httpEquiv) meta.setAttribute("http-equiv", httpEquiv);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    });

    // Add canonical link
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Add structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData || baseStructuredData);
    document.head.appendChild(script);

    // Add preconnect for performance
    const preconnects = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://api.atlassanctum.com",
    ];

    preconnects.forEach((url) => {
      let link = document.querySelector(
        `link[rel="preconnect"][href="${url}"]`,
      ) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "preconnect";
        link.href = url;
        if (url.includes("gstatic")) {
          link.crossOrigin = "anonymous";
        }
        document.head.appendChild(link);
      }
    });
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    finalImage,
    canonicalUrl,
    structuredData,
  ]);

  return null;
}

// Utility function to generate persona-specific structured data
export function generatePersonaStructuredData(
  persona: "custodian" | "creator" | "regenerator" | "citizen",
) {
  const personaData = {
    custodian: {
      "@type": "SoftwareApplication",
      applicationCategory: "FinanceApplication",
      name: "Atlas Sanctum - Ethical Investment Platform",
      description:
        "Professional dashboard for ethical capital custodians to redirect investments into regenerative projects with real-time impact analytics.",
      featureList: [
        "Portfolio regeneration scoring",
        "Impact investment analytics",
        "Dignity Coin covenant tracking",
        "Ethics-in-motion reporting",
      ],
      targetAudience: {
        "@type": "Audience",
        audienceType: "Wealth Managers, Family Offices, Impact Investors",
      },
    },
    creator: {
      "@type": "CreativeWork",
      name: "Atlas Sanctum - Cultural Creator Platform",
      description:
        "AI-powered platform for artists and cultural creators to transform crisis into healing through poetry, music, and wisdom narratives.",
      genre: "Digital Art Platform",
      featureList: [
        "Pain transmutation studio",
        "AI story generation",
        "Global wisdom library",
        "Cultural collaboration tools",
      ],
      targetAudience: {
        "@type": "Audience",
        audienceType: "Artists, Writers, Cultural Workers, Wisdom Keepers",
      },
    },
    regenerator: {
      "@type": "Service",
      name: "Atlas Sanctum - Regenerative Project Platform",
      description:
        "Transparent funding platform connecting planetary regeneration projects with ethical capital through AI-powered matching.",
      serviceType: "Project Funding",
      featureList: [
        "Project submission portal",
        "AI funding matching",
        "Impact visualization",
        "Transparent capital flows",
      ],
      targetAudience: {
        "@type": "Audience",
        audienceType:
          "NGOs, Climate Organizations, Indigenous Communities, Regenerative Projects",
      },
    },
    citizen: {
      "@type": "MobileApplication",
      name: "Atlas Sanctum - Citizen Conscience App",
      description:
        "Interactive map and tools for citizens to understand financial flows and take micro-actions for planetary healing.",
      operatingSystem: "Web, iOS, Android",
      featureList: [
        "Interactive financial flow map",
        "Micro-action tools",
        "Personal impact tracking",
        "Crisis-to-poetry converter",
      ],
      targetAudience: {
        "@type": "Audience",
        audienceType: "Conscious Citizens, Students, Community Activists",
      },
    },
  };

  return {
    ...baseStructuredData,
    ...personaData[persona],
  };
}
