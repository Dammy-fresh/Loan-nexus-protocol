
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: any;
  walletBalance: number;
  onInvestmentComplete: (amount: number) => void;
}

const InvestmentModal = ({ isOpen, onClose, loan, walletBalance, onInvestmentComplete }: InvestmentModalProps) => {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const { toast } = useToast();

  const handleInvestment = () => {
    if (investmentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Investment amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (investmentAmount > walletBalance) {
      toast({
        title: "Insufficient Funds",
        description: "Investment amount exceeds wallet balance",
        variant: "destructive",
      });
      return;
    }

    console.log("Processing investment:", {
      loanId: loan.id,
      amount: investmentAmount,
      timestamp: new Date().toISOString()
    });

    onInvestmentComplete(investmentAmount);

    toast({
      title: "Investment Successful",
      description: `Successfully invested $${investmentAmount.toLocaleString()} in loan ${loan.id}`,
    });

    onClose();
  };

  if (!loan) return null;

  const remainingAmount = loan.amount - (loan.amount * (loan.fundingProgress / 100));
  const maxInvestment = Math.min(walletBalance, remainingAmount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Invest in Loan</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Loan ID</span>
              <Badge variant="outline">{loan.id}</Badge>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="font-medium">${loan.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Interest Rate</span>
              <span className="font-medium">{loan.requestedRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Remaining to Fund</span>
              <span className="font-medium">${remainingAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Your Wallet Balance</p>
              <p className="text-lg font-bold text-blue-800">${walletBalance.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investment">Investment Amount</Label>
            <Input
              id="investment"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              placeholder="Enter investment amount"
              max={maxInvestment}
              min={1}
            />
            <p className="text-xs text-muted-foreground">
              Maximum: ${maxInvestment.toLocaleString()}
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleInvestment} className="flex-1">
              <DollarSign className="w-4 h-4 mr-2" />
              Invest Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;
