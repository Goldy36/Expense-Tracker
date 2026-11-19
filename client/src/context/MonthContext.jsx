import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const MonthContext = createContext(null);

export const getMonthValue = (date) => (
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
);

export const MonthProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => getMonthValue(new Date()));
  const lastCurrentMonth = useRef(getMonthValue(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      const currentMonth = getMonthValue(new Date());
      if (currentMonth !== lastCurrentMonth.current) {
        setSelectedMonth((month) => month === lastCurrentMonth.current ? currentMonth : month);
        lastCurrentMonth.current = currentMonth;
      }
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useSelectedMonth = () => {
  const context = useContext(MonthContext);
  if (!context) throw new Error('useSelectedMonth must be used within MonthProvider');
  return context;
};
