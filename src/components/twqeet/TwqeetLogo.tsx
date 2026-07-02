"use client";
import React from 'react';

export default function TwqeetLogo({ size = 128 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="TWQEET Logo"
      width={size}
      height={size}
      style={{ objectFit: 'contain', borderRadius: '50%' }}
    />
  );
}
