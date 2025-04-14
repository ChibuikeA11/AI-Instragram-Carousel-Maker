'use client';

import { useState } from 'react';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { isStrongPassword } from '@/lib/client-utils';

export default function ResetPasswordPage() {
  const {
    step,
    loading,
    error,
    requestReset,
    resetPassword,
    resetToken,
    goToRequestStep
  } = usePasswordReset();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    try {
      await requestReset(email);
    } catch (err) {
      setValidationError('Failed to send reset request. Please try again.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (!isStrongPassword(password)) {
      setValidationError(
        'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
      );
      return;
    }

    if (!resetToken) {
      setValidationError('Invalid reset token');
      return;
    }

    try {
      await resetPassword(resetToken, password);
      // Redirect to login page after successful reset
      window.location.href = '/login';
    } catch (err) {
      setValidationError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {step === 'request' ? 'Reset Password' : 'Create New Password'}
        </h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded">
            {error.error.message}
          </div>
        )}

        {validationError && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded">
            {validationError}
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={goToRequestStep}
              disabled={loading}
            >
              Back to Reset Request
            </Button>
          </form>
        )}

        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Back to Login
          </a>
        </div>
      </Card>
    </div>
  );
}