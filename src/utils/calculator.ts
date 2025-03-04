
interface RepaymentScenario {
  month: number;
  balance: number;
  payment: number;
  interest: number;
}

export interface CalculationResult {
  minimumPayments: RepaymentScenario[];
  fixedMinimumPayments: RepaymentScenario[];
  fixedCustomPayments: RepaymentScenario[];
  totalPaidMinimum: number;
  totalPaidFixedMinimum: number;
  totalPaidFixedCustom: number;
  timeToPayMinimum: number;
  timeToPayFixedMinimum: number;
  timeToPayFixedCustom: number;
  initialMinimumPayment: number;
}

export const calculateRepaymentScenarios = (
  balance: number,
  apr: number,
  minimumPercentage: number,
  fixedAmount: number
): CalculationResult => {
  // Convert APR to monthly interest rate
  const monthlyInterestRate = apr / 100 / 12;
  
  // Calculate initial minimum payment
  const initialMinimumPayment = Math.max(
    (minimumPercentage / 100) * balance, 
    25 // Assuming minimum payment can never be less than $25
  );
  
  // Scenario 1: Minimum payments only
  const minimumPayments: RepaymentScenario[] = [];
  let currentBalance = balance;
  let month = 0;
  let totalPaidMinimum = 0;

  while (currentBalance > 0 && month < 600) { // Limit to 50 years (600 months) to prevent infinite loops
    month++;
    
    // Calculate interest for this month
    const interest = currentBalance * monthlyInterestRate;
    
    // Calculate minimum payment (percentage of current balance)
    const minimumPayment = Math.max(
      (minimumPercentage / 100) * currentBalance, 
      25 // Assuming minimum payment can never be less than $25
    );
    
    // Calculate actual payment (can't pay more than remaining balance + interest)
    const payment = Math.min(minimumPayment, currentBalance + interest);
    
    // Update balance
    currentBalance = Math.max(0, currentBalance + interest - payment);
    
    totalPaidMinimum += payment;
    
    minimumPayments.push({
      month,
      balance: parseFloat(currentBalance.toFixed(2)),
      payment: parseFloat(payment.toFixed(2)),
      interest: parseFloat(interest.toFixed(2))
    });
    
    // Break if balance is effectively zero (to handle floating point precision)
    if (currentBalance < 0.01) break;
  }

  // Scenario 2: Fixed minimum payments equal to first month's minimum payment
  const fixedMinimumPayments: RepaymentScenario[] = [];
  currentBalance = balance;
  month = 0;
  let totalPaidFixedMinimum = 0;
  const fixedMinimumPayment = initialMinimumPayment;

  while (currentBalance > 0 && month < 600) {
    month++;
    
    const interest = currentBalance * monthlyInterestRate;
    const payment = Math.min(fixedMinimumPayment, currentBalance + interest);
    
    currentBalance = Math.max(0, currentBalance + interest - payment);
    
    totalPaidFixedMinimum += payment;
    
    fixedMinimumPayments.push({
      month,
      balance: parseFloat(currentBalance.toFixed(2)),
      payment: parseFloat(payment.toFixed(2)),
      interest: parseFloat(interest.toFixed(2))
    });
    
    if (currentBalance < 0.01) break;
  }

  // Scenario 3: Fixed custom amount
  const fixedCustomPayments: RepaymentScenario[] = [];
  currentBalance = balance;
  month = 0;
  let totalPaidFixedCustom = 0;

  while (currentBalance > 0 && month < 600) {
    month++;
    
    const interest = currentBalance * monthlyInterestRate;
    const payment = Math.min(fixedAmount, currentBalance + interest);
    
    currentBalance = Math.max(0, currentBalance + interest - payment);
    
    totalPaidFixedCustom += payment;
    
    fixedCustomPayments.push({
      month,
      balance: parseFloat(currentBalance.toFixed(2)),
      payment: parseFloat(payment.toFixed(2)),
      interest: parseFloat(interest.toFixed(2))
    });
    
    if (currentBalance < 0.01) break;
  }

  return {
    minimumPayments,
    fixedMinimumPayments,
    fixedCustomPayments,
    totalPaidMinimum: parseFloat(totalPaidMinimum.toFixed(2)),
    totalPaidFixedMinimum: parseFloat(totalPaidFixedMinimum.toFixed(2)),
    totalPaidFixedCustom: parseFloat(totalPaidFixedCustom.toFixed(2)),
    timeToPayMinimum: minimumPayments.length,
    timeToPayFixedMinimum: fixedMinimumPayments.length,
    timeToPayFixedCustom: fixedCustomPayments.length,
    initialMinimumPayment: parseFloat(initialMinimumPayment.toFixed(2))
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
