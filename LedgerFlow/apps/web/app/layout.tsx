import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ledgerflow.in'),
  title: 'LedgerFlow | Firm Management Software For Chartered Accountants & Company Secretaries',
  description: 'LedgerFlow helps CA and CS firms manage clients, documents, compliance, tasks, staff, and physical files from one centralized platform. Replace Excel sheets and physical files today.',
  keywords: 'CA firm software, chartered accountant software, CS firm management, compliance tracking, document management, GST filing, TDS tracking, client management India',
  authors: [{ name: 'LedgerFlow', url: 'https://ledgerflow.in' }],
  creator: 'LedgerFlow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ledgerflow.in',
    siteName: 'LedgerFlow',
    title: 'LedgerFlow | The Digital OS For CA & CS Firms',
    description: 'Replace Excel sheets, physical files, and scattered tools with one centralized platform built for professional firms.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LedgerFlow Dashboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LedgerFlow | Firm Management Software For CA & CS Firms',
    description: 'Manage clients, documents, compliance, tasks, and physical files from one platform.',
    images: ['/og-image.png'],
    creator: '@ledgerflow',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://ledgerflow.in' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'LedgerFlow',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              description: 'Firm management platform for Chartered Accountants and Company Secretaries',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'INR',
                lowPrice: '999',
                highPrice: '2999',
                offerCount: '3',
              },
              provider: { '@type': 'Organization', name: 'LedgerFlow', url: 'https://ledgerflow.in' },
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
