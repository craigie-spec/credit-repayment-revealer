
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/calculator";

interface ResultsSummaryProps {
  balance: number;
  totalPaidMinimum: number;
  totalPaidFixedMinimum: number;
  totalPaidFixedCustom: number;
  timeToPayMinimum: number;
  timeToPayFixedMinimum: number;
  timeToPayFixedCustom: number;
  initialMinimumPayment: number;
  fixedAmount: number;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  balance,
  totalPaidMinimum,
  totalPaidFixedMinimum,
  totalPaidFixedCustom,
  timeToPayMinimum,
  timeToPayFixedMinimum,
  timeToPayFixedCustom,
  initialMinimumPayment,
  fixedAmount,
}) => {
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

  const calculateInterestPaid = (totalPaid: number): number => {
    return totalPaid - balance;
  };

  const SummaryCard = ({ 
    title, 
    description, 
    totalPaid, 
    timeToPay, 
    payment,
    colorClass,
    animationDelay
  }: { 
    title: string;
    description: string;
    totalPaid: number;
    timeToPay: number;
    payment: string;
    colorClass: string;
    animationDelay: string;
  }) => (
    <Card className={`shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${colorClass} animate-slide-up ${animationDelay}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Monthly Payment</p>
          <p className="text-2xl font-semibold">{payment}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Time to Pay Off</p>
          <p className="text-2xl font-semibold">{formatTime(timeToPay)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-2xl font-semibold">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Interest Paid</p>
          <p className="text-2xl font-semibold">{formatCurrency(calculateInterestPaid(totalPaid))}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-center animate-fade-in">Payment Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Scenario 1"
          description="Minimum Payment Only"
          totalPaid={totalPaidMinimum}
          timeToPay={timeToPayMinimum}
          payment="Decreasing"
          colorClass="border-scenario1"
          animationDelay="animate-delay-100"
        />
        <SummaryCard
          title="Scenario 2"
          description={`Fixed Payment (${formatCurrency(initialMinimumPayment)})`}
          totalPaid={totalPaidFixedMinimum}
          timeToPay={timeToPayFixedMinimum}
          payment={formatCurrency(initialMinimumPayment)}
          colorClass="border-scenario2"
          animationDelay="animate-delay-200"
        />
        <SummaryCard
          title="Scenario 3"
          description="Custom Fixed Payment"
          totalPaid={totalPaidFixedCustom}
          timeToPay={timeToPayFixedCustom}
          payment={formatCurrency(fixedAmount)}
          colorClass="border-scenario3"
          animationDelay="animate-delay-300"
        />
      </div>
    </div>
  );
};

export default ResultsSummary;
