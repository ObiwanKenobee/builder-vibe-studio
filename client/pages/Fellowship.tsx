import { Users } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Fellowship() {
  return (
    <PlaceholderPage
      title="Regenerative Custodianship Fellowship"
      description="Join a community of visionaries reshaping finance for planetary regeneration. Access advanced training modules, connect with fellow custodians, and participate in real-time forums dedicated to transforming capital into consciousness."
      icon={<Users className="w-full h-full" />}
    />
  );
}
