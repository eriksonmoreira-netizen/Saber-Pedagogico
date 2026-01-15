'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../state/store';
import { Login } from '../components/Login';
import { Dashboard } from '../components/Dashboard';
import { Layout } from '../components/Layout';

export default function Home() {
  const { currentUser } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log('App Renderizado no Cliente');
    setIsMounted(true);
  }, []);

  // Evita renderização no servidor para prevenir mismatch de hidratação
  if (!isMounted) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400">Carregando Saber Pedagógico...</div>;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}