export const calculateBalance = (transactions) => {
  return transactions.reduce((acc, t) => 
    acc + (t.type === 'income' ? t.amount : -t.amount), 0
  );
};

export const calculateIncome = (transactions) => {
  return transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
};

export const calculateExpenses = (transactions) => {
  return transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
};

export const getTypeBalance = (transactions, type) => {
  return transactions
    .filter(t => t.type === type)
    .reduce((acc, t) => acc + t.amount, 0);
};

export const getCategoryStats = (transactions) => {
  const stats = {};
  transactions.forEach(t => {
    if (!stats[t.category]) stats[t.category] = 0;
    stats[t.category] += t.amount;
  });
  return Object.entries(stats).sort((a, b) => b[1] - a[1]);
};