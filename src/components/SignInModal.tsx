import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { CustomAuthenticator } from '../auth';
import './SignInModal.css';

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
    <div className="sign-in-modal-overlay" onClick={onClose}>
      <div className="sign-in-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="sign-in-modal-close" onClick={onClose}>
          ×
        </button>
        <CustomAuthenticator />
      </div>
    </div>
  );
}
