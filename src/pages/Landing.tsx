import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  ArrowRight
} from "lucide-react";

const Landing = () => {
  const [stats] = useState({
    totalLoans: "$2.4M",
    activeUsers: "1,247",
    successRate: "98.7%",
    avgProcessing: "4.2 min"
  });
  
  const navigate = useNavigate();

  const handleApplyForLoan = () => {
    navigate("/borrower-portal");
  };

  const handleLearnMore = () => {
    const element = document.getElementById("features-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const recentTransactions = [
    { amount: "$25,000", status: "Funded", apr: "8.5%", purpose: "Business Expansion" },
    { amount: "$15,000", status: "Active", apr: "12.0%", purpose: "Education" },
    { amount: "$50,000", status: "Funded", apr: "6.2%", purpose: "Real Estate" },
    { amount: "$8,000", status: "Pending", apr: "15.5%", purpose: "Personal" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable records powered by Ethereum smart contracts ensure complete transaction transparency."
    },
    {
      icon: Globe,
      title: "Cross-Border Access",
      description: "Connect globally with borrowers and lenders worldwide, breaking geographical barriers."
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Smart contracts automate loan processing, reducing wait times from days to minutes."
    },
    {
      icon: TrendingUp,
      title: "Dynamic Interest Rates",
      description: "Market-driven rates ensure fair pricing for both borrowers and lenders."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">DeLoan</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/lender-portal">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Lender Portal
              </Button>
            </Link>
            <Link to="/borrower-portal">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Borrower Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Decentralized Loan
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto">
            Secure, transparent, and efficient lending powered by blockchain technology. Connect directly with 
            global lenders and borrowers without intermediaries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleApplyForLoan}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Apply for Loan
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleLearnMore}
              className="text-black border-white bg-white hover:bg-gray-100 text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stats.totalLoans}</div>
                <div className="text-purple-200">Total Loans Issued</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stats.activeUsers}</div>
                <div className="text-purple-200">Active Users</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stats.successRate}</div>
                <div className="text-purple-200">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stats.avgProcessing}</div>
                <div className="text-purple-200">Avg. Processing</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features-section" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose <span className="text-purple-300">DeLoan?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-16 h-16 text-purple-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Live Loan Activity</h2>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="text-xl font-bold text-white">{transaction.amount}</div>
                      <Badge 
                        className={
                          transaction.status === "Funded" ? "bg-green-500/20 text-green-400" :
                          transaction.status === "Active" ? "bg-blue-500/20 text-blue-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{transaction.apr} APR</div>
                      <div className="text-purple-300 text-sm">{transaction.purpose}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Powered by Cutting-Edge Technology</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 text-purple-300">
            <div className="text-lg">Ethereum</div>
            <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
            <div className="text-lg">Solidity</div>
            <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
            <div className="text-lg">IPFS</div>
            <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
            <div className="text-lg">MetaMask</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
