import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, DollarSign, TrendingUp, Users, Eye, Wallet, Download, CreditCard, Lock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import LoanDetailsModal from "@/components/LoanDetailsModal";
import PaymentModal from "@/components/PaymentModal";
import WalletSelectionModal from "@/components/WalletSelectionModal";

const BorrowerDashboard = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const borrowerAuth = localStorage.getItem("borrowerAuth");
    if (!borrowerAuth) {
      navigate("/borrower-portal");
      return;
    }
    
    try {
      const authData = JSON.parse(borrowerAuth);
      if (!authData.isAuthenticated) {
        navigate("/borrower-portal");
        return;
      }
      setUser(authData);
      
      // Check if wallet was previously connected
      if (authData.walletAddress) {
        setWalletAddress(authData.walletAddress);
        setIsWalletConnected(true);
      }
    } catch (error) {
      navigate("/borrower-portal");
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
            const returnUrl = encodeURIComponent(window.location.origin + "/borrower-dashboard?wallet=keplr");
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
            const returnUrl = encodeURIComponent(window.location.origin + "/borrower-dashboard?wallet=rabby");
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
            const returnUrl = encodeURIComponent(window.location.origin + "/borrower-dashboard?wallet=phantom");
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
            const returnUrl = encodeURIComponent(window.location.origin + "/borrower-dashboard?wallet=backpack");
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
      
      const borrowerData = {
        ...user,
        walletAddress: address,
        walletType: walletType,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("borrowerAuth", JSON.stringify(borrowerData));
      console.log("Borrower wallet connected:", borrowerData);
      
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
    localStorage.setItem("borrowerAuth", JSON.stringify(updatedData));
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("borrowerAuth");
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

  const handleMakePayment = (loan: any) => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to make payments",
        variant: "destructive",
      });
      return;
    }
    console.log("Opening payment modal for loan:", loan.id);
    setSelectedLoan(loan);
    setIsPaymentModalOpen(true);
  };

  const handleDownloadContract = (loan: any) => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to download contracts",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Downloading contract for loan:", loan.id);
    
    // Create PDF
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Loan Agreement Contract', 20, 30);
    
    // Add loan details
    doc.setFontSize(12);
    doc.text(`Loan ID: ${loan.id}`, 20, 60);
    doc.text(`Amount: $${loan.amount?.toLocaleString() || 'N/A'}`, 20, 80);
    doc.text(`Purpose: ${loan.purpose || 'N/A'}`, 20, 100);
    doc.text(`Interest Rate: ${loan.rate || 'N/A'}`, 20, 120);
    doc.text(`Due Date: ${loan.dueDate || 'N/A'}`, 20, 140);
    doc.text(`Status: ${loan.status || 'N/A'}`, 20, 160);
    
    // Add borrower information
    doc.text('Borrower Information:', 20, 200);
    doc.text(`Email: ${user?.email || 'N/A'}`, 20, 220);
    doc.text(`Wallet Address: ${walletAddress || 'Not connected'}`, 20, 240);
    
    // Add terms and conditions
    doc.text('Terms and Conditions:', 20, 270);
    doc.text('This loan agreement is subject to the terms and conditions', 20, 290);
    doc.text('outlined in the platform\'s user agreement.', 20, 300);
    
    // Save the PDF
    doc.save(`loan-contract-${loan.id}.pdf`);
    
    toast({
      title: "Contract Downloaded",
      description: `Contract for loan ${loan.id} has been downloaded as PDF`,
    });
  };

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const stats = {
    totalBorrowed: 75000,
    activeLoans: 2,
    avgInterestRate: 7.5,
    walletBalance: 2500
  };

  const activeLoans = [
    {
      id: "LN004",
      amount: 50000,
      purpose: "Personal",
      rate: "15.5%",
      nextPayment: 2500,
      dueDate: "2024-08-15",
      totalPaid: 12500,
      remainingBalance: 37500,
      status: "Active"
    },
    {
      id: "LN005",
      amount: 25000,
      purpose: "Business",
      rate: "9.2%",
      nextPayment: 1250,
      dueDate: "2024-09-22",
      totalPaid: 6250,
      remainingBalance: 18750,
      status: "Pending"
    }
  ];

  const loanHistory = [
    {
      id: "LN001",
      amount: 25000,
      purpose: "Business Expansion",
      rate: "8.5%",
      dueDate: "2023-12-31",
      status: "Completed"
    },
    {
      id: "LN002",
      amount: 15000,
      purpose: "Education",
      rate: "12.0%",
      dueDate: "2024-01-15",
      status: "Defaulted"
    },
    {
      id: "LN003",
      amount: 50000,
      purpose: "Real Estate",
      rate: "6.5%",
      dueDate: "2024-02-28",
      status: "Completed"
    }
  ];

  const analyticsData = {
    paymentHistory: [
      { date: "2024-05-01", amount: 2500 },
      { date: "2024-06-01", amount: 2500 },
      { date: "2024-07-01", amount: 2500 }
    ],
    loanPerformance: {
      onTimePayments: 85,
      latePayments: 10,
      defaulted: 5
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 bg-blue-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-white hover:text-blue-200 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">Borrower Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user.email} (borrower)</span>
            {isWalletConnected && (
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
            <Link to="/lender-portal">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Lender Portal
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
            <Card className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">${stats.totalBorrowed.toLocaleString()}</div>
                    <div className="text-blue-300 text-sm">Total Borrowed</div>
                    <div className="text-green-400 text-xs">+8.2%</div>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.activeLoans}</div>
                    <div className="text-blue-300 text-sm">Active Loans</div>
                    <div className="text-green-400 text-xs">+1</div>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.avgInterestRate}%</div>
                    <div className="text-blue-300 text-sm">Avg. Interest Rate</div>
                    <div className="text-red-400 text-xs">-0.3%</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">${stats.walletBalance.toLocaleString()}</div>
                    <div className="text-blue-300 text-sm">Wallet Balance</div>
                    <div className="text-green-400 text-xs">+5.1%</div>
                  </div>
                  <Wallet className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30 mb-8">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-blue-300 mb-4">
                Please connect your wallet to view your dashboard statistics and loan details.
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

        {/* Apply for New Loan Section */}
        <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Need a New Loan?</h3>
                <p className="text-purple-200">
                  Apply for a new loan with competitive rates and flexible terms.
                </p>
              </div>
              <Link to="/loan-application">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Apply for New Loan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={activeTab === "active" ? "default" : "ghost"}
            className={activeTab === "active" ? "bg-blue-500 text-white" : "text-white hover:bg-white/10"}
            onClick={() => setActiveTab("active")}
          >
            Active Loans
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            className={activeTab === "history" ? "bg-blue-500 text-white" : "text-white hover:bg-white/10"}
            onClick={() => setActiveTab("history")}
          >
            Loan History
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            className={activeTab === "analytics" ? "bg-blue-500 text-white" : "text-white hover:bg-white/10"}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </Button>
        </div>

        {/* Active Loans */}
        {activeTab === "active" && (
          <div className="space-y-6">
            {activeLoans.map((loan) => (
              <Card key={loan.id} className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-white font-medium text-lg">Loan {loan.id}</div>
                        <Badge className="bg-blue-500/20 text-blue-300">{loan.purpose}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${loan.amount?.toLocaleString()}</div>
                        <div className="text-blue-300 text-sm">at {loan.rate}</div>
                      </div>
                    </div>
                    <Badge className={
                      loan.status === "Active" ? "bg-green-500/20 text-green-400" :
                      loan.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }>
                      {loan.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-blue-300">Next Payment</div>
                      <div className="text-white font-medium">${loan.nextPayment?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-blue-300">Due Date</div>
                      <div className="text-white font-medium">{loan.dueDate}</div>
                    </div>
                    <div>
                      <div className="text-blue-300">Total Paid</div>
                      <div className="text-white font-medium">${loan.totalPaid?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-blue-300">Remaining</div>
                      <div className="text-white font-medium">${loan.remainingBalance?.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-300">Payment Progress</span>
                      <span className="text-white">
                        {loan.totalPaid && loan.amount ? 
                          Math.round((loan.totalPaid / loan.amount) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={loan.totalPaid && loan.amount ? 
                        (loan.totalPaid / loan.amount) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleViewDetails(loan)}
                      size="sm" 
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      {!isWalletConnected ? <Lock className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      View Details
                    </Button>
                    <Button 
                      onClick={() => handleMakePayment(loan)}
                      size="sm" 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {!isWalletConnected ? <Lock className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      Make Payment
                    </Button>
                    <Button 
                      onClick={() => handleDownloadContract(loan)}
                      size="sm" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {!isWalletConnected ? <Lock className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                      Download Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loan History */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {loanHistory.map((loan) => (
              <Card key={loan.id} className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-white font-medium text-lg">Loan {loan.id}</div>
                        <Badge className="bg-blue-500/20 text-blue-300">{loan.purpose}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${loan.amount?.toLocaleString()}</div>
                        <div className="text-blue-300 text-sm">at {loan.rate}</div>
                      </div>
                    </div>
                    <Badge className={
                      loan.status === "Completed" ? "bg-green-500/20 text-green-400" :
                      loan.status === "Defaulted" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }>
                      {loan.status}
                    </Badge>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleViewDetails(loan)}
                      size="sm" 
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      {!isWalletConnected ? <Lock className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
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
            <Card className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Payment History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.paymentHistory.map((payment) => (
                  <div key={payment.date} className="flex justify-between">
                    <span className="text-blue-300">{payment.date}</span>
                    <span className="text-white font-medium">${payment.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-800/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Loan Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-blue-300">On-Time Payments</span>
                  <span className="text-green-400 font-medium">{analyticsData.loanPerformance.onTimePayments}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Late Payments</span>
                  <span className="text-yellow-400 font-medium">{analyticsData.loanPerformance.latePayments}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Defaulted Loans</span>
                  <span className="text-red-400 font-medium">{analyticsData.loanPerformance.defaulted}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <LoanDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        loan={selectedLoan}
        showInvestButton={false}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        loan={selectedLoan}
      />

      <WalletSelectionModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={connectWallet}
      />
    </div>
  );
};

export default BorrowerDashboard;
