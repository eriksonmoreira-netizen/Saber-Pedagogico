import './globals.css';
import type { Metadata } from 'next';
import { AuthWrapper } from '../components/AuthWrapper';

export const metadata: Metadata = {
  title: 'Saber Pedagógico',
  description: 'Portal de gestão escolar com IA integrada à BNCC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}