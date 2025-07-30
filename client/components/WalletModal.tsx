import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Wallet, Zap, Shield, Globe, Loader2 } from "lucide-react";

const walletOptions = [
  {
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using MetaMask browser extension',
    popular: true,
  },
  {
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Scan with WalletConnect-compatible wallet',
    popular: false,
  },
  {
    name: 'Coinbase Wallet',
    icon: '💙',
    description: 'Connect using Coinbase Wallet',
    popular: false,
  },
  {
    name: 'Rainbow',
    icon: '🌈',
    description: 'Connect using Rainbow wallet',
    popular: false,
  },
];

export default function WalletModal() {
  const { state, dispatch } = useUser();

  // Don't render if context is not ready
  if (!state) {
    return null;
  }

  const handleConnect = async (walletName: string) => {
    dispatch({ type: 'SET_CONNECTING', payload: true });
    
    try {
      // Simulate wallet connection (replace with actual Web3 integration)
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          const address = accounts[0];
          dispatch({ 
            type: 'CONNECT_WALLET', 
            payload: { address } 
          });
        }
      } else {
        // Fallback demo mode
        const demoAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
        setTimeout(() => {
          dispatch({ 
            type: 'CONNECT_WALLET', 
            payload: { address: demoAddress } 
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  };

  const handleClose = () => {
    if (!state.isConnecting) {
      dispatch({ type: 'SET_WALLET_MODAL', payload: false });
    }
  };

  return (
    <Dialog open={state.showWalletModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-foreground">
            <div className="w-10 h-10 rounded-full bg-atlas-gold/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-atlas-gold" />
            </div>
            Connect to Atlas Sanctum
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-foreground/70 space-y-2">
            <p>
              Connect your wallet to access the full Atlas Sanctum experience and join the regenerative finance revolution.
            </p>
            
            <div className="flex items-center gap-6 text-xs bg-muted/50 rounded-lg p-3 mt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-atlas-wisdom" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-atlas-cosmic" />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-atlas-regenerative" />
                <span>Decentralized</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full h-auto p-4 border-border hover:border-atlas-gold/50 hover:bg-atlas-gold/5 transition-all duration-200 disabled:opacity-50"
                onClick={() => handleConnect(wallet.name)}
                disabled={state.isConnecting}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{wallet.name}</span>
                      {wallet.popular && (
                        <span className="px-2 py-1 bg-atlas-cosmic/20 text-atlas-cosmic text-xs rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/60 mt-1">{wallet.description}</p>
                  </div>
                  {state.isConnecting && (
                    <Loader2 className="w-4 h-4 animate-spin text-atlas-gold" />
                  )}
                </div>
              </Button>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-foreground/50 text-center">
              New to crypto wallets?{' '}
              <button className="text-atlas-wisdom hover:text-atlas-wisdom/80 underline">
                Learn how to get started
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
