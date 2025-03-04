
import React, { useState } from "react";
import CreditCardForm from "@/components/CreditCardForm";
import RepaymentChart from "@/components/RepaymentChart";
import RepaymentTable from "@/components/RepaymentTable";
import ResultsSummary from "@/components/ResultsSummary";
import { calculateRepaymentScenarios, CalculationResult } from "@/utils/calculator";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";

const Index = () => {
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [formValues, setFormValues] = useState({
    balance: 0,
    apr: 0,
    minimumPercentage: 0,
    fixedAmount: 0,
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (values: {
    balance: number;
    apr: number;
    minimumPercentage: number;
    fixedAmount: number;
  }) => {
    setIsCalculating(true);
    
    // Simulate a delay to show the loading state
    setTimeout(() => {
      const result = calculateRepaymentScenarios(
        values.balance,
        values.apr,
        values.minimumPercentage,
        values.fixedAmount
      );
      
      setCalculationResult(result);
      setFormValues(values);
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container flex items-center justify-center h-16 px-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-medium">Credit Card Minimum Repayment Danger Calculator</h1>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-8 space-y-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <CreditCardForm
              onCalculate={handleCalculate}
              initialMinimumPayment={calculationResult?.initialMinimumPayment ?? null}
              isLoading={isCalculating}
            />
          </div>
          
          <div className="md:col-span-8 space-y-8">
            {calculationResult ? (
              <ResultsSummary
                balance={formValues.balance}
                totalPaidMinimum={calculationResult.totalPaidMinimum}
                totalPaidFixedMinimum={calculationResult.totalPaidFixedMinimum}
                totalPaidFixedCustom={calculationResult.totalPaidFixedCustom}
                timeToPayMinimum={calculationResult.timeToPayMinimum}
                timeToPayFixedMinimum={calculationResult.timeToPayFixedMinimum}
                timeToPayFixedCustom={calculationResult.timeToPayFixedCustom}
                initialMinimumPayment={calculationResult.initialMinimumPayment}
                fixedAmount={formValues.fixedAmount}
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-dashed animate-pulse">
                <div className="text-center p-4">
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Enter your credit card details
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Fill out the form to see a comparison of different repayment strategies
                    and understand the dangers of minimum payments.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {calculationResult && (
          <>
            <Separator className="my-8" />
            
            <div className="space-y-8">
              <RepaymentChart
                minimumPayments={calculationResult.minimumPayments}
                fixedMinimumPayments={calculationResult.fixedMinimumPayments}
                fixedCustomPayments={calculationResult.fixedCustomPayments}
                initialMinimumPayment={calculationResult.initialMinimumPayment}
                fixedAmount={formValues.fixedAmount}
              />
              
              <RepaymentTable
                minimumPayments={calculationResult.minimumPayments}
                fixedMinimumPayments={calculationResult.fixedMinimumPayments}
                fixedCustomPayments={calculationResult.fixedCustomPayments}
                initialMinimumPayment={calculationResult.initialMinimumPayment}
                fixedAmount={formValues.fixedAmount}
              />
            </div>
          </>
        )}
      </main>
      
      <footer className="border-t mt-8">
        <div className="container py-6 px-4 flex justify-center">
          <p className="text-sm text-muted-foreground">
            Credit Card Minimum Repayment Danger Calculator | For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
