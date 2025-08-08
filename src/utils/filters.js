export const filterTransactions = (transactions, filter) => {
  return transactions.filter(t => {
    if (filter.type !== 'all' && t.type !== filter.type) return false;
    if (filter.category !== 'all' && t.category !== filter.category) return false;
    if (filter.dateRange !== 'all') {
      const transactionDate = new Date(t.date);
      const today = new Date();
      const daysDiff = Math.floor((today - transactionDate) / (1000 * 60 * 60 * 24));
      if (filter.dateRange === 'week' && daysDiff > 7) return false;
      if (filter.dateRange === 'month' && daysDiff > 30) return false;
    }
    return true;
  });
};