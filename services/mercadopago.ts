import MercadoPagoConfig, { Preference } from 'mercadopago';

// Inicializa o cliente com o Access Token configurado no ambiente
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export const createPaymentPreference = async (planId: string, price: number, title: string, userEmail: string) => {
  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: planId,
            title: title,
            unit_price: price,
            quantity: 1,
          }
        ],
        payer: {
          email: userEmail
        },
        external_reference: userEmail, // Usando email como ref para simplicidade neste MVP
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/financeiro?status=success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/financeiro?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/financeiro?status=pending`
        },
        auto_return: "approved",
      }
    });

    return result.init_point;
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    return null;
  }
};