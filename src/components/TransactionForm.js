import React from 'react';
import CurrencyInput from './CurrencyInput';

const TransactionForm = ({ 
  form, 
  setForm, 
  transactionTypes, 
  categories, 
  onSubmit, 
  onAddType, 
  onAddCategory,
  loading = false
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add Transaction</h2>
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Type</label>
        <div className="flex gap-2">
          <select 
            value={form.type} 
            onChange={(e) => setForm({...form, type: e.target.value, category: ''})}
            className="flex-1 p-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
          >
            {transactionTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={onAddType}
            className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-all duration-200 border border-gray-200 dark:border-gray-600"
          >
            +
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Amount</label>
        <CurrencyInput
          value={form.amount}
          onChange={(value) => setForm({...form, amount: value})}
          placeholder="Enter amount"
          className="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Description</label>
        <input
          type="text"
          placeholder="What's this for?"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          className="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Category</label>
        <div className="flex gap-2">
          <select
            value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})}
            className="flex-1 p-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
          >
            <option value="">Select Category</option>
            {(categories[form.type] || []).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={onAddCategory}
            className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-all duration-200 border border-gray-200 dark:border-gray-600"
          >
            +
          </button>
        </div>
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  </div>
);

export default TransactionForm;