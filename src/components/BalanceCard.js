import React from 'react';

const BalanceCard = ({ title, amount, color, icon }) => (
  <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <div className={`w-3 h-3 rounded-full ${icon}`}></div>
    </div>
    <p className={`text-2xl font-bold ${color}`}>{amount}</p>
  </div>
);

export default BalanceCard;