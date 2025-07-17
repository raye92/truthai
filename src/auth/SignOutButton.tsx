import React from 'react';
import { signOut } from 'aws-amplify/auth';

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function SignOutButton({ 
  className = '', 
  children = 'Sign Out',
  style
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`sign-out-button ${className}`}
      style={style}
    >
      {isLoading ? 'Signing out...' : children}
    </button>
  );
}
