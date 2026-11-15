import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as unknown as Stripe.LatestApiVersion,
      appInfo: {
        name: 'OdontoShield SaaS',
        version: '1.0.0',
      },
    })
  : null;

export const isStripeConfigured = () => Boolean(stripe);

export interface PlanPricing {
  id: 'SOLO' | 'PRO' | 'ENTERPRISE';
  name: string;
  monthlyAmountBrlCents: number; // Ex: 7900 = R$ 79,00
  annualMonthlyAmountBrlCents: number; // Ex: 6300 = R$ 63,00/mês
  annualTotalAmountBrlCents: number; // Ex: 75600 = R$ 756,00/ano (com 20% OFF)
  chairsLimit: number;
}

export const STRIPE_PLANS: Record<'SOLO' | 'PRO' | 'ENTERPRISE', PlanPricing> = {
  SOLO: {
    id: 'SOLO',
    name: 'OdontoShield Consultório Solo',
    monthlyAmountBrlCents: 7900, // R$ 79,00/mês
    annualMonthlyAmountBrlCents: 6300, // R$ 63,00/mês
    annualTotalAmountBrlCents: 75600, // R$ 756,00/ano
    chairsLimit: 1,
  },
  PRO: {
    id: 'PRO',
    name: 'OdontoShield Clínica Pro',
    monthlyAmountBrlCents: 14900, // R$ 149,00/mês
    annualMonthlyAmountBrlCents: 11900, // R$ 119,00/mês
    annualTotalAmountBrlCents: 142800, // R$ 1.428,00/ano
    chairsLimit: 4,
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'OdontoShield Redes & Franquias',
    monthlyAmountBrlCents: 29900, // R$ 299,00/mês
    annualMonthlyAmountBrlCents: 23900, // R$ 239,00/mês
    annualTotalAmountBrlCents: 286800, // R$ 2.868,00/ano
    chairsLimit: 10,
  },
};
