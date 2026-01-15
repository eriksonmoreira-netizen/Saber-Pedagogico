'use client';

import React from 'react';
import { PLANS } from '../../types';
import { Check, Crown, Shield } from 'lucide-react';

export default function PricingPage() {
  const handleUpgrade = (planName: string) => {
    alert(`Iniciando webhook simulado do MercadoPago para: ${planName}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Planos & Assinaturas</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">{PLANS.DOCENTE.name}</h3>
          <div className="my-6">
            <span className="text-4xl font-bold text-slate-900">R$ {PLANS.DOCENTE.price}</span>
            <span className="text-slate-500">/mês</span>
          </div>
          <button onClick={() => handleUpgrade('DOCENTE')} className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl">Atual</button>
        </div>
        <div className="bg-white rounded-2xl p-8 border-2 border-indigo-100 shadow-xl relative scale-105 z-10">
          <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Shield size={20} className="text-indigo-600"/>{PLANS.MESTRE.name}</h3>
          <div className="my-6"><span className="text-4xl font-bold text-slate-900">R$ {PLANS.MESTRE.price}</span></div>
          <button onClick={() => handleUpgrade('MESTRE')} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl">Assinar</button>
        </div>
        <div className="bg-slate-900 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2"><Crown size={20} className="text-amber-400"/>{PLANS.MESTRE_PLUS.name}</h3>
          <div className="my-6"><span className="text-4xl font-bold">R$ {PLANS.MESTRE_PLUS.price}</span></div>
          <button onClick={() => handleUpgrade('MESTRE_PLUS')} className="w-full py-3 bg-amber-400 text-slate-900 font-bold rounded-xl">Upgrade IA</button>
        </div>
      </div>
    </div>
  );
}