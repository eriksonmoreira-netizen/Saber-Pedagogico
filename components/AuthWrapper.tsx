'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../state/store';
import { Login } from './Login';
import { Layout } from './Layout';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!currentUser) {
    return <Login />;
  }

  return <Layout>{children}</Layout>;
};