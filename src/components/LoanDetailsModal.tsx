
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Shield, 
  User,
  MapPin,
  Briefcase,
  GraduationCap 
} from "lucide-react";

interface LoanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: any;
  onInvest?: (loanId: string) => void;
  showInvestButton?: boolean;
}

const LoanDetailsModal = ({ isOpen, onClose, loan, onInvest, showInvestButton = false }: LoanDetailsModalProps) => {
  if (!loan) return null;

  // Mock borrower details
  const borrowerDetails = {
    name: "John Smith",
    age: 34,
    location: "San Francisco, CA",
    occupation: "Software Engineer",
    experience: "8 years",
    education: "Master's in Computer Science",
    creditScore: 750,
    income: "$120,000/year",
    employmentStatus: "Full-time",
    previousLoans: 2,
    repaymentHistory: "100% on time"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Loan Details - {loan.id}</span>
            <Badge className={
              loan.riskLevel === "Low Risk" ? "bg-green-500/20 text-green-400" :
              loan.riskLevel === "Medium Risk" ? "bg-yellow-500/20 text-yellow-400" :
              "bg-red-500/20 text-red-400"
            }>
              {loan.riskLevel}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loan Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Loan Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">${loan.amount?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{loan.duration || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{loan.requestedRate || loan.rate || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{loan.purpose || 'N/A'}</p>
                </div>
              </div>
            </div>

            {loan.fundingProgress !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Funding Progress</span>
                  <span>{loan.fundingProgress}%</span>
                </div>
                <Progress value={loan.fundingProgress} className="h-2" />
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm">{loan.description || 'No description available'}</p>
            </div>
          </div>

          {/* Borrower Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Borrower Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{borrowerDetails.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{borrowerDetails.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p className="font-medium">{borrowerDetails.occupation}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Education</p>
                  <p className="font-medium">{borrowerDetails.education}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Credit Score</p>
                <p className="font-medium text-green-600">{borrowerDetails.creditScore}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Income</p>
                <p className="font-medium">{borrowerDetails.income}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previous Loans</p>
                <p className="font-medium">{borrowerDetails.previousLoans}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repayment History</p>
                <p className="font-medium text-green-600">{borrowerDetails.repaymentHistory}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {showInvestButton && onInvest && (
            <Button 
              onClick={() => onInvest(loan.id)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Invest in Loan
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanDetailsModal;
