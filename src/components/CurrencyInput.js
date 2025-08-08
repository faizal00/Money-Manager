import React from 'react';

const CurrencyInput = ({ value, onChange, placeholder, className, ...props }) => {
  const formatCurrency = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseCurrency = (str) => {
    return str.replace(/\./g, '');
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const numericValue = parseCurrency(input);
    
    if (/^\d*$/.test(numericValue)) {
      onChange(numericValue);
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
        Rp
      </span>
      <input
        type="text"
        value={formatCurrency(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pl-8 ${className}`}
        {...props}
      />
    </div>
  );
};

export default CurrencyInput;