import { Coins } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function DignityCoin() {
  return (
    <PlaceholderPage
      title="Dignity Coin Dashboard"
      description="Track your covenant-based investments linked to planetary healing metrics and SDG impact. Connect your wallet to view token balances, regenerative impact scores, and participate in ethical finance protocols that transform wealth into wisdom."
      icon={<Coins className="w-full h-full" />}
    />
  );
}
