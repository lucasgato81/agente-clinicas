import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OdontoShield | Compliance & Biossegurança Odontológica (RDC 1002/2025)",
  description: "Micro-SaaS para clínicas odontológicas: rastreabilidade de CME com QR Code, gestão de equipamentos, POPs e Dossiê Fiscal VISA em 1 clique segundo a nova RDC 1002/2025 da Anvisa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
