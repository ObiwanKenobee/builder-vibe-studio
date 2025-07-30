import { Book } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Library() {
  return (
    <PlaceholderPage
      title="Library of Living Meaning"
      description="Immerse yourself in curated wisdom texts, media, and rituals with AI-powered semantic search. Experience ethics-in-motion narratives that transform ancient wisdom into actionable guidance for modern regenerative finance."
      icon={<Book className="w-full h-full" />}
    />
  );
}
