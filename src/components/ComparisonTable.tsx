
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/calculator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RepaymentScenario {
  month: number;
  balance: number;
  payment: number;
  interest: number;
}

interface ComparisonTableProps {
  minimumPayments: RepaymentScenario[];
  fixedMinimumPayments: RepaymentScenario[];
  fixedCustomPayments: RepaymentScenario[];
  initialMinimumPayment: number;
  fixedAmount: number;
  currencyCode: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  minimumPayments,
  fixedMinimumPayments,
  fixedCustomPayments,
  initialMinimumPayment,
  fixedAmount,
  currencyCode,
}) => {
  const [displayRange, setDisplayRange] = useState<string>("all");
  
  // Format time helper function
  const formatTime = (months: number): string => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  // Helper function to get the correct range of months
  const getMonthsToShow = (): number[] => {
    const longestScenario = Math.max(
      minimumPayments.length,
      fixedMinimumPayments.length,
      fixedCustomPayments.length
    );
    
    switch (displayRange) {
      case "first12":
        return Array.from({ length: Math.min(12, longestScenario) }, (_, i) => i + 1);
      case "first24":
        return Array.from({ length: Math.min(24, longestScenario) }, (_, i) => i + 1);
      case "first60":
        return Array.from({ length: Math.min(60, longestScenario) }, (_, i) => i + 1);
      case "last12":
        return Array.from(
          { length: Math.min(12, longestScenario) }, 
          (_, i) => Math.max(1, longestScenario - 11 + i)
        );
      case "all":
        return Array.from({ length: longestScenario }, (_, i) => i + 1);
      default:
        return Array.from({ length: Math.min(12, longestScenario) }, (_, i) => i + 1);
    }
  };

  // Calculate total paid and interest
  const totalPaidMinimum = minimumPayments.reduce((sum, item) => sum + item.payment, 0);
  const totalPaidFixedMinimum = fixedMinimumPayments.reduce((sum, item) => sum + item.payment, 0);
  const totalPaidFixedCustom = fixedCustomPayments.reduce((sum, item) => sum + item.payment, 0);
  
  const totalInterestMinimum = minimumPayments.reduce((sum, item) => sum + item.interest, 0);
  const totalInterestFixedMinimum = fixedMinimumPayments.reduce((sum, item) => sum + item.interest, 0);
  const totalInterestFixedCustom = fixedCustomPayments.reduce((sum, item) => sum + item.interest, 0);

  // Get the balance amount
  const balanceAmount = minimumPayments.length > 0 ? 
    minimumPayments[0].balance + minimumPayments[0].payment - minimumPayments[0].interest : 0;

  // Helper function to get scenario data for a specific month
  const getScenarioDataForMonth = (
    scenarios: RepaymentScenario[],
    month: number
  ): RepaymentScenario | null => {
    return scenarios.find(s => s.month === month) || null;
  };

  const monthsToShow = getMonthsToShow();

  // Create chart data
  const prepareChartData = () => {
    return monthsToShow.map(month => {
      const minData = getScenarioDataForMonth(minimumPayments, month);
      const fixedMinData = getScenarioDataForMonth(fixedMinimumPayments, month);
      const fixedCustomData = getScenarioDataForMonth(fixedCustomPayments, month);

      return {
        month,
        "Minimum Payment": minData ? minData.balance : 0,
        "Fixed Initial Minimum": fixedMinData ? fixedMinData.balance : 0,
        "Fixed Custom Amount": fixedCustomData ? fixedCustomData.balance : 0,
      };
    });
  };

  const chartData = prepareChartData();

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Side-by-Side Comparison</CardTitle>
          <CardDescription>Compare all repayment scenarios month by month</CardDescription>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Select 
            value={displayRange} 
            onValueChange={setDisplayRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Show months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first12">First 12 months</SelectItem>
              <SelectItem value="first24">First 24 months</SelectItem>
              <SelectItem value="first60">First 60 months</SelectItem>
              <SelectItem value="last12">Last 12 months</SelectItem>
              <SelectItem value="all">All months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Line chart showing all three scenarios */}
        <div className="mb-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                label={{ 
                  value: 'Month', 
                  position: 'insideBottomRight', 
                  offset: -5 
                }} 
              />
              <YAxis 
                label={{ 
                  value: 'Balance', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                  offset: -20
                }}
                tickFormatter={(value) => formatCurrency(value, currencyCode).replace(/[^\d.,]/g, '')}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value), currencyCode), 'Balance']}
                labelFormatter={(value) => `Month ${value}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Minimum Payment" 
                stroke="#ef4444" // Red
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="Fixed Initial Minimum" 
                stroke="#eab308" // Yellow
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="Fixed Custom Amount" 
                stroke="#3b82f6" // Blue
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead colSpan={3} className="text-center bg-red-50 dark:bg-red-950/20">
                  Scenario 1: Minimum Payment
                </TableHead>
                <TableHead colSpan={3} className="text-center bg-yellow-50 dark:bg-yellow-950/20">
                  Scenario 2: Fixed Payment Equal to Initial Minimum
                </TableHead>
                <TableHead colSpan={3} className="text-center bg-blue-50 dark:bg-blue-950/20">
                  Scenario 3: Fixed Custom Payment
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="w-[80px]"></TableHead>
                
                <TableHead className="bg-red-50/70 dark:bg-red-950/10">Payment</TableHead>
                <TableHead className="bg-red-50/70 dark:bg-red-950/10">Interest</TableHead>
                <TableHead className="bg-red-50/70 dark:bg-red-950/10">Balance</TableHead>
                
                <TableHead className="bg-yellow-50/70 dark:bg-yellow-950/10">Payment</TableHead>
                <TableHead className="bg-yellow-50/70 dark:bg-yellow-950/10">Interest</TableHead>
                <TableHead className="bg-yellow-50/70 dark:bg-yellow-950/10">Balance</TableHead>
                
                <TableHead className="bg-blue-50/70 dark:bg-blue-950/10">Payment</TableHead>
                <TableHead className="bg-blue-50/70 dark:bg-blue-950/10">Interest</TableHead>
                <TableHead className="bg-blue-50/70 dark:bg-blue-950/10">Balance</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {/* Summary Row */}
              <TableRow className="bg-muted/30 font-medium">
                <TableCell>Summary</TableCell>
                
                <TableCell>{formatCurrency(totalPaidMinimum, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(totalInterestMinimum, currencyCode)}</TableCell>
                <TableCell>{formatTime(minimumPayments.length)}</TableCell>
                
                <TableCell>{formatCurrency(totalPaidFixedMinimum, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(totalInterestFixedMinimum, currencyCode)}</TableCell>
                <TableCell>{formatTime(fixedMinimumPayments.length)}</TableCell>
                
                <TableCell>{formatCurrency(totalPaidFixedCustom, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(totalInterestFixedCustom, currencyCode)}</TableCell>
                <TableCell>{formatTime(fixedCustomPayments.length)}</TableCell>
              </TableRow>

              {/* Monthly data rows */}
              {monthsToShow.map(month => {
                const minData = getScenarioDataForMonth(minimumPayments, month);
                const fixedMinData = getScenarioDataForMonth(fixedMinimumPayments, month);
                const fixedCustomData = getScenarioDataForMonth(fixedCustomPayments, month);

                return (
                  <TableRow key={month}>
                    <TableCell className="font-medium">{month}</TableCell>
                    
                    {/* Scenario 1 data */}
                    <TableCell>
                      {minData ? formatCurrency(minData.payment, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                    <TableCell>
                      {minData ? formatCurrency(minData.interest, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                    <TableCell>
                      {minData ? formatCurrency(minData.balance, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                    
                    {/* Scenario 2 data */}
                    <TableCell>
                      {fixedMinData ? formatCurrency(fixedMinData.payment, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                    <TableCell>
                      {fixedMinData ? formatCurrency(fixedMinData.interest, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                    <TableCell>
                      {fixedMinData ? formatCurrency(fixedMinData.balance, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                    
                    {/* Scenario 3 data */}
                    <TableCell>
                      {fixedCustomData ? formatCurrency(fixedCustomData.payment, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                    <TableCell>
                      {fixedCustomData ? formatCurrency(fixedCustomData.interest, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                    <TableCell>
                      {fixedCustomData ? formatCurrency(fixedCustomData.balance, currencyCode) : formatCurrency(0, currencyCode)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;
