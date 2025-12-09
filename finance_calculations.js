export function analyzeSpending(expenses) {
  const categories = {};
  let total = 0;

  expenses.forEach(exp => {
    const cat = exp.category || 'Other';
    categories[cat] = (categories[cat] || 0) + exp.amount;
    total += exp.amount;
  });

  const analysis = Object.entries(categories)
    .map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: ((amt / total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.amount - a.amount);

  return { analysis, total };
}

export function generateFinancialAdvice(expenses, income) {
  const { analysis, total } = analyzeSpending(expenses);
  
  let advice = [];

  // Spending vs Income
  const spendingRatio = (total / income) * 100;
  if (spendingRatio > 80) {
    advice.push(`⚠️ You're spending ${spendingRatio.toFixed(1)}% of your income. Consider reducing expenses to build savings.`);
  } else if (spendingRatio < 50) {
    advice.push(`✅ Great job! You're only spending ${spendingRatio.toFixed(1)}% of your income. You have good savings potential.`);
  }

  // Category-specific advice
  analysis.forEach(cat => {
    if (cat.category === 'Food' && parseFloat(cat.percentage) > 30) {
      advice.push(`🍔 Food expenses are ${cat.percentage}% of your spending. Try meal prepping to save money.`);
    }
    if (cat.category === 'Entertainment' && parseFloat(cat.percentage) > 20) {
      advice.push(`🎮 Entertainment is ${cat.percentage}% of spending. Look for free activities to reduce this.`);
    }
    if (cat.category === 'Shopping' && parseFloat(cat.percentage) > 25) {
      advice.push(`🛍️ Shopping accounts for ${cat.percentage}%. Consider a 24-hour rule before non-essential purchases.`);
    }
  });

  // Savings calculation
  const remaining = income - total;
  const savingsRate = (remaining / income) * 100;
  advice.push(`💰 You can save $${remaining.toLocaleString()} this month (${savingsRate.toFixed(1)}% savings rate).`);

  return { advice, analysis, total, remaining };
}
