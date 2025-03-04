
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, Percent } from "lucide-react";

interface CreditCardFormProps {
  onCalculate: (values: {
    balance: number;
    apr: number;
    minimumPercentage: number;
    fixedAmount: number;
  }) => void;
  initialMinimumPayment: number | null;
  isLoading: boolean;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ 
  onCalculate, 
  initialMinimumPayment,
  isLoading 
}) => {
  const [balance, setBalance] = useState<number>(5000);
  const [apr, setApr] = useState<number>(18.9);
  const [minimumPercentage, setMinimumPercentage] = useState<number>(2);
  const [fixedAmount, setFixedAmount] = useState<number>(200);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (balance <= 0) {
      toast({
        title: "Invalid balance",
        description: "Please enter a positive balance amount.",
        variant: "destructive"
      });
      return;
    }
    
    if (apr <= 0) {
      toast({
        title: "Invalid APR",
        description: "Please enter a positive APR percentage.",
        variant: "destructive"
      });
      return;
    }
    
    if (minimumPercentage <= 0) {
      toast({
        title: "Invalid minimum percentage",
        description: "Please enter a positive minimum repayment percentage.",
        variant: "destructive"
      });
      return;
    }
    
    if (fixedAmount <= 0) {
      toast({
        title: "Invalid fixed amount",
        description: "Please enter a positive fixed payment amount.",
        variant: "destructive"
      });
      return;
    }

    onCalculate({
      balance,
      apr,
      minimumPercentage,
      fixedAmount
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Enter Credit Card Details</CardTitle>
          <CardDescription>
            Compare different repayment strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="balance"
                type="number"
                min="0"
                step="100"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apr">Annual Percentage Rate (APR)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="apr"
                type="number"
                min="0"
                step="0.1"
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumPercentage">Minimum Repayment Percentage</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="minimumPercentage"
                type="number"
                min="0"
                step="0.1"
                value={minimumPercentage}
                onChange={(e) => setMinimumPercentage(Number(e.target.value))}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fixedAmount">Fixed Monthly Payment Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fixedAmount"
                type="number"
                min="0"
                step="10"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(Number(e.target.value))}
                className="pl-9"
                required
              />
            </div>
          </div>

          {initialMinimumPayment !== null && (
            <div className="mt-2 text-sm text-muted-foreground">
              Initial minimum payment: <span className="font-medium">${initialMinimumPayment.toFixed(2)}</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full mt-4 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate Repayment Scenarios"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default CreditCardForm;
