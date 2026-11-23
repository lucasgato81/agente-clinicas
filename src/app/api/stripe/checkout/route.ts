import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured, STRIPE_PLANS } from '@/lib/stripe';
import { query, isDatabaseConfigured } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tenantId,
      planId = 'PRO',
      billingPeriod = 'monthly',
      customerEmail,
      customerName,
    } = body;

    const selectedPlan = STRIPE_PLANS[planId as 'SOLO' | 'PRO' | 'ENTERPRISE'] || STRIPE_PLANS.PRO;
    const isAnnual = billingPeriod === 'annual';

    // Determinar preço e intervalo
    const unitAmount = isAnnual
      ? selectedPlan.annualTotalAmountBrlCents
      : selectedPlan.monthlyAmountBrlCents;

    const interval = isAnnual ? 'year' : 'month';
    const planLabel = `${selectedPlan.name} (${isAnnual ? 'Anual - 20% OFF' : 'Mensal'})`;

    const origin = request.headers.get('origin') || 'https://odontoshield.com.br';

    // 1. Se o Stripe estiver configurado com a chave do cliente
    if (isStripeConfigured() && stripe) {
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'required',
        customer_email: customerEmail || undefined,
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: planLabel,
                description: `Assinatura de Governança Sanitária e Biossegurança OdontoShield (RDC 1002/2025). Até ${selectedPlan.chairsLimit} cadeiras monitoradas.`,
                images: ['https://odontoshield.com.br/logo-odontoshield.png'],
              },
              unit_amount: unitAmount,
              recurring: {
                interval: interval as 'month' | 'year',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${origin}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}&plan=${selectedPlan.id}`,
        cancel_url: `${origin}/?payment_cancelled=true`,
        metadata: {
          tenantId: tenantId || 'clinica_temp',
          planId: selectedPlan.id,
          billingPeriod,
          customerName: customerName || '',
        },
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
      });
    }

    // 2. Se a chave do Stripe ainda não foi adicionada no Render
    // Fornecer resposta informativa com instruções claras
    return NextResponse.json({
      success: false,
      isConfigured: false,
      message:
        'A chave secreta do Stripe (STRIPE_SECRET_KEY) ainda não foi adicionada no painel do Render.',
      simulatedSuccessUrl: `${origin}/?payment_success=true&simulated=true&plan=${selectedPlan.id}`,
    });
  } catch (error) {
    console.error('[STRIPE CHECKOUT ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao iniciar checkout do Stripe',
      },
      { status: 500 }
    );
  }
}
