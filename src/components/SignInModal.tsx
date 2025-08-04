import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { CustomAuthenticator } from '../auth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { authStatus } = useAuthenticator();

  // Close modal when user successfully authenticates
  useEffect(() => {
    if (authStatus === 'authenticated' && isOpen) {
      setTimeout(() => {
        onClose();
      }, 500); // Small delay to ensure state is properly updated
    }
  }, [authStatus, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={styles.signInModalOverlay} onClick={onClose}>
      <div style={styles.signInModalContent} onClick={(e) => e.stopPropagation()}>
        <button 
          style={styles.signInModalClose} 
          onClick={onClose}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          ×
        </button>
        <CustomAuthenticator />
      </div>
    </div>
  );
}

const styles = {
  signInModalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  signInModalContent: {
    position: 'relative' as const,
    background: 'transparent',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  signInModalClose: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    background: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    zIndex: 1001,
    transition: 'background-color 0.2s',
  },
};
