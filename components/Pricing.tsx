import React from 'react';
import { useStore, store } from '../state/store';
import { Check, Crown, Shield } from 'lucide-react';
import { PLANS } from '../types';

export const PricingPage: React.FC = () => {
  const { currentUser } = useStore();

  const handleUpgrade = (planName: string) => {
    // In a real app, this would trigger MercadoPago Checkout
    alert(`Iniciando checkout MercadoPago para: ${planName}`);
    // Simulating Webhook success update
    if (currentUser) {
        // Logic to update user would happen via webhook listener in backend
        console.log("Aguardando confirmação do pagamento...");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Escolha o plano ideal para sua docência</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Potencialize suas aulas com ferramentas de gestão e Inteligência Artificial alinhada à BNCC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Docente */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all relative">
          <h3 className="text-xl font-bold text-slate-800">{PLANS.DOCENTE.name}</h3>
          <div className="my-6">
            <span className="text-4xl font-bold text-slate-900">R$ {PLANS.DOCENTE.price}</span>
            <span className="text-slate-500">/mês</span>
          </div>
          <button 
            onClick={() => handleUpgrade('DOCENTE')}
            className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Escolher Básico
          </button>
          <ul className="mt-8 space-y-4">
            {PLANS.DOCENTE.features.map((feature, idx) => (
              <li key={idx} className="flex items-center space-x-3 text-slate-600 text-sm">
                <Check size={16} className="text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mestre */}
        <div className="bg-white rounded-2xl p-8 border-2 border-indigo-100 shadow-xl relative scale-105 z-10">
          <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            POPULAR
          </div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield size={20} className="text-indigo-600"/>
            {PLANS.MESTRE.name}
          </h3>
          <div className="my-6">
            <span className="text-4xl font-bold text-slate-900">R$ {PLANS.MESTRE.price}</span>
            <span className="text-slate-500">/mês</span>
          </div>
          <button 
             onClick={() => handleUpgrade('MESTRE')}
             className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Assinar Agora
          </button>
          <ul className="mt-8 space-y-4">
            {PLANS.DOCENTE.features.concat(PLANS.MESTRE.features).map((feature, idx) => (
              <li key={idx} className="flex items-center space-x-3 text-slate-700 text-sm font-medium">
                <Check size={16} className="text-indigo-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mestre Plus */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700 shadow-lg text-white">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <Crown size={20} className="text-amber-400"/>
             {PLANS.MESTRE_PLUS.name}
          </h3>
          <div className="my-6">
            <span className="text-4xl font-bold text-white">R$ {PLANS.MESTRE_PLUS.price}</span>
            <span className="text-slate-400">/mês</span>
          </div>
          <button 
             onClick={() => handleUpgrade('MESTRE_PLUS')}
             className="w-full py-3 px-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors"
          >
            Seja Plus + IA
          </button>
          <ul className="mt-8 space-y-4">
             {PLANS.DOCENTE.features.concat(PLANS.MESTRE.features).concat(PLANS.MESTRE_PLUS.features).map((feature, idx) => (
              <li key={idx} className="flex items-center space-x-3 text-slate-300 text-sm">
                <Check size={16} className="text-amber-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};