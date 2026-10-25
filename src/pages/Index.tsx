
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Shield, Clock, Plus, Wallet, BarChart3, AlertTriangle } from "lucide-react";
import LoanCreationForm from "@/components/LoanCreationForm";
import ActiveLoans from "@/components/ActiveLoans";
import Portfolio from "@/components/Portfolio";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for demonstration
  const totalBorrowed = 125000;
  const totalCollateral = 200000;
  const activeLoansCount = 3;
  const creditScore = 750;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">DeFi Loans</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Secured
              </Badge>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Loan</span>
            </TabsTrigger>
            <TabsTrigger value="loans" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Active Loans</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Portfolio</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Borrowed</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">${totalBorrowed.toLocaleString()}</div>
                  <p className="text-xs text-blue-600 mt-1">+2.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Total Collateral</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">${totalCollateral.toLocaleString()}</div>
                  <p className="text-xs text-green-600 mt-1">160% collateral ratio</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Active Loans</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{activeLoansCount}</div>
                  <p className="text-xs text-purple-600 mt-1">2 due this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">Credit Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">{creditScore}</div>
                  <p className="text-xs text-orange-600 mt-1">Excellent rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Health Factor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span>Loan Health Factor</span>
                </CardTitle>
                <CardDescription>
                  Your collateralization ratio and loan safety metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Health Factor</span>
                    <span className="font-medium text-green-600">1.85 (Safe)</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Liquidation Price:</span>
                    <div className="font-medium">$1,250 ETH</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available to Borrow:</span>
                    <div className="font-medium">$35,000</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your loans and collateral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto flex-col py-4 space-y-2">
                    <Plus className="w-6 h-6" />
                    <span>New Loan</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4 space-y-2">
                    <DollarSign className="w-6 h-6" />
                    <span>Repay</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4 space-y-2">
                    <Shield className="w-6 h-6" />
                    <span>Add Collateral</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4 space-y-2">
                    <TrendingUp className="w-6 h-6" />
                    <span>Withdraw</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <LoanCreationForm />
          </TabsContent>

          <TabsContent value="loans">
            <ActiveLoans />
          </TabsContent>

          <TabsContent value="portfolio">
            <Portfolio />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
