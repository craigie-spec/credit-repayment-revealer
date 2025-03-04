
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface CurrencySelectorProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currency,
  onCurrencyChange,
}) => {
  return (
    <Card className="shadow-sm mb-6">
      <CardContent className="pt-4 pb-4">
        <Label className="block mb-2 font-medium">Select Currency</Label>
        <RadioGroup
          value={currency}
          onValueChange={onCurrencyChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="USD" id="usd" />
            <Label htmlFor="usd" className="cursor-pointer">USD ($)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="EUR" id="eur" />
            <Label htmlFor="eur" className="cursor-pointer">EUR (€)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="GBP" id="gbp" />
            <Label htmlFor="gbp" className="cursor-pointer">GBP (£)</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default CurrencySelector;
