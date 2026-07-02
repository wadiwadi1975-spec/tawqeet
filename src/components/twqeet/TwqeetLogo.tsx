"use client";
import React from 'react';

export default function TwqeetLogo({ size = 128 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        <linearGradient id="goldGrad" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#F5D76E" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A7B10" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="82" stroke="url(#goldGrad)" strokeWidth="6" fill="none" />
      <circle cx="100" cy="100" r="54" stroke="url(#goldGrad)" strokeWidth="5" fill="none" />
      <circle cx="100" cy="100" r="27" stroke="url(#goldGrad)" strokeWidth="4.5" fill="none" />
      <circle cx="100" cy="100" r="12" fill="url(#goldGrad)" />
      <line x1="100" y1="18" x2="100" y2="157" stroke="url(#goldGrad)" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="77" y1="38" x2="123" y2="38" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="70" y1="157" x2="130" y2="157" stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="150" cy="56" r="13" fill="url(#goldGrad)" />
      <circle cx="32" cy="94" r="10" fill="url(#goldGrad)" />
      <circle cx="159" cy="107" r="7.5" fill="url(#goldGrad)" />
    </svg>
  );
}
