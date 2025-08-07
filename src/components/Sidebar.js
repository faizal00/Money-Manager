import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, setShowLimitModal, isMobileMenuOpen, setIsMobileMenuOpen, isDark, setIsDark }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'transactions', icon: '💳', label: 'Transactions' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'categories', icon: '🏷️', label: 'Categories' }
  ];

  const handleItemClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-0 z-50 border-r border-gray-100 dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Finance Manager</h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="mt-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 text-sm ${
                activeTab === item.id 
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-base mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => {
              setShowLimitModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-4 py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 mt-4 border-t border-gray-100 dark:border-gray-700 text-sm"
          >
            <span className="text-base mr-3">💰</span>
            <span className="font-medium">Spending Limit</span>
          </button>
          

        </nav>
      </div>
    </>
  );
};

export default Sidebar;