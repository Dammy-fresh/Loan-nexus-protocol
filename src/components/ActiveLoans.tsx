
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  DollarSign, 
  Shield, 
  TrendingDown, 
  AlertTriangle, 
  Calendar,
  ExternalLink
} from "lucide-react";

const ActiveLoans = () => {
  // Mock loan data
  const loans = [
    {
      id: "LOAN-001",
      amount: 25000,
      collateral: 50000,
      asset: "ETH",
      interestRate: 5.5,
      dueDate: "2024-08-15",
      healthFactor: 1.85,
      status: "active",
      remainingDays: 45,
      paid: 12000,
      liquidationPrice: 1250
    },
    {
      id: "LOAN-002", 
      amount: 50000,
      collateral: 80000,
      asset: "BTC",
      interestRate: 4.8,
      dueDate: "2024-09-22",
      healthFactor: 1.42,
      status: "warning",
      remainingDays: 83,
      paid: 5000,
      liquidationPrice: 28500
    },
    {
      id: "LOAN-003",
      amount: 15000,
      collateral: 30000,
      asset: "USDC",
      interestRate: 6.2,
      dueDate: "2024-07-30",
      healthFactor: 2.1,
      status: "active",
      remainingDays: 12,
      paid: 8000,
      liquidationPrice: 0.95
    }
  ];

  const getStatusBadge = (status: string, healthFactor: number) => {
    if (status === "warning" || healthFactor < 1.5) {
      return <Badge variant="destructive">At Risk</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>;
  };

  const getAssetColor = (asset: string) => {
    const colors = {
      ETH: "bg-blue-500",
      BTC: "bg-orange-500", 
      USDC: "bg-green-500"
    };
    return colors[asset as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Active Loans</h2>
          <p className="text-muted-foreground">Monitor and manage your current loan positions</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <DollarSign className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      <div className="grid gap-6">
        {loans.map((loan) => (
          <Card key={loan.id} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{loan.id}</span>
                    {getStatusBadge(loan.status, loan.healthFactor)}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${getAssetColor(loan.asset)}`}></div>
                      <span>{loan.asset} Collateral</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{loan.remainingDays} days remaining</span>
                    </span>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Loan Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-xl font-semibold">${loan.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Collateral</p>
                  <p className="text-xl font-semibold">${loan.collateral.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-xl font-semibold">{loan.interestRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Health Factor</p>
                  <p className={`text-xl font-semibold ${
                    loan.healthFactor >= 1.5 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {loan.healthFactor.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Payment Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payment Progress</span>
                  <span className="font-medium">
                    ${loan.paid.toLocaleString()} / ${loan.amount.toLocaleString()}
                  </span>
                </div>
                <Progress value={(loan.paid / loan.amount) * 100} className="h-2" />
              </div>

              {/* Risk Indicators */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center space-y-1">
                  <Shield className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Collateral Ratio</p>
                  <p className="font-medium">{((loan.collateral / loan.amount) * 100).toFixed(0)}%</p>
                </div>
                <div className="text-center space-y-1">
                  <TrendingDown className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Liquidation Price</p>
                  <p className="font-medium">${loan.liquidationPrice.toLocaleString()}</p>
                </div>
                <div className="text-center space-y-1">
                  <Clock className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Repay
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Add Collateral
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>

              {/* Warning for at-risk loans */}
              {loan.healthFactor < 1.5 && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Liquidation Risk</p>
                    <p>Add collateral or repay loan to improve health factor</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveLoans;
