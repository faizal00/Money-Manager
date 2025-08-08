import React from 'react';
import { formatRupiah } from '../../utils/formatters';
import LineGraph from '../LineGraph';

const ProgressBar = ({ label, amount, maxAmount, color }) => {
  const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{label}</span>
        <span className="text-xs font-bold text-gray-800 dark:text-white">{formatRupiah(amount)}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, [, amount]) => sum + amount, 0);
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 
    'bg-purple-500'
  ];

  return (
    <div className="space-y-2">
      {data.slice(0, 5).map(([category, amount], index) => {
        const percentage = total > 0 ? (amount / total) * 100 : 0;
        return (
          <div key={category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
              <span className="text-xs font-medium truncate text-gray-700 dark:text-gray-300">{category}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-xs text-gray-800 dark:text-white">{formatRupiah(amount)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(0)}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Analytics = ({ transactions, transactionTypes, getTypeBalance, getCategoryStats }) => {
  // const categoryStats = getCategoryStats(transactions);
  
  const expenseCategories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {});
  
  const expenseData = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1]);
  
  const incomeCategories = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {});
  
  const incomeData = Object.entries(incomeCategories).sort((a, b) => b[1] - a[1]);

  // Generate daily spending data for line graph
  const getDailyData = () => {
    const dailyData = {};
    transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format
      if (!dailyData[date]) {
        dailyData[date] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dailyData[date].income += t.amount;
      } else {
        dailyData[date].expense += t.amount;
      }
    });
    
    const sortedDates = Object.keys(dailyData).sort();
    const last7Days = sortedDates.slice(-7);
    
    return {
      expenses: last7Days.map(date => ({
        label: new Date(date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
        value: dailyData[date].expense
      })),
      income: last7Days.map(date => ({
        label: new Date(date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
        value: dailyData[date].income
      }))
    };
  };

  const dailyData = getDailyData();

  return (
    <div className="space-y-4">
      {/* Financial Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Financial Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {transactionTypes.map(type => (
            <div key={type} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="text-xs font-medium capitalize mb-1 text-gray-600 dark:text-gray-300">{type}</h3>
              <p className={`text-sm font-bold ${
                type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
              }`}>
                {formatRupiah(getTypeBalance(transactions, type))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Income Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Top Income Categories</h2>
          <div className="space-y-3">
            {incomeData.slice(0, 5).map(([category, amount]) => (
              <ProgressBar
                key={category}
                label={category}
                amount={amount}
                maxAmount={incomeData[0]?.[1] || 0}
                color="bg-green-500"
              />
            ))}
          </div>
        </div>

        {/* Top Expense Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Top Expense Categories</h2>
          <div className="space-y-3">
            {expenseData.slice(0, 5).map(([category, amount]) => (
              <ProgressBar
                key={category}
                label={category}
                amount={amount}
                maxAmount={expenseData[0]?.[1] || 0}
                color="bg-red-500"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Daily Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Daily Trends (Last 7 Days)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LineGraph 
            data={dailyData.expenses} 
            title="Expenses" 
            color="stroke-red-500"
          />
          <LineGraph 
            data={dailyData.income} 
            title="Income" 
            color="stroke-green-500"
          />
        </div>
      </div>

      {/* Top Spending Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Top Spending</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {expenseData.slice(0, 6).map(([category, amount], index) => {
            const maxExpense = expenseData.length > 0 ? expenseData[0][1] : 0;
            const height = maxExpense > 0 ? (amount / maxExpense) * 100 : 0;
            
            return (
              <div key={category} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                <div className="flex flex-col items-center">
                  <div className="w-full flex items-end justify-center mb-2" style={{ height: '60px' }}>
                    <div 
                      className="w-6 bg-red-500 rounded-t transition-all duration-500"
                      style={{ height: `${Math.max(height * 0.6, 10)}px` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 truncate w-full">{category}</div>
                  <div className="text-xs font-bold text-red-600 dark:text-red-400">{formatRupiah(amount)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;