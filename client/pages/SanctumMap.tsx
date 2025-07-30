import { Globe } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function SanctumMap() {
  return (
    <PlaceholderPage
      title="Sanctum Map"
      description="Experience a 3D interactive globe revealing financial empires and regeneration flows with real-time data overlays. Navigate through planetary healing metrics, ethical investment flows, and discover the hidden connections between capital and consciousness."
      icon={<Globe className="w-full h-full" />}
    />
  );
}
