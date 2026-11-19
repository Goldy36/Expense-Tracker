import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import BrandLogo from '../components/ui/BrandLogo';
import Input from '../components/ui/Input';
import ThemeToggle from '../components/ui/ThemeToggle';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(trimmedName, trimmedEmail, password, false);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo className="w-12 h-12 rounded-2xl shadow-lg shadow-orange-200 mb-1" />
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500">Start tracking your personal finances efficiently</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="sr-only" aria-hidden="true">
            <input type="text" name="username" autoComplete="username" tabIndex="-1" readOnly />
            <input type="password" name="password" autoComplete="new-password" tabIndex="-1" readOnly />
          </div>

          <Input
            label="Full Name"
            type="text"
            name="signup_full_name"
            autoComplete="off"
            blockAutoFill
            icon={User}
            placeholder="Your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="signup_email"
            autoComplete="off"
            blockAutoFill
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            required
          />

          <Input
            label="Password"
            type="password"
            name="signup_password"
            autoComplete="new-password"
            blockAutoFill
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="signup_confirm_password"
            autoComplete="new-password"
            blockAutoFill
            icon={Lock}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            required
          />

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              I agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-indigo-600 font-semibold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-indigo-600 font-semibold hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={ArrowRight}
          >
            Create Account
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
