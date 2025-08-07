import React, { useState, useEffect } from 'react';
import { useAPI } from './hooks/useAPI';
import { useDarkMode } from './hooks/useDarkMode';
import { calculateBalance, calculateIncome, calculateExpenses, getTypeBalance, getCategoryStats } from './utils/calculations';
import { filterTransactions } from './utils/filters';
import { formatRupiah } from './utils/formatters';
import Dashboard from './components/tabs/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/tabs/TransactionList';
import Analytics from './components/tabs/Analytics';
import Modal from './components/Modal';
import SpendingLimitModal from './components/SpendingLimitModal';
import SpendingAlert from './components/SpendingAlert';
import LimitExceededAlert from './components/LimitExceededAlert';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PageTransition from './components/PageTransition';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({
    income: ['Salary', 'Freelance', 'Investment', 'Other'],
    expense: ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Other']
  });
  const [transactionTypes, setTransactionTypes] = useState(['income', 'expense']);
  const [form, setForm] = useState({ type: 'income', amount: '', description: '', category: '' });
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState('');
  const [filter, setFilter] = useState({ type: 'all', category: 'all', dateRange: 'all' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [spendingLimit, setSpendingLimit] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showSpendingAlert, setShowSpendingAlert] = useState(false);
  const [showLimitExceeded, setShowLimitExceeded] = useState(false);
  const [exceededAmount, setExceededAmount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();
  const { apiCall, loading } = useAPI();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsData, settingsData] = await Promise.all([
        apiCall('/transactions'),
        apiCall('/settings')
      ]);
      setTransactions(transactionsData);
      setCategories(settingsData.categories);
      setTransactionTypes(settingsData.transactionTypes);
      setSpendingLimit(settingsData.spendingLimit);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const balance = calculateBalance(transactions);
  const income = calculateIncome(transactions);
  const expenses = calculateExpenses(transactions);
  const filteredTransactions = filterTransactions(transactions, filter);

  // Calculate monthly expenses for spending limit check
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const spendingPercentage = spendingLimit ? (monthlyExpenses / spendingLimit) * 100 : 0;

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.category) return;
    
    const transactionAmount = parseFloat(form.amount);
    
    // Check if expense would exceed spending limit
    if (form.type === 'expense' && spendingLimit && spendingLimit > 0) {
      const newMonthlyExpenses = monthlyExpenses + transactionAmount;
      if (newMonthlyExpenses > spendingLimit) {
        setExceededAmount(transactionAmount);
        setShowLimitExceeded(true);
        return;
      }
    }
    
    try {
      const newTransaction = {
        ...form,
        amount: transactionAmount,
        date: new Date().toLocaleDateString()
      };
      
      const savedTransaction = await apiCall('/transactions', {
        method: 'POST',
        body: JSON.stringify(newTransaction)
      });
      
      setTransactions([savedTransaction, ...transactions]);
      setForm({ type: 'income', amount: '', description: '', category: '' });
      
      // Check spending limit after adding expense
      if (form.type === 'expense' && spendingLimit) {
        const newMonthlyExpenses = monthlyExpenses + transactionAmount;
        const newPercentage = (newMonthlyExpenses / spendingLimit) * 100;
        if (newPercentage >= 80) {
          setShowSpendingAlert(true);
        }
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiCall(`/transactions/${id}`, { method: 'DELETE' });
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const addCategory = async () => {
    if (!newCategory || !form.type) return;
    const updatedCategories = {
      ...categories,
      [form.type]: [...(categories[form.type] || []), newCategory]
    };
    
    try {
      await apiCall('/settings', {
        method: 'PUT',
        body: JSON.stringify({ categories: updatedCategories })
      });
      setCategories(updatedCategories);
      setNewCategory('');
      setShowAddCategory(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const addTransactionType = async () => {
    if (!newType || transactionTypes.includes(newType)) return;
    const updatedTypes = [...transactionTypes, newType];
    const updatedCategories = { ...categories, [newType]: [] };
    
    try {
      await apiCall('/settings', {
        method: 'PUT',
        body: JSON.stringify({ 
          transactionTypes: updatedTypes,
          categories: updatedCategories 
        })
      });
      setTransactionTypes(updatedTypes);
      setCategories(updatedCategories);
      setNewType('');
      setShowAddType(false);
    } catch (error) {
      console.error('Failed to add transaction type:', error);
    }
  };

  const handleSetSpendingLimit = async (limit) => {
    try {
      const payload = { spendingLimit: limit };
      await apiCall('/settings', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      setSpendingLimit(limit);
      setShowLimitModal(false);
    } catch (error) {
      console.error('Failed to set spending limit:', error);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setShowLimitModal={setShowLimitModal}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isDark={isDark}
        setIsDark={setIsDark}
      />
      
      <Header 
        balance={balance}
        monthlyExpenses={monthlyExpenses}
        spendingLimit={spendingLimit}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isDark={isDark}
        setIsDark={setIsDark}
      />
      
      <main className="md:ml-64 p-4">
        <PageTransition key={activeTab}>
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <Dashboard
                balance={balance}
                income={income}
                expenses={expenses}
                transactionCount={transactions.length}
              />
              
              {spendingLimit && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">Monthly Spending Progress</h3>
                    <button
                      onClick={() => setShowLimitModal(true)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span>Spent: {formatRupiah(monthlyExpenses)}</span>
                      <span>Limit: {formatRupiah(spendingLimit)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          spendingPercentage >= 100 ? 'bg-red-500' :
                          spendingPercentage >= 80 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {spendingPercentage.toFixed(1)}% used
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TransactionForm 
                form={form}
                setForm={setForm}
                transactionTypes={transactionTypes}
                categories={categories}
                onSubmit={addTransaction}
                onAddType={() => setShowAddType(true)}
                onAddCategory={() => setShowAddCategory(true)}
                loading={loading}
              />
              <TransactionList 
                transactions={filteredTransactions}
                filter={filter}
                setFilter={setFilter}
                transactionTypes={transactionTypes}
                onDelete={deleteTransaction}
              />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Manage Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(categories).map(([type, cats]) => (
                  <div key={type} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                    <h3 className="text-sm font-semibold mb-3 capitalize text-gray-700 dark:text-gray-300">{type}</h3>
                    <div className="space-y-2">
                      {cats.map(cat => (
                        <div key={cat} className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded text-xs">
                          <span className="text-gray-800 dark:text-white">{cat}</span>
                          <button
                            onClick={async () => {
                              const updatedCategories = {
                                ...categories,
                                [type]: categories[type].filter(c => c !== cat)
                              };
                              try {
                                await apiCall('/settings', {
                                  method: 'PUT',
                                  body: JSON.stringify({ categories: updatedCategories })
                                });
                                setCategories(updatedCategories);
                              } catch (error) {
                                console.error('Failed to delete category:', error);
                              }
                            }}
                            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <Analytics
              transactions={filteredTransactions}
              transactionTypes={transactionTypes}
              getTypeBalance={getTypeBalance}
              getCategoryStats={getCategoryStats}
            />
          )}
        </PageTransition>
      </main>

      <Modal show={showAddCategory} onClose={() => setShowAddCategory(false)} title="Add New Category">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">Adding to: {form.type}</p>
          <div className="flex gap-3">
            <button
              onClick={addCategory}
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Add Category
            </button>
            <button
              onClick={() => {setShowAddCategory(false); setNewCategory('');}}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 p-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={showAddType} onClose={() => setShowAddType(false)} title="Add New Transaction Type">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Type name (e.g., investment, loan)"
            value={newType}
            onChange={(e) => setNewType(e.target.value.toLowerCase())}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-3">
            <button
              onClick={addTransactionType}
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Add Type
            </button>
            <button
              onClick={() => {setShowAddType(false); setNewType('');}}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 p-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <SpendingLimitModal
        show={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        currentLimit={spendingLimit}
        onSave={handleSetSpendingLimit}
      />

      <SpendingAlert
        show={showSpendingAlert}
        onClose={() => setShowSpendingAlert(false)}
        currentSpending={monthlyExpenses}
        limit={spendingLimit}
        percentage={spendingPercentage}
      />

      <LimitExceededAlert
        show={showLimitExceeded}
        onClose={() => setShowLimitExceeded(false)}
        onEditLimit={() => setShowLimitModal(true)}
        currentSpending={monthlyExpenses}
        limit={spendingLimit}
        newAmount={exceededAmount}
      />

    </div>
  );
};

export default App;