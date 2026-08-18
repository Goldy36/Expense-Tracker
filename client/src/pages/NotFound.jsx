import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { LayoutDashboard, Compass } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">404</h2>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Page Not Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            The page or resource you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            icon={LayoutDashboard}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
