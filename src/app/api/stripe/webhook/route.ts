import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { query, isDatabaseConfigured } from '@/lib/db';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    if (!webhookSecret) {
      console.error('[STRIPE WEBHOOK ERROR] STRIPE_WEBHOOK_SECRET não está configurada no ambiente.');
      return NextResponse.json(
        { error: 'Webhook não configurado no servidor' },
        { status: 500 }
      );
    }

    if (!signature) {
      console.warn('[STRIPE WEBHOOK BLOCKED] Tentativa de chamada sem header stripe-signature');
      return NextResponse.json(
        { error: 'Assinatura stripe-signature ausente' },
        { status: 400 }
      );
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe não inicializado' }, { status: 500 });
    }

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('[STRIPE WEBHOOK SIGNATURE ERROR]', err);
      return NextResponse.json({ error: 'Assinatura inválida do webhook' }, { status: 400 });
    }

    console.log(`[STRIPE WEBHOOK] Evento recebido: ${event.type}`);

    // Processamento dos eventos principais de pagamento
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.metadata?.tenantId;
        const planId = session.metadata?.planId || 'PRO';
        const customerName = session.metadata?.customerName || 'Cliente';

        if (tenantId && isDatabaseConfigured()) {
          try {
            await query(
              `UPDATE clinic_tenants
               SET subscription_status = 'ACTIVE',
                   plan_id = $1,
                   trial_days_left = 0,
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = $2`,
              [planId, tenantId]
            );

            await query(
              `INSERT INTO superadmin_activity_log (
                id, tenant_id, tenant_name, user_name, action_type, description
              ) VALUES ($1,$2,$3,$4,$5,$6)`,
              [
                `log_pay_${Date.now()}`,
                tenantId,
                customerName,
                session.customer_details?.name || 'Cliente Stripe',
                'PAYMENT_SUCCESS',
                `Pagamento aprovado via Stripe! Assinatura ativada no plano ${planId}.`,
              ]
            );

            console.log(`[STRIPE SUCCESS] Assinatura ativada com sucesso para o tenant: ${tenantId}`);
          } catch (dbErr) {
            console.error('[STRIPE DB UPDATE ERROR]', dbErr);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[STRIPE] Fatura paga com sucesso: ${invoice.id} valor: ${invoice.amount_paid}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[STRIPE] Assinatura cancelada: ${subscription.id}`);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[STRIPE WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Erro ao processar webhook do Stripe' }, { status: 500 });
  }
}
