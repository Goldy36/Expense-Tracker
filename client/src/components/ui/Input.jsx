import React, { useEffect, useState } from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  prefix,
  suffix,
  className = '',
  containerClassName = '',
  id,
  blockAutoFill = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const [isReadOnly, setIsReadOnly] = useState(blockAutoFill);

  useEffect(() => {
    setIsReadOnly(blockAutoFill);
  }, [blockAutoFill, inputId]);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        {prefix && (
          <div className="absolute left-3.5 text-slate-500 font-medium text-sm pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          readOnly={isReadOnly}
          onFocus={(e) => {
            if (isReadOnly) {
              setIsReadOnly(false);
              e.currentTarget.removeAttribute('readonly');
            }
            props.onFocus?.(e);
          }}
          className={`w-full bg-white border ${
            error ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
          } rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-3 ${
            Icon ? 'pl-9' : prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-9' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3.5 text-slate-500 text-sm pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 mt-0.5">{error}</p>}
    </div>
  );
};

export default Input;
