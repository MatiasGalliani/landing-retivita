import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./smoothscroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://retivita.it';
const siteName = 'Retivita';
const defaultTitle = 'Retivita | Entra nella Rete dei Consulenti Assicurativi';
const defaultDescription = 'Unisciti a Retivita, la rete italiana di consulenti assicurativi. Prodotti esclusivi, alte provvigioni, formazione continua e supporto commerciale per far crescere il tuo business nel settore assicurativo.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "consulente assicurativo",
    "agente assicurazioni",
    "rete distribuzione assicurativa",
    "lavoro assicurazioni",
    "diventare agente assicurativo",
    "provvigioni assicurazioni",
    "RUI IVASS",
    "broker assicurativo",
    "polizze vita",
    "previdenza integrativa",
    "protezione reddito",
    "rete agenti assicurativi",
    "carriera assicurazioni",
    "formazione assicurativa",
    "retivita consulenti",
    "guadagnare con le assicurazioni",
    "portafoglio assicurativo",
    "collocamento polizze",
    "intermediario assicurativo",
    "opportunità lavoro assicurazioni Italia",
  ],
  authors: [{ name: "Retivita - Rete Italiana di Consulenti Assicurativi" }],
  creator: "Retivita",
  publisher: "Retivita",
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Retivita - La Rete dei Consulenti Assicurativi",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  category: "Distribuzione Assicurativa",
  classification: "Insurance Distribution Network",
  other: {
    'format-detection': 'telephone=yes',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://creditplan.it" />
        <link rel="preconnect" href="https://www.organismo-am.it" />
        <link rel="dns-prefetch" href="https://creditplan.it" />
        <link rel="dns-prefetch" href="https://www.organismo-am.it" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="IT" />
        <meta name="geo.placename" content="Italia" />
        <meta name="language" content="Italian" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
