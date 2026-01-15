import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import MercadoPagoConfig, { Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('id') || url.searchParams.get('data.id');

    if (topic === 'payment' && id) {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      if (paymentData.status === 'approved') {
        const userEmail = paymentData.external_reference;
        
        // Mapeia o valor pago ou ID do item para o plano
        let newPlan = 'DOCENTE';
        const item = paymentData.additional_info?.items?.[0];
        
        if (item) {
           if (item.id === 'MESTRE') newPlan = 'MESTRE';
           if (item.id === 'MESTRE_PLUS') newPlan = 'MESTRE_PLUS';
        }

        if (userEmail) {
          await prisma.user.update({
            where: { email: userEmail },
            data: { plan: newPlan }
          });
          console.log(`Plano do usuário ${userEmail} atualizado para ${newPlan}`);
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}