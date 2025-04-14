import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default async function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  if (!user.hasPaid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-bold">Premium Feature</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This feature requires a premium subscription. Upgrade your account to access premium features.
          </p>
          <Button 
            onClick={() => window.location.href = '/pricing'}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  return children;
}