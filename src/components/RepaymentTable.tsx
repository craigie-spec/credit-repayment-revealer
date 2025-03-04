
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/calculator";

interface RepaymentScenario {
  month: number;
  balance: number;
  payment: number;
  interest: number;
}

interface RepaymentTableProps {
  minimumPayments: RepaymentScenario[];
  fixedMinimumPayments: RepaymentScenario[];
  fixedCustomPayments: RepaymentScenario[];
  initialMinimumPayment: number;
  fixedAmount: number;
  currencyCode: string;
}

const RepaymentTable: React.FC<RepaymentTableProps> = ({
  minimumPayments,
  fixedMinimumPayments,
  fixedCustomPayments,
  initialMinimumPayment,
  fixedAmount,
  currencyCode,
}) => {
  const [displayRange, setDisplayRange] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("scenario1");

  // Helper function to format display range
  const getMonthsToShow = (data: RepaymentScenario[]): RepaymentScenario[] => {
    switch (displayRange) {
      case "first12":
        return data.slice(0, 12);
      case "first24":
        return data.slice(0, 24);
      case "first60":
        return data.slice(0, 60);
      case "last12":
        return data.slice(-12);
      default:
        return data;
    }
  };

  // Get the data for the selected scenario
  const getScenarioData = () => {
    switch (activeTab) {
      case "scenario1":
        return getMonthsToShow(minimumPayments);
      case "scenario2":
        return getMonthsToShow(fixedMinimumPayments);
      case "scenario3":
        return getMonthsToShow(fixedCustomPayments);
      default:
        return [];
    }
  };

  // Get the title for the current scenario
  const getScenarioTitle = () => {
    switch (activeTab) {
      case "scenario1":
        return "Minimum Payment Only";
      case "scenario2":
        return `Fixed Payment Equal to Initial Minimum (${formatCurrency(initialMinimumPayment, currencyCode)})`;
      case "scenario3":
        return `Fixed Custom Payment (${formatCurrency(fixedAmount, currencyCode)})`;
      default:
        return "";
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Repayment Schedule</CardTitle>
          <CardDescription>
            {displayRange === "all" ? "Complete" : "Partial"} repayment schedule data
          </CardDescription>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4 lg:mt-0">
          <Tabs 
            defaultValue="scenario1" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="scenario1" className="text-xs sm:text-sm">
                Scenario 1
              </TabsTrigger>
              <TabsTrigger value="scenario2" className="text-xs sm:text-sm">
                Scenario 2
              </TabsTrigger>
              <TabsTrigger value="scenario3" className="text-xs sm:text-sm">
                Scenario 3
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select 
            value={displayRange} 
            onValueChange={setDisplayRange}
          >
            <SelectTrigger className="w-full md:w-[180px]">
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
        <div className="text-lg font-medium mb-4">
          {getScenarioTitle()}
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">Month</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getScenarioData().map((item) => (
                  <TableRow key={item.month}>
                    <TableCell className="font-medium">{item.month}</TableCell>
                    <TableCell>{formatCurrency(item.payment, currencyCode)}</TableCell>
                    <TableCell>{formatCurrency(item.interest, currencyCode)}</TableCell>
                    <TableCell>{formatCurrency(item.balance, currencyCode)}</TableCell>
                  </TableRow>
                ))}
                {getScenarioData().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepaymentTable;
