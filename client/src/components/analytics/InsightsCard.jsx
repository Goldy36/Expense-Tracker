import React from 'react';
import { generateInsights } from '../../utils/formatters';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react';

const InsightsCard = ({ transactions = [], budgets = [] }) => {
  const insights = generateInsights(transactions, budgets);

  const getIcon = (type) => {
    switch (type) {
      case 'positive':
        return <TrendingDown className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-50/60 border-emerald-100';
      case 'warning':
        return 'bg-amber-50/60 border-amber-100';
      case 'danger':
        return 'bg-rose-50/60 border-rose-100';
      default:
        return 'bg-indigo-50/60 border-indigo-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Financial Insights</h3>
          <p className="text-xs text-slate-400">Automated spending intelligence & financial tips</p>
        </div>
      </div>

      {insights.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No specific insights generated yet. Add more transactions to get personalized advice.</p>
      ) : (
        <div className="space-y-3">
          {insights.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${getBg(item.type)} transition-all`}
            >
              {getIcon(item.type)}
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsCard;
