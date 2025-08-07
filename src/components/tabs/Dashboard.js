import React from 'react';
import { formatRupiah } from '../../utils/formatters';

const Dashboard = ({ balance, income, expenses, transactionCount }) => {
  const cards = [
    {
      title: 'Balance',
      value: formatRupiah(balance),
      color: balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      icon: '💰'
    },
    {
      title: 'Income',
      value: formatRupiah(income),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
      icon: '📈'
    },
    {
      title: 'Expenses',
      value: formatRupiah(expenses),
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900',
      icon: '📉'
    },
    {
      title: 'Transactions',
      value: transactionCount,
      color: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      icon: '📋'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div 
          key={card.title}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
              <p className={`text-lg font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center ml-2`}>
              <span className="text-sm">{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;