import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface WalletOption {
  name: string;
  icon: string;
  description: string;
  action: () => Promise<void>;
}

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: string) => Promise<void>;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const walletOptions: WalletOption[] = [
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Most popular Ethereum wallet",
      action: () => onConnect("metamask"),
    },
    {
      name: "Rabby",
      icon: "🐰",
      description: "Multi-chain browser wallet",
      action: () => onConnect("rabby"),
    },
    {
      name: "Phantom",
      icon: "👻",
      description: "Solana & Multi-chain wallet",
      action: () => onConnect("phantom"),
    },
    {
      name: "Trust Wallet",
      icon: "🛡️",
      description: "Secure multi-chain wallet",
      action: () => onConnect("trustwallet"),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-sm border border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-xl">
            <Wallet className="w-6 h-6 inline mr-2" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 p-4">
          {walletOptions.map((wallet) => (
            <Card 
              key={wallet.name}
              className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer"
              onClick={wallet.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{wallet.name}</h3>
                    <p className="text-sm text-gray-300">{wallet.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-gray-400 mt-4">
          You'll be redirected to your wallet's website to complete the login process.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelectionModal;