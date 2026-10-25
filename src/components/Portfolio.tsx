import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Shield,
  AlertCircle,
  Target
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const Portfolio = () => {
  // Mock portfolio data
  const portfolioValue = 187500;
  const totalBorrowed = 90000;
  const totalCollateral = 165000;
  const availableCredit = 45000;
  const monthlyReturn = 2.4;

  // Chart data
  const performanceData = [
    { month: 'Jan', value: 160000, borrowed: 75000 },
    { month: 'Feb', value: 165000, borrowed: 80000 },
    { month: 'Mar', value: 172000, borrowed: 85000 },
    { month: 'Apr', value: 178000, borrowed: 88000 },
    { month: 'May', value: 175000, borrowed: 92000 },
    { month: 'Jun', value: 187500, borrowed: 90000 }
  ];

  const assetAllocation = [
    { name: 'ETH', value: 45, color: '#3B82F6' },
    { name: 'BTC', value: 30, color: '#F59E0B' },
    { name: 'USDC', value: 15, color: '#10B981' },
    { name: 'Other', value: 10, color: '#8B5CF6' }
  ];

  const riskMetrics = [
    { label: 'Portfolio Health', value: 85, status: 'good' },
    { label: 'Diversification', value: 72, status: 'good' },
    { label: 'Liquidity Risk', value: 28, status: 'good' },
    { label: 'Concentration Risk', value: 45, status: 'warning' }
  ];

  const getProgressColor = (value: number, status: string) => {
    if (status === 'good') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Overview</h2>
          <p className="text-muted-foreground">Track your DeFi lending portfolio performance and risk metrics</p>
        </div>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <TrendingUp className="w-3 h-3 mr-1" />
          +{monthlyReturn}% This Month
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Portfolio Value</CardTitle>
            <PieChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">${portfolioValue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Total Borrowed</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">${totalBorrowed.toLocaleString()}</div>
            <div className="flex items-center text-xs text-purple-600 mt-1">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Collateral</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${totalCollateral.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-1">183% avg ratio</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Available Credit</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">${availableCredit.toLocaleString()}</div>
            <div className="text-xs text-orange-600 mt-1">Ready to borrow</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Portfolio Performance</span>
            </CardTitle>
            <CardDescription>Portfolio value and borrowed amount over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `$${value.toLocaleString()}`, 
                      name === 'value' ? 'Portfolio Value' : 'Total Borrowed'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.1}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="borrowed" 
                    stackId="2"
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-green-600" />
              <span>Asset Allocation</span>
            </CardTitle>
            <CardDescription>Distribution of collateral assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Allocation']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {assetAllocation.map((asset, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: asset.color }}
                  ></div>
                  <span className="text-sm">{asset.name}: {asset.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span>Risk Assessment</span>
            </CardTitle>
            <CardDescription>Portfolio risk metrics and health indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.label}</span>
                  <span className={`font-medium ${
                    metric.status === 'good' ? 'text-green-600' : 
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(metric.value, metric.status)}`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest portfolio transactions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'repayment', amount: 5000, asset: 'USDC', date: '2 hours ago', status: 'completed' },
              { type: 'collateral', amount: 2.5, asset: 'ETH', date: '1 day ago', status: 'completed' },
              { type: 'borrow', amount: 15000, asset: 'USDC', date: '3 days ago', status: 'completed' },
              { type: 'liquidation_warning', amount: 0, asset: 'BTC', date: '5 days ago', status: 'warning' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium capitalize">
                      {activity.type.replace('_', ' ')}
                      {activity.amount > 0 && ` - ${activity.amount} ${activity.asset}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
