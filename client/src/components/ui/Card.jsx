import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-xs shadow-slate-200/50 transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className={`px-6 py-4.5 border-b border-slate-100 flex items-center justify-between gap-4 ${headerClassName}`}>
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`${(title || subtitle || action) ? 'p-6' : 'p-6'} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
