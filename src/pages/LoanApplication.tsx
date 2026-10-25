import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, FileText, CheckCircle, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoanApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    income: null as File | null,
    identity: null as File | null
  });
  const [formData, setFormData] = useState({
    loanAmount: "",
    loanDuration: "",
    loanPurpose: "",
    description: "",
    monthlyIncome: "",
    employmentStatus: "",
    documents: {
      income: null,
      identity: null
    }
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const connectWallet = async () => {
    // Simulate wallet connection
    const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
    setWalletAddress(mockAddress);
    setIsWalletConnected(true);
    toast({
      title: "Wallet Connected",
      description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
    });
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsWalletConnected(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const handleFileUpload = (type: 'income' | 'identity', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: file
      }));
      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} has been uploaded`,
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Completed",
        description: `Moving to step ${currentStep + 1}`,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here's where borrower data would be saved to a database
    const borrowerData = {
      walletAddress,
      ...formData,
      uploadedFiles: {
        income: uploadedFiles.income?.name,
        identity: uploadedFiles.identity?.name
      },
      timestamp: new Date().toISOString(),
      applicationType: "loan_application",
      status: "submitted"
    };
    
    console.log("Borrower application data saved:", borrowerData);
    // In a real application, this would be sent to a backend API to save in database
    
    toast({
      title: "Application Submitted!",
      description: "Your loan application has been submitted to the blockchain. You'll receive updates via smart contract events.",
    });
    setTimeout(() => {
      navigate("/borrower-dashboard");
    }, 2000);
  };

  const renderStep1 = () => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <span>💰</span>
          <span>Loan Requirements</span>
        </CardTitle>
        <p className="text-purple-200">Tell us about your loan needs</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Connection */}
        <div className="space-y-2">
          <Label className="text-white">Wallet Connection</Label>
          {!isWalletConnected ? (
            <Button 
              onClick={connectWallet} 
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              <Button 
                onClick={disconnectWallet} 
                size="sm"
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
              >
                Disconnect
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Loan Amount (USD)</Label>
            <div className="relative">
              <Input
                placeholder="Enter amount"
                value={formData.loanAmount}
                onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300">$</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Loan Duration</Label>
            <Select value={formData.loanDuration} onValueChange={(value) => setFormData({...formData, loanDuration: value})}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="24">24 months</SelectItem>
                <SelectItem value="36">36 months</SelectItem>
                <SelectItem value="60">60 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Loan Purpose</Label>
          <Select value={formData.loanPurpose} onValueChange={(value) => setFormData({...formData, loanPurpose: value})}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business Expansion</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="real-estate">Real Estate</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Description</Label>
          <Textarea
            placeholder="Provide details about how you plan to use the loan"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 min-h-24"
          />
        </div>

        <Button 
          onClick={handleNext} 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          disabled={!isWalletConnected}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <span>💼</span>
          <span>Financial Information</span>
        </CardTitle>
        <p className="text-purple-200">Help us assess your creditworthiness</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Monthly Income (USD)</Label>
            <div className="relative">
              <Input
                placeholder="Enter monthly income"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300">$</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Employment Status</Label>
            <Select value={formData.employmentStatus} onValueChange={(value) => setFormData({...formData, employmentStatus: value})}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self-employed">Self-employed</SelectItem>
                <SelectItem value="business-owner">Business Owner</SelectItem>
                <SelectItem value="freelancer">Freelancer</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-white">Document Upload</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-purple-200 text-sm">Income Verification</Label>
              <div className="relative">
                <input
                  type="file"
                  id="income-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload('income', e)}
                />
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-white/5 hover:bg-white/10">
                  <Upload className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                  <div className="text-white font-medium">Upload Income Document</div>
                  <div className="text-purple-300 text-sm">Pay stubs or tax returns</div>
                  {uploadedFiles.income && (
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">{uploadedFiles.income.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-purple-200 text-sm">Identity Verification</Label>
              <div className="relative">
                <input
                  type="file"
                  id="identity-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload('identity', e)}
                />
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-white/5 hover:bg-white/10">
                  <Upload className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                  <div className="text-white font-medium">Upload ID Document</div>
                  <div className="text-purple-300 text-sm">Government ID or passport</div>
                  {uploadedFiles.identity && (
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">{uploadedFiles.identity.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleBack} className="flex-1 bg-white/10 text-white hover:bg-white/20">
            Back
          </Button>
          <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <span>✅</span>
          <span>Review Application</span>
        </CardTitle>
        <p className="text-purple-200">Review your application before submitting to the blockchain</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Address Display */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Wallet Address</span>
            <span className="text-white font-mono text-sm">{walletAddress}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-purple-200">Loan Amount</span>
              <span className="text-white font-medium">${formData.loanAmount || "25000"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Duration</span>
              <span className="text-white font-medium">{formData.loanDuration || "12"} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Purpose</span>
              <Badge className="bg-purple-500/20 text-purple-300">
                {formData.loanPurpose || "business"}
              </Badge>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-purple-200">Monthly Income</span>
              <span className="text-white font-medium">${formData.monthlyIncome || "5000"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Employment</span>
              <span className="text-white font-medium">{formData.employmentStatus || "employed"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Estimated APR</span>
              <span className="text-white font-medium">8.5% - 12.5%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-white">Uploaded Documents</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <FileText className="w-5 h-5 text-purple-300" />
              <div className="flex-1">
                <div className="text-white font-medium">Income Verification</div>
                <div className="text-purple-300 text-sm">{uploadedFiles.income?.name || "No file uploaded"}</div>
              </div>
              {uploadedFiles.income && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <FileText className="w-5 h-5 text-purple-300" />
              <div className="flex-1">
                <div className="text-white font-medium">Identity Verification</div>
                <div className="text-purple-300 text-sm">{uploadedFiles.identity?.name || "No file uploaded"}</div>
              </div>
              {uploadedFiles.identity && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
          </div>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-white font-medium mb-2">Smart Contract Terms</div>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• Loan will be deployed as an Ethereum smart contract</li>
              <li>• Interest rates determined by algorithmic pricing</li>
              <li>• Automatic payment processing via blockchain</li>
              <li>• Transparent and immutable loan history</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button onClick={handleBack} className="flex-1 bg-white/10 text-white hover:bg-white/20">
            Back
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            Submit Application
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-white hover:text-purple-200 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Loan Application</h1>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-medium">Application Progress</span>
              <span className="text-purple-300">{currentStep}/3</span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2 mb-4" />
            <div className="flex justify-between text-sm">
              <span className={currentStep >= 1 ? "text-white" : "text-purple-400"}>Basic Information</span>
              <span className={currentStep >= 2 ? "text-white" : "text-purple-400"}>Financial Details</span>
              <span className={currentStep >= 3 ? "text-white" : "text-purple-400"}>Review & Submit</span>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default LoanApplication;
