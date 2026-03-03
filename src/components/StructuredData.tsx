"use client";

import { useEffect } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://retivita.it';

export function StructuredData() {
  useEffect(() => {
    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Retivita — Rete Italiana di Consulenti Assicurativi",
      "alternateName": "Retivita",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "description": "Retivita è la rete italiana di consulenti assicurativi. Offriamo prodotti esclusivi, alte provvigioni, formazione continua e supporto commerciale per far crescere il business nel settore assicurativo.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IT",
        "addressLocality": "Italia"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Recruitment",
        "availableLanguage": ["Italian"]
      },
      "sameAs": [
        "https://retivita.it"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "Italy"
      },
      "serviceType": "Distribuzione Assicurativa",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "500",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // Product/Service Schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Rete Consulenti Assicurativi Retivita",
      "description": "Aderisci alla rete Retivita: accedi a prodotti assicurativi esclusivi, piano provvigionale competitivo, formazione certificata e supporto commerciale dedicato.",
      "provider": {
        "@type": "Organization",
        "name": "Retivita"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "price": "0",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "EUR",
          "price": "0",
          "priceType": "https://schema.org/ConsultationFee"
        },
        "availability": "https://schema.org/InStock",
        "url": siteUrl,
        "validFrom": "2025-01-01"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "500"
      },
      "featureList": [
        "Alte provvigioni sul collocato",
        "Ampio catalogo prodotti assicurativi",
        "Formazione continua certificata",
        "Supporto commerciale dedicato",
        "CRM e strumenti digitali",
        "Zero costi di ingresso"
      ]
    };

    // FAQPage Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Devo avere già un portafoglio clienti per entrare nella rete?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, accettiamo sia consulenti con esperienza pluriennale che professionisti alle prime armi. Offriamo un percorso di formazione e affiancamento personalizzato per aiutarti a costruire il tuo portafoglio fin da subito."
          }
        },
        {
          "@type": "Question",
          "name": "È necessario essere iscritti al RUI per collaborare con Retivita?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sì, è necessario essere iscritti al Registro Unico degli Intermediari (RUI) tenuto dall'IVASS. Se non sei ancora iscritto, il nostro team ti supporterà nell'intero processo di iscrizione."
          }
        },
        {
          "@type": "Question",
          "name": "Quanto posso guadagnare come consulente nella rete Retivita?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Il piano provvigionale è tra i più competitivi del mercato, con percentuali crescenti al crescere del volume di premi collocati, bonus produzione e provvigioni ricorrenti sul portafoglio."
          }
        },
        {
          "@type": "Question",
          "name": "Quali prodotti assicurativi posso collocare?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Avrai accesso a vita, previdenza integrativa, protezione reddito, TCM, polizze danni e soluzioni per aziende. Collaboriamo con le principali compagnie del mercato italiano."
          }
        },
        {
          "@type": "Question",
          "name": "Ricevo supporto e formazione dopo aver aderito alla rete?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sì, mettiamo a disposizione una piattaforma di e-learning, webinar settimanali, materiale commerciale aggiornato e un team di supporto dedicato."
          }
        }
      ]
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Diventa Consulente Assicurativo",
          "item": `${siteUrl}/diventa-consulente`
        }
      ]
    };

    // WebPage Schema
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Retivita | Entra nella Rete dei Consulenti Assicurativi",
      "description": "Unisciti a Retivita, la rete italiana di consulenti assicurativi. Prodotti esclusivi, alte provvigioni, formazione continua e supporto commerciale per far crescere il tuo business.",
      "url": siteUrl,
      "inLanguage": "it-IT",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Retivita",
        "url": siteUrl
      },
      "about": {
        "@type": "Service",
        "name": "Rete Consulenti Assicurativi"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": `${siteUrl}/og-image.jpg`
      },
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split('T')[0]
    };

    // Service Schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Distribuzione Assicurativa",
      "provider": {
        "@type": "Organization",
        "name": "Retivita"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Italy"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Prodotti Assicurativi",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Polizze Vita e Previdenza",
              "description": "Prodotti vita, previdenza integrativa e TCM per privati e aziende"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Protezione Reddito",
              "description": "Polizze di protezione del reddito e invalidità permanente"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Polizze Danni",
              "description": "Soluzioni danni per privati e aziende: casa, auto, responsabilità civile"
            }
          }
        ]
      }
    };

    // HowTo Schema
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Come entrare nella rete Retivita",
      "description": "Guida passo-passo per diventare consulente assicurativo nella rete Retivita",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Candidati Gratuitamente",
          "text": "Compila il modulo e un nostro responsabile di rete ti contatterà entro 24 ore.",
          "image": `${siteUrl}/step1.jpg`
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Onboarding e Formazione",
          "text": "Accedi al catalogo prodotti, alla piattaforma formativa e agli strumenti digitali.",
          "image": `${siteUrl}/step2.jpg`
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Inizia a Produrre",
          "text": "Coloca le prime polizze e ricevi le tue provvigioni in modo rapido e trasparente.",
          "image": `${siteUrl}/step3.jpg`
        }
      ],
      "totalTime": "PT24H"
    };

    // Add all schemas to the page
    const schemas = [
      organizationSchema,
      productSchema,
      faqSchema,
      breadcrumbSchema,
      webPageSchema,
      serviceSchema,
      howToSchema
    ];

    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `structured-data-${index}`;
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup function
    return () => {
      schemas.forEach((_, index) => {
        const script = document.getElementById(`structured-data-${index}`);
        if (script) {
          script.remove();
        }
      });
    };
  }, []);

  return null;
}
