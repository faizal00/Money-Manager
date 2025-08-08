import React from 'react';
import { formatRupiah } from '../utils/formatters';
import DarkModeToggle from './DarkModeToggle';

const Header = ({ balance, monthlyExpenses, spendingLimit, onMenuToggle, isDark, setIsDark }) => {
  const spendingPercentage = spendingLimit ? (monthlyExpenses / spendingLimit) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:ml-64">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden mr-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Welcome back!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Here's your financial overview</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
          <div className="text-right bg-gray-50 dark:bg-gray-700 px-2 py-1.5 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
            <p className={`text-sm font-semibold ${
              balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatRupiah(balance)}
            </p>
          </div>
          
          {spendingLimit && (
            <div className="text-right bg-gray-50 dark:bg-gray-700 px-2 py-1.5 rounded-lg hidden sm:block">
              <p className="text-xs text-gray-500 dark:text-gray-400">Spending</p>
              <p className={`text-sm font-semibold ${
                spendingPercentage >= 100 ? 'text-red-600 dark:text-red-400' : 
                spendingPercentage >= 80 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
              }`}>
                {spendingPercentage.toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;