
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/calculator";

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

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle>Side-by-Side Comparison</CardTitle>
        <CardDescription>Compare all repayment scenarios at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px]">Metric</TableHead>
                <TableHead className="bg-red-50 dark:bg-red-950/20">Scenario 1:<br />Minimum Payment</TableHead>
                <TableHead className="bg-blue-50 dark:bg-blue-950/20">Scenario 2:<br />Fixed Payment Equal to Initial Minimum</TableHead>
                <TableHead className="bg-green-50 dark:bg-green-950/20">Scenario 3:<br />Fixed Custom Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Starting Balance</TableCell>
                <TableCell>{formatCurrency(balanceAmount, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(balanceAmount, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(balanceAmount, currencyCode)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monthly Payment</TableCell>
                <TableCell>Decreasing<br/>(Starts at {formatCurrency(initialMinimumPayment, currencyCode)})</TableCell>
                <TableCell>{formatCurrency(initialMinimumPayment, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(fixedAmount, currencyCode)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Time to Pay Off</TableCell>
                <TableCell>{formatTime(minimumPayments.length)}</TableCell>
                <TableCell>{formatTime(fixedMinimumPayments.length)}</TableCell>
                <TableCell>{formatTime(fixedCustomPayments.length)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Paid</TableCell>
                <TableCell>{formatCurrency(totalPaidMinimum, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(totalPaidFixedMinimum, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(totalPaidFixedCustom, currencyCode)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Interest</TableCell>
                <TableCell>{formatCurrency(totalInterestMinimum, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(totalInterestFixedMinimum, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(totalInterestFixedCustom, currencyCode)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Interest Savings vs. Minimum</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{formatCurrency(totalInterestMinimum - totalInterestFixedMinimum, currencyCode)}</TableCell>
                <TableCell>{formatCurrency(totalInterestMinimum - totalInterestFixedCustom, currencyCode)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">First 3 Payments</TableCell>
                <TableCell>
                  {minimumPayments.slice(0, 3).map((p, i) => (
                    <div key={i} className="py-1">Month {i+1}: {formatCurrency(p.payment, currencyCode)}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {fixedMinimumPayments.slice(0, 3).map((p, i) => (
                    <div key={i} className="py-1">Month {i+1}: {formatCurrency(p.payment, currencyCode)}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {fixedCustomPayments.slice(0, 3).map((p, i) => (
                    <div key={i} className="py-1">Month {i+1}: {formatCurrency(p.payment, currencyCode)}</div>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last 3 Payments</TableCell>
                <TableCell>
                  {minimumPayments.slice(-3).map((p, i) => (
                    <div key={i} className="py-1">Month {minimumPayments.length - 2 + i}: {formatCurrency(p.payment, currencyCode)}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {fixedMinimumPayments.slice(-3).map((p, i) => (
                    <div key={i} className="py-1">Month {fixedMinimumPayments.length - 2 + i}: {formatCurrency(p.payment, currencyCode)}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {fixedCustomPayments.slice(-3).map((p, i) => (
                    <div key={i} className="py-1">Month {fixedCustomPayments.length - 2 + i}: {formatCurrency(p.payment, currencyCode)}</div>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;
