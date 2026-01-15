'use client';

import './globals.css';
import React from 'react';

// Metadados removidos pois 'export const metadata' não é suportado em 'use client'.
// A configuração deve ser feita via layout estático ou head manual se necessário.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <head>
        <title>Saber Pedagógico</title>
        <meta name="description" content="Portal de gestão escolar com IA integrada à BNCC" />
      </head>
      <body suppressHydrationWarning={true} className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}