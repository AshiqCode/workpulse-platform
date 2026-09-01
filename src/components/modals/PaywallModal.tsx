'use client';

import React from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  // Payment removed - no-op modal
  return null;
}
