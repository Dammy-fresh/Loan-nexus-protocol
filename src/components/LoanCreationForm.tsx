
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Shield, TrendingUp, AlertTriangle, Info } from "lucide-react";

const LoanCreationForm = () => {
  const [loanAmount, setLoanAmount] = useState([25000]);
  const [collateralAmount, setCollateralAmount] = useState(50000);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [loanTerm, setLoanTerm] = useState("");

  const collateralRatio = collateralAmount / loanAmount[0];
  const healthFactor = collateralRatio / 1.5; // Minimum 150% ratio
  const interestRate = 5.5;
  const liquidationPrice = (loanAmount[0] * 1.5) / (collateralAmount / 2000); // Assuming ETH at $2000

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Loan Form */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>Create New Loan</span>
            </CardTitle>
            <CardDescription>
              Set up your decentralized loan with customizable terms and collateral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Loan Amount */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Loan Amount</Label>
              <div className="space-y-2">
                <Slider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  max={100000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$1,000</span>
                  <span className="font-medium text-lg text-foreground">
                    ${loanAmount[0].toLocaleString()}
                  </span>
                  <span>$100,000</span>
                </div>
              </div>
            </div>

            {/* Collateral Asset */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Collateral Asset</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span>Ethereum (ETH)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="btc">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        <span>Bitcoin (BTC)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="usdc">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        <span>USD Coin (USDC)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collateral">Collateral Amount ($)</Label>
                <Input
                  id="collateral"
                  type="number"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(Number(e.target.value))}
                  placeholder="50000"
                />
              </div>
            </div>

            {/* Loan Terms */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="term">Loan Term</Label>
                <Select value={loanTerm} onValueChange={setLoanTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate</Label>
                <div className="flex items-center space-x-2">
                  <Input value={`${interestRate}%`} disabled />
                  <Badge variant="secondary">Variable</Badge>
                </div>
              </div>
            </div>

            {/* Collateral Ratio Warning */}
            {collateralRatio < 1.5 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Minimum collateral ratio is 150%. Current ratio: {(collateralRatio * 100).toFixed(0)}%
                </AlertDescription>
              </Alert>
            )}

            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={collateralRatio < 1.5 || !selectedAsset || !loanTerm}
            >
              Create Loan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Loan Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Loan Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Loan Amount</span>
                <span className="font-medium">${loanAmount[0].toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Collateral</span>
                <span className="font-medium">${collateralAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Collateral Ratio</span>
                <Badge variant={collateralRatio >= 1.5 ? "default" : "destructive"}>
                  {(collateralRatio * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Health Factor</span>
                <span className={`font-medium ${healthFactor >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {healthFactor.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Interest Rate</span>
                <span className="font-medium">{interestRate}% APY</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>Risk Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Liquidation Price</span>
                <span className="font-medium">${liquidationPrice.toFixed(0)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Max LTV</span>
                <span className="font-medium">66.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Liquidation Fee</span>
                <span className="font-medium">12.5%</span>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs">
                Keep your health factor above 1.1 to avoid liquidation
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanCreationForm;
