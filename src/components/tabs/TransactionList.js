import React from 'react';
import { formatRupiah } from '../../utils/formatters';

const TransactionList = ({ transactions, filter, setFilter, transactionTypes, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Transactions</h2>
      <div className="flex gap-2">
        <select
          value={filter.type}
          onChange={(e) => setFilter({...filter, type: e.target.value})}
          className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-sm border border-gray-200 dark:border-gray-600"
        >
          <option value="all">All Types</option>
          {transactionTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
        <select
          value={filter.dateRange}
          onChange={(e) => setFilter({...filter, dateRange: e.target.value})}
          className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-sm border border-gray-200 dark:border-gray-600"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {transactions.slice(-20).reverse().map(transaction => (
        <div key={transaction._id || transaction.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
          <div className="flex-1">
            <p className="font-semibold text-gray-800 dark:text-white text-sm">{transaction.description}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs">{transaction.type}</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">{transaction.category}</span>
              <span>•</span>
              <span>{transaction.date}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-sm ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatRupiah(transaction.amount)}
            </span>
            <button
              onClick={() => onDelete(transaction._id || transaction.id)}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-1 rounded transition-all duration-200"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
      {transactions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💰</div>
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your filters or add a new transaction!</p>
        </div>
      )}
    </div>
  </div>
);

export default TransactionList;