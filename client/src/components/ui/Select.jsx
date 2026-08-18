import React from 'react';

const Select = ({
  label,
  options = [],
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  id,
  placeholder = 'Select option...',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          id={selectId}
          className={`w-full bg-white border ${
            error ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
          } rounded-xl px-3.5 py-2.5 text-sm text-slate-900 transition-all outline-none focus:ring-3 appearance-none cursor-pointer ${
            Icon ? 'pl-9' : ''
          } pr-9 ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-rose-600 mt-0.5">{error}</p>}
    </div>
  );
};

export default Select;
