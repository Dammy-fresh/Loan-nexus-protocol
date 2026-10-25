
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: any;
}

const PaymentModal = ({ isOpen, onClose, loan }: PaymentModalProps) => {
  const [paymentAmount, setPaymentAmount] = useState(loan?.nextPayment || 0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { toast } = useToast();

  const handlePayment = () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    console.log("Processing payment:", {
      loanId: loan.id,
      amount: paymentAmount,
      method: paymentMethod,
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Payment Processed",
      description: `Payment of $${paymentAmount.toLocaleString()} has been processed successfully`,
    });

    onClose();
  };

  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Make Payment</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Loan ID</span>
              <Badge variant="outline">{loan.id}</Badge>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Next Payment Due</span>
              <span className="font-medium">${loan.nextPayment?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Due Date</span>
              <span className="font-medium">{loan.dueDate || 'N/A'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wallet">Connected Wallet</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePayment} className="flex-1">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
