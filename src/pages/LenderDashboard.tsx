import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, DollarSign, TrendingUp, Clock, Users, Eye, Wallet, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoanDetailsModal from "@/components/LoanDetailsModal";
import InvestmentModal from "@/components/InvestmentModal";
import WalletSelectionModal from "@/components/WalletSelectionModal";

const LenderDashboard = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(15420);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const lenderAuth = localStorage.getItem("lenderAuth");
    if (!lenderAuth) {
      navigate("/lender-portal");
      return;
    }
    
    try {
      const authData = JSON.parse(lenderAuth);
      if (!authData.isAuthenticated) {
        navigate("/lender-portal");
        return;
      }
      setUser(authData);
      
      // Check if wallet was previously connected
      if (authData.walletAddress) {
        setWalletAddress(authData.walletAddress);
        setIsWalletConnected(true);
      }
    } catch (error) {
      navigate("/lender-portal");
    }
  }, [navigate]);

  const connectWallet = async (walletType?: string) => {
    try {
      let address;
      let redirectUrl;
      
      switch (walletType) {
        case "keplr":
          redirectUrl = "https://wallet.keplr.app/";
          if (typeof window !== 'undefined' && (window as any).keplr) {
            // If Keplr extension is available, try direct connection
            await (window as any).keplr.enable("cosmoshub-4");
            const accounts = await (window as any).keplr.getAccounts("cosmoshub-4");
            address = accounts[0]?.address;
          } else {
            // Redirect to Keplr website for login
            const returnUrl = encodeURIComponent(window.location.origin + "/lender-dashboard?wallet=keplr");
            window.location.href = `${redirectUrl}?return=${returnUrl}`;
            return;
          }
          break;
        case "rabby":
          redirectUrl = "https://rabby.io/";
          if (typeof window !== 'undefined' && (window as any).ethereum?.isRabby) {
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            address = accounts[0];
          } else {
            const returnUrl = encodeURIComponent(window.location.origin + "/lender-dashboard?wallet=rabby");
            window.location.href = `${redirectUrl}?return=${returnUrl}`;
            return;
          }
          break;
        case "phantom":
          redirectUrl = "https://phantom.app/";
          if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
            const response = await (window as any).solana.connect();
            address = response.publicKey.toString();
          } else {
            const returnUrl = encodeURIComponent(window.location.origin + "/lender-dashboard?wallet=phantom");
            window.location.href = `${redirectUrl}?return=${returnUrl}`;
            return;
          }
          break;
        case "backpack":
          redirectUrl = "https://www.backpack.app/";
          if (typeof window !== 'undefined' && (window as any).backpack) {
            const response = await (window as any).backpack.connect();
            address = response.publicKey.toString();
          } else {
            const returnUrl = encodeURIComponent(window.location.origin + "/lender-dashboard?wallet=backpack");
            window.location.href = `${redirectUrl}?return=${returnUrl}`;
            return;
          }
          break;
        default:
          // Fallback - generate mock address
          address = "0x" + Math.random().toString(16).substr(2, 40);
      }
      
      if (!address) {
        // Generate mock address if wallet connection failed
        address = "0x" + Math.random().toString(16).substr(2, 40);
        toast({
          title: "Simulated Connection",
          description: "Using demo address for development",
        });
      }
      
      setWalletAddress(address);
      setIsWalletConnected(true);
      setIsWalletModalOpen(false);
      
      const lenderData = {
        ...user,
        walletAddress: address,
        walletType: walletType,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("lenderAuth", JSON.stringify(lenderData));
      console.log("Lender wallet connected:", lenderData);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsWalletConnected(false);
    
    const updatedData = { ...user };
    delete updatedData.walletAddress;
    localStorage.setItem("lenderAuth", JSON.stringify(updatedData));
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("lenderAuth");
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const handleViewDetails = (loan: any) => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to view loan details",
        variant: "destructive",
      });
      return;
    }
    console.log("Opening loan details for:", loan);
    setSelectedLoan(loan);
    setIsDetailsModalOpen(true);
  };

  const handleInvestInLoan = (loanId: string) => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to invest in loans",
        variant: "destructive",
      });
      return;
    }
    
    const loan = availableLoans.find(l => l.id === loanId);
    if (loan) {
      setSelectedLoan(loan);
      setIsInvestmentModalOpen(true);
    }
  };

  const handleInvestmentComplete = (amount: number) => {
    setWalletBalance(prev => prev - amount);
    
    // Update user data with new wallet balance
    const updatedData = {
      ...user,
      walletAddress,
      walletBalance: walletBalance - amount
    };
    localStorage.setItem("lenderAuth", JSON.stringify(updatedData));
  };

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const stats = {
    totalInvested: 125000,
    activeLoans: 23,
    avgReturn: 9.2,
    walletBalance: walletBalance
  };

  const availableLoans = [
    {
      id: "LN001",
      amount: 25000,
      purpose: "Business Expansion",
      duration: "24 months",
      requestedRate: "8.5%",
      riskLevel: "Low Risk",
      fundingProgress: 60,
      description: "Expanding e-commerce business operations and inventory."
    },
    {
      id: "LN002",
      amount: 15000,
      purpose: "Education",
      duration: "36 months",
      requestedRate: "12.0%",
      riskLevel: "Medium Risk",
      fundingProgress: 25,
      description: "MBA program funding for career advancement."
    },
    {
      id: "LN003",
      amount: 50000,
      purpose: "Real Estate",
      duration: "60 months",
      requestedRate: "6.5%",
      riskLevel: "Low Risk",
      fundingProgress: 80,
      description: "Investment property down payment in growing market."
    }
  ];

  const portfolioLoans = [
    {
      id: "LN004",
      totalInvested: 10000,
      totalAmount: 5000,
      purpose: "Personal",
      rate: "15.5%",
      totalEarned: 720
    },
    {
      id: "LN005",
      totalInvested: 30000,
      totalAmount: 15000,
      purpose: "Business",
      rate: "9.2%",
      totalEarned: 1380
    }
  ];

  const riskDistribution = [
    { level: "Low Risk", percentage: 65, color: "bg-green-500" },
    { level: "Medium Risk", percentage: 30, color: "bg-yellow-500" },
    { level: "High Risk", percentage: 5, color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 bg-purple-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-white hover:text-purple-200 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">Lender Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user.email} (lender)</span>
            {isWalletConnected && (
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
            <Link to="/borrower-portal">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Borrower Portal
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-white/10">
              Logout
            </Button>
            {!isWalletConnected ? (
              <Button 
                onClick={openWalletModal}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <Button 
                onClick={disconnectWallet}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid - Only show if wallet is connected */}
        {isWalletConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">${stats.totalInvested.toLocaleString()}</div>
                    <div className="text-purple-300 text-sm">Total Invested</div>
                    <div className="text-green-400 text-xs">+12.5%</div>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.activeLoans}</div>
                    <div className="text-purple-300 text-sm">Active Loans</div>
                    <div className="text-green-400 text-xs">+3</div>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.avgReturn}%</div>
                    <div className="text-purple-300 text-sm">Avg. Return</div>
                    <div className="text-green-400 text-xs">+0.8%</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">${stats.walletBalance.toLocaleString()}</div>
                    <div className="text-purple-300 text-sm">Wallet Balance</div>
                    <div className="text-red-400 text-xs">-2.1%</div>
                  </div>
                  <Wallet className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30 mb-8">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-purple-300 mb-4">
                Please connect your wallet to view your dashboard statistics and portfolio details.
              </p>
              <Button 
                onClick={openWalletModal}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={activeTab === "available" ? "default" : "ghost"}
            className={activeTab === "available" ? "bg-purple-500 text-white" : "text-white hover:bg-white/10"}
            onClick={() => setActiveTab("available")}
          >
            Available Loans
          </Button>
          <Button
            variant={activeTab === "portfolio" ? "default" : "ghost"}
            className={activeTab === "portfolio" ? "bg-purple-500 text-white" : "text-white hover:bg-white/10"}
            onClick={() => setActiveTab("portfolio")}
          >
            My Portfolio
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            className={activeTab === "analytics" ? "bg-purple-500 text-white" : "text-white hover:bg-white/10"}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </Button>
        </div>

        {/* Available Loans */}
        {activeTab === "available" && (
          <div className="grid gap-6 md:grid-cols-3">
            {availableLoans.map((loan) => (
              <Card key={loan.id} className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-2xl">${loan.amount.toLocaleString()}</CardTitle>
                      <p className="text-purple-300">{loan.purpose}</p>
                    </div>
                    <Badge className={
                      loan.riskLevel === "Low Risk" ? "bg-green-500/20 text-green-400" :
                      loan.riskLevel === "Medium Risk" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }>
                      {loan.riskLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-purple-300">Duration</div>
                      <div className="text-white font-medium">{loan.duration}</div>
                    </div>
                    <div>
                      <div className="text-purple-300">Requested Rate</div>
                      <div className="text-white font-medium">{loan.requestedRate}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Funding Progress</span>
                      <span className="text-white">{loan.fundingProgress}%</span>
                    </div>
                    <Progress value={loan.fundingProgress} className="h-2" />
                  </div>

                  <p className="text-purple-200 text-sm">{loan.description}</p>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleViewDetails(loan)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      {!isWalletConnected ? <Lock className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      View Details
                    </Button>
                    <Button 
                      onClick={() => handleInvestInLoan(loan.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {!isWalletConnected ? <Lock className="w-4 h-4 mr-2" /> : <DollarSign className="w-4 h-4 mr-2" />}
                      Invest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Portfolio */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {portfolioLoans.map((loan) => (
              <Card key={loan.id} className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-white font-medium">Loan ID</div>
                        <div className="text-purple-300">{loan.id}</div>
                      </div>
                      <div>
                        <div className="text-white font-medium">Total / Invested</div>
                        <div className="text-purple-300">${loan.totalInvested.toLocaleString()} / ${loan.totalAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-white font-medium">Purpose</div>
                        <Badge className="bg-purple-500/20 text-purple-300">{loan.purpose}</Badge>
                      </div>
                      <div>
                        <div className="text-white font-medium">Rate</div>
                        <div className="text-purple-300">{loan.rate}</div>
                      </div>
                      <div>
                        <div className="text-white font-medium">Total Earned</div>
                        <div className="text-green-400">${loan.totalEarned}</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleViewDetails(loan)}
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-purple-300">Total ROI</span>
                  <span className="text-green-400 font-medium">+9.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Average Loan Duration</span>
                  <span className="text-white font-medium">28 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Default Rate</span>
                  <span className="text-red-400 font-medium">1.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Active Investments</span>
                  <span className="text-white font-medium">23</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-800/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskDistribution.map((risk) => (
                  <div key={risk.level} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-purple-300">{risk.level}</span>
                      <span className="text-white font-medium">{risk.percentage}%</span>
                    </div>
                    <div className="w-full bg-purple-900/50 rounded-full h-2">
                      <div 
                        className={`${risk.color} h-2 rounded-full`} 
                        style={{ width: `${risk.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <LoanDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        loan={selectedLoan}
        onInvest={handleInvestInLoan}
        showInvestButton={true}
      />

      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        loan={selectedLoan}
        walletBalance={walletBalance}
        onInvestmentComplete={handleInvestmentComplete}
      />

      <WalletSelectionModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={connectWallet}
      />
    </div>
  );
};

export default LenderDashboard;
