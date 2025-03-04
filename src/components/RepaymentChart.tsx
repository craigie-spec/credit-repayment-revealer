
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/calculator";

interface RepaymentScenario {
  month: number;
  balance: number;
  payment: number;
  interest: number;
}

interface RepaymentChartProps {
  minimumPayments: RepaymentScenario[];
  fixedMinimumPayments: RepaymentScenario[];
  fixedCustomPayments: RepaymentScenario[];
  initialMinimumPayment: number;
  fixedAmount: number;
}

const RepaymentChart: React.FC<RepaymentChartProps> = ({
  minimumPayments,
  fixedMinimumPayments,
  fixedCustomPayments,
  initialMinimumPayment,
  fixedAmount,
}) => {
  const [activeTab, setActiveTab] = useState<string>("balance");

  // Find the maximum number of months across all scenarios
  const maxMonths = Math.max(
    minimumPayments.length,
    fixedMinimumPayments.length,
    fixedCustomPayments.length
  );

  // Generate data for the chart
  const chartData = Array.from({ length: maxMonths }, (_, i) => {
    const month = i + 1;
    
    const minimumPayment = minimumPayments[i] || { balance: 0, payment: 0, interest: 0 };
    const fixedMinimumPayment = fixedMinimumPayments[i] || { balance: 0, payment: 0, interest: 0 };
    const fixedCustomPayment = fixedCustomPayments[i] || { balance: 0, payment: 0, interest: 0 };
    
    // Calculate cumulative values
    const cumulativePaymentMinimum = minimumPayments
      .slice(0, i + 1)
      .reduce((sum, item) => sum + item.payment, 0);
      
    const cumulativePaymentFixedMinimum = fixedMinimumPayments
      .slice(0, i + 1)
      .reduce((sum, item) => sum + item.payment, 0);
      
    const cumulativePaymentFixedCustom = fixedCustomPayments
      .slice(0, i + 1)
      .reduce((sum, item) => sum + item.payment, 0);
      
    const cumulativeInterestMinimum = minimumPayments
      .slice(0, i + 1)
      .reduce((sum, item) => sum + item.interest, 0);
      
    const cumulativeInterestFixedMinimum = fixedMinimumPayments
      .slice(0, i + 1)
      .reduce((sum, item) => sum + item.interest, 0);
      
    const cumulativeInterestFixedCustom = fixedCustomPayments
      .slice(0, i + 1)
      .reduce((sum, item) => sum + item.interest, 0);

    return {
      month,
      // Balance values
      balanceMinimum: minimumPayment.balance,
      balanceFixedMinimum: fixedMinimumPayment.balance,
      balanceFixedCustom: fixedCustomPayment.balance,
      // Payment values
      paymentMinimum: minimumPayment.payment,
      paymentFixedMinimum: fixedMinimumPayment.payment,
      paymentFixedCustom: fixedCustomPayment.payment,
      // Interest values for this month
      interestMinimum: minimumPayment.interest,
      interestFixedMinimum: fixedMinimumPayment.interest,
      interestFixedCustom: fixedCustomPayment.interest,
      // Cumulative payments
      cumulativePaymentMinimum,
      cumulativePaymentFixedMinimum,
      cumulativePaymentFixedCustom,
      // Cumulative interest
      cumulativeInterestMinimum,
      cumulativeInterestFixedMinimum,
      cumulativeInterestFixedCustom,
    };
  });

  // Custom tooltip formatter
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-medium">Month {label}</p>
          <div className="space-y-2 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-sm">
                  {entry.name}: {formatTooltipValue(entry.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Determine which data to show based on active tab
  const getChartLines = () => {
    switch (activeTab) {
      case "balance":
        return (
          <>
            <Line
              type="monotone"
              dataKey="balanceMinimum"
              name="Minimum Payment"
              stroke="#FF5A5A"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="balanceFixedMinimum"
              name={`Fixed (${formatCurrency(initialMinimumPayment)})`}
              stroke="#5A9AFF"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="balanceFixedCustom"
              name={`Fixed (${formatCurrency(fixedAmount)})`}
              stroke="#5AFF8F"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </>
        );
      
      case "payment":
        return (
          <>
            <Line
              type="monotone"
              dataKey="paymentMinimum"
              name="Minimum Payment"
              stroke="#FF5A5A"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="paymentFixedMinimum"
              name={`Fixed (${formatCurrency(initialMinimumPayment)})`}
              stroke="#5A9AFF"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="paymentFixedCustom"
              name={`Fixed (${formatCurrency(fixedAmount)})`}
              stroke="#5AFF8F"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </>
        );
      
      case "interest":
        return (
          <>
            <Line
              type="monotone"
              dataKey="interestMinimum"
              name="Minimum Payment"
              stroke="#FF5A5A"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="interestFixedMinimum"
              name={`Fixed (${formatCurrency(initialMinimumPayment)})`}
              stroke="#5A9AFF"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="interestFixedCustom"
              name={`Fixed (${formatCurrency(fixedAmount)})`}
              stroke="#5AFF8F"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </>
        );
      
      case "cumulative-payment":
        return (
          <>
            <Line
              type="monotone"
              dataKey="cumulativePaymentMinimum"
              name="Minimum Payment"
              stroke="#FF5A5A"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="cumulativePaymentFixedMinimum"
              name={`Fixed (${formatCurrency(initialMinimumPayment)})`}
              stroke="#5A9AFF"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="cumulativePaymentFixedCustom"
              name={`Fixed (${formatCurrency(fixedAmount)})`}
              stroke="#5AFF8F"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </>
        );
      
      case "cumulative-interest":
        return (
          <>
            <Line
              type="monotone"
              dataKey="cumulativeInterestMinimum"
              name="Minimum Payment"
              stroke="#FF5A5A"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="cumulativeInterestFixedMinimum"
              name={`Fixed (${formatCurrency(initialMinimumPayment)})`}
              stroke="#5A9AFF"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="cumulativeInterestFixedCustom"
              name={`Fixed (${formatCurrency(fixedAmount)})`}
              stroke="#5AFF8F"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  // Get the appropriate title based on active tab
  const getChartTitle = () => {
    switch (activeTab) {
      case "balance": return "Balance Over Time";
      case "payment": return "Monthly Payment Amount";
      case "interest": return "Monthly Interest Amount";
      case "cumulative-payment": return "Cumulative Payments";
      case "cumulative-interest": return "Cumulative Interest Paid";
      default: return "Chart";
    }
  };

  const getYAxisLabel = () => {
    switch (activeTab) {
      case "balance": return "Remaining Balance";
      case "payment": return "Payment Amount";
      case "interest": return "Interest Amount";
      case "cumulative-payment": return "Total Paid";
      case "cumulative-interest": return "Total Interest";
      default: return "";
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle>{getChartTitle()}</CardTitle>
        <CardDescription>Compare the three repayment scenarios</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="balance" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="interest">Interest</TabsTrigger>
            <TabsTrigger value="cumulative-payment">Total Paid</TabsTrigger>
            <TabsTrigger value="cumulative-interest">Total Interest</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  label={{ 
                    value: 'Months', 
                    position: 'insideBottomRight', 
                    offset: -5 
                  }}
                />
                <YAxis 
                  tickFormatter={formatTooltipValue}
                  label={{ 
                    value: getYAxisLabel(), 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {getChartLines()}
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RepaymentChart;
