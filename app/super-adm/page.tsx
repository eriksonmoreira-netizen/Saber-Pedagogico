'use client';

import React from 'react';
import { useStore } from '../../state/store';
import { useRouter } from 'next/navigation';

export default function SuperAdmPage() {
  const { currentUser } = useStore();
  const router = useRouter();

  React.useEffect(() => {
    if (currentUser?.role !== 'SUPER_ADM') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (currentUser?.role !== 'SUPER_ADM') return null;

  return (
    <div className="p-8 bg-red-50 border border-red-200 rounded-xl">
      <h1 className="text-2xl font-bold text-red-800 mb-4">Área Restrita: Super Admin</h1>
      <p className="text-red-700">Painel exclusivo para erikson.moreira@gmail.com</p>
    </div>
  );
}