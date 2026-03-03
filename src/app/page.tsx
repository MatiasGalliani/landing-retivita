'use client';

import { useState, memo, useCallback, useMemo, lazy, Suspense, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import dynamic from 'next/dynamic';
import { StructuredData } from "@/components/StructuredData";
import { getLenis } from './smoothscroll'

// Lazy load heavy sections below the fold for faster initial load
const FormSection = dynamic(() => import('@/components/FormSection').then(mod => ({ default: mod.FormSection })), {
  loading: () => <div className="h-[600px] animate-pulse bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl" />
});

// Extract static data outside component to prevent recreation
const FAQ_ITEMS = [
  {
    question: "Devo avere già un portafoglio clienti per entrare nella rete?",
    answer: "No, accettiamo sia consulenti con esperienza pluriennale che professionisti alle prime armi. Offriamo un percorso di formazione e affiancamento personalizzato per aiutarti a costruire e sviluppare il tuo portafoglio fin da subito."
  },
  {
    question: "È necessario essere iscritti al RUI per collaborare con Retivita?",
    answer: "Sì, è necessario essere iscritti al Registro Unico degli Intermediari (RUI) tenuto dall'IVASS. Se non sei ancora iscritto, il nostro team ti supporterà nell'intero processo di iscrizione, rendendo tutto più semplice e veloce."
  },
  {
    question: "Quanto posso guadagnare come consulente nella rete Retivita?",
    answer: "Il piano provvigionale è tra i più competitivi del mercato, con percentuali crescenti al crescere del volume di premi collocati. I consulenti più attivi raggiungono guadagni significativi grazie alle provvigioni ricorrenti sul portafoglio e ai bonus di produzione."
  },
  {
    question: "Quali prodotti assicurativi posso collocare?",
    answer: "Avrai accesso a un ampio catalogo di prodotti: vita, previdenza integrativa, protezione reddito, TCM, polizze danni e soluzioni dedicate alle aziende. Collaboriamo con le principali compagnie del mercato italiano per offrirti sempre le soluzioni più competitive."
  },
  {
    question: "Ricevo supporto e formazione dopo aver aderito alla rete?",
    answer: "Assolutamente sì. Mettiamo a disposizione una piattaforma di e-learning sempre aggiornata, webinar settimanali con esperti del settore, materiale commerciale professionale e un team di supporto dedicato per accompagnarti in ogni fase della tua crescita professionale.",
  }
] as const;

const STAR_RATINGS = [1, 2, 3, 4, 5] as const;

const GOOGLE_REVIEWS = [
  {
    author: "Marco T.",
    rating: 5,
    timeAgo: "6 mesi fa",
    text: "Ho aderito alla rete Retivita 6 mesi fa e devo dire che è stata la scelta migliore per la mia carriera. Il supporto commerciale è eccellente, i prodotti sono competitivi e le provvigioni sono davvero sopra la media. Consigliatissimo a chi vuole crescere nel settore assicurativo."
  },
  {
    author: "Valentina R.",
    rating: 5,
    timeAgo: "8 mesi fa",
    text: "Ottima rete, ottima professionalità! Finalmente una struttura che crede davvero nei propri consulenti."
  },
  {
    author: "Giulia Ferretti",
    rating: 5,
    timeAgo: "1 anno fa",
    text: "Cordiali e sempre attenti alle esigenze del consulente. Il team di supporto risponde in tempi rapidissimi ed è molto preparato. Ho triplicato il mio volume di premi nel primo anno."
  },
  {
    author: "Roberto Mancini",
    rating: 5,
    timeAgo: "1 anno fa",
    text: "Servizio impeccabile, affrontano ogni situazione con professionalità. Grazie a Retivita ho potuto finalmente dedicarmi solo alla consulenza, senza preoccuparmi della burocrazia amministrativa."
  },
  {
    author: "Chiara Lombardi",
    rating: 5,
    timeAgo: "1 anno fa",
    text: "Provenivo da un'altra rete e non avrei mai pensato che la differenza potesse essere così grande. Retivita ti fornisce tutti gli strumenti per lavorare al meglio: CRM, materiale commerciale, formazione costante. Il team mi ha seguita in modo impeccabile fin dal primo giorno, risolvendo ogni dubbio con competenza e disponibilità. Provvigioni tra le più alte del mercato e pagamenti sempre puntuali. Non tornerei mai indietro. Grazie Retivita!"
  },
  {
    author: "Stefano Bellini",
    rating: 5,
    timeAgo: "1 anno fa",
    text: "Rete seria, professionale e con un portafoglio prodotti davvero ampio. Apprezzo molto la trasparenza del piano provvigionale e la velocità nei pagamenti. Grazie di tutto."
  },
  {
    author: "Laura Esposito",
    rating: 5,
    timeAgo: "1 anno fa",
    text: "Sono entrata in Retivita come neofita, senza esperienza nel settore assicurativo. Grazie alla formazione dedicata e all'affiancamento costante, in pochi mesi ho costruito un portafoglio solido. Non avrei potuto iniziare meglio la mia carriera. Grazie ancora al team!"
  },
  {
    author: "Davide Conti",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Ho scelto Retivita dopo aver valutato diverse reti assicurative. La differenza è nella qualità del supporto: sempre presenti, sempre professionali. I prodotti delle compagnie convenzionate sono competitivi e i clienti sono soddisfatti. Il meglio che potessi trovare."
  },
  {
    author: "Francesca M.",
    rating: 5,
    timeAgo: "2 anni fa",
    text: "Professionali e molto disponibili. Mi hanno aiutato a strutturare la mia attività in modo efficiente, fornendo strumenti digitali di alta qualità e un supporto umano che fa davvero la differenza. Non esiterei a consigliare Retivita a qualsiasi collega consulente!"
  }
] as const;

const BENEFITS_DATA = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "blue",
    title: "Alte Provvigioni",
    description: "Piano provvigionale tra i più competitivi del mercato assicurativo",
    detailedContent: "Il nostro piano provvigionale è tra i più competitivi del mercato assicurativo italiano. Guadagni commissioni elevate su ogni polizza collocata, con bonus al raggiungimento degli obiettivi e provvigioni ricorrenti sul portafoglio clienti acquisito nel tempo."
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "green",
    title: "Ampio Catalogo Prodotti",
    description: "Vita, previdenza, protezione e polizze danni delle migliori compagnie",
    detailedContent: "Accedi a un catalogo completo di prodotti assicurativi: vita, previdenza integrativa, TCM, protezione reddito, polizze danni e soluzioni per aziende. Collaboriamo con le principali compagnie italiane per offrirti sempre i prodotti più competitivi e adatti ai tuoi clienti."
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "indigo",
    title: "Formazione Continua",
    description: "Percorsi formativi certificati e aggiornamento professionale costante",
    detailedContent: "Accedi a percorsi formativi certificati, webinar settimanali tenuti da esperti del settore, materiale commerciale sempre aggiornato e affiancamento da professionisti esperti. Investiamo nella tua crescita professionale perché il tuo successo è il nostro successo."
  }
] as const;

const WHY_CHOOSE_BENEFITS_DATA = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "blue",
    title: "Supporto Commerciale Dedicato",
    description: "Un team ti affianca in ogni fase della vendita e dello sviluppo del portafoglio",
    detailedContent: "Il nostro team di supporto commerciale è sempre al tuo fianco: ti aiuta nella gestione dei clienti, nella preparazione delle proposte e nella chiusura dei contratti. Con Retivita non sarai mai solo nel tuo percorso di crescita professionale.",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-500/5",
    textColor: "text-blue-600"
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "green",
    title: "Tecnologia e CRM",
    description: "Strumenti digitali avanzati per gestire clienti, polizze e reportistica",
    detailedContent: "Metti a disposizione strumenti digitali all'avanguardia: CRM dedicato, gestione documentale, firma digitale e reportistica in tempo reale. La tecnologia ti permette di lavorare in modo più efficiente e professionale, concentrandoti sulla consulenza anziché sulla burocrazia.",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
    borderColor: "border-emerald-200",
    bgColor: "bg-emerald-500/5",
    textColor: "text-emerald-600"
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "amber",
    title: "Zero Costi di Ingresso",
    description: "Nessuna fee di iscrizione, inizia subito a produrre e guadagnare",
    detailedContent: "Nessun costo di iscrizione, nessuna fee mensile. Con Retivita guadagni dalla prima polizza collocata senza dover sostenere costi fissi. Il nostro modello si basa esclusivamente sulla tua produzione: più produci, più guadagni.",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-500/5",
    textColor: "text-amber-600"
  }
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Candidati Gratuitamente",
    description: "Compila il modulo e un nostro responsabile di rete ti contatterà entro 24 ore.",
    detailedContent: "Compila il modulo di candidatura con le tue informazioni e la tua esperienza nel settore. Un nostro responsabile di rete ti contatterà entro 24 ore lavorative per una consulenza personalizzata, senza impegno. Valuteremo insieme le opportunità più adatte al tuo profilo professionale."
  },
  {
    step: 2,
    title: "Onboarding e Formazione",
    description: "Accedi al catalogo prodotti, alla piattaforma formativa e agli strumenti digitali.",
    detailedContent: "Una volta formalizzata la collaborazione, accedi immediatamente alla nostra piattaforma di formazione certificata, al catalogo prodotti completo e a tutti gli strumenti digitali. Il nostro team ti affianca nei primi passi per garantirti il massimo della produttività fin da subito."
  },
  {
    step: 3,
    title: "Inizia a Produrre",
    description: "Coloca le prime polizze e ricevi le tue provvigioni in modo rapido e trasparente.",
    detailedContent: "Inizia subito a collocare polizze con il supporto costante del nostro team commerciale. Le provvigioni vengono liquidate rapidamente e hai accesso in tempo reale al tuo estratto conto provvigionale. Il tuo portafoglio cresce e con esso le tue entrate ricorrenti."
  }
] as const;

// Memoized Benefit Card Component
const BenefitCard = memo(({ icon, color, title, description, onClick }: {
  icon: string;
  color: string;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200 hover:border-green-200",
    indigo: "bg-indigo-100 text-indigo-600 border-indigo-200 hover:border-indigo-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200 hover:border-amber-200"
  };

  const bgClass = color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'indigo' ? 'bg-indigo-100' : 'bg-amber-100';
  const textClass = color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'indigo' ? 'text-indigo-600' : 'text-amber-600';

  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md cursor-pointer text-left w-full"
    >
      <div className={`flex-shrink-0 w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
        <svg className={`w-5 h-5 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </button>
  );
});

BenefitCard.displayName = 'BenefitCard';

// Memoized FAQ Item Component
const FAQItem = memo(({
  faq,
  index,
  isOpen,
  onToggle
}: {
  faq: typeof FAQ_ITEMS[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
    ? 'border-blue-200 shadow-lg shadow-blue-100/50'
    : 'border-slate-200 shadow-sm hover:border-blue-100 hover:shadow-md'
    }`} itemScope itemType="https://schema.org/Question">
    {/* Gradient accent line - only visible when open */}
    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
      }`}></div>

    <button
      onClick={onToggle}
      className="w-full px-6 lg:px-8 py-6 text-left flex items-start justify-between gap-4 group"
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Question number badge */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${isOpen
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md'
          : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
          }`}>
          {index + 1}
        </div>

        <h3 className={`text-base lg:text-lg font-bold transition-colors duration-300 ${isOpen
          ? 'text-blue-600'
          : 'text-slate-900 group-hover:text-blue-600'
          }`} itemProp="name">
          {faq.question}
        </h3>
      </div>

      {/* Arrow icon */}
      <div className="flex-shrink-0 mt-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen
          ? 'bg-blue-50 rotate-180'
          : 'bg-slate-50 group-hover:bg-blue-50'
          }`}>
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${isOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </button>

    {/* Answer section */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
    >
      <div className="px-6 lg:px-8 pb-6">
        <div className="pl-12 pr-4">
          <div className="pt-2 border-t border-slate-100" itemScope itemType="https://schema.org/Answer">
            <p className="text-slate-600 leading-relaxed pt-4 text-[15px] lg:text-base" itemProp="text">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

FAQItem.displayName = 'FAQItem';

// Benefit Modal Component
const BenefitModal = memo(({
  isOpen,
  onClose,
  benefit
}: {
  isOpen: boolean;
  onClose: () => void;
  benefit: typeof BENEFITS_DATA[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !benefit) return null;

  const bgClass = benefit.color === 'blue' ? 'bg-blue-100' : benefit.color === 'green' ? 'bg-green-100' : benefit.color === 'indigo' ? 'bg-indigo-100' : 'bg-amber-100';
  const textClass = benefit.color === 'blue' ? 'text-blue-600' : benefit.color === 'green' ? 'text-green-600' : benefit.color === 'indigo' ? 'text-indigo-600' : 'text-amber-600';
  const borderClass = benefit.color === 'blue' ? 'border-blue-200' : benefit.color === 'green' ? 'border-green-200' : benefit.color === 'indigo' ? 'border-indigo-200' : 'border-amber-200';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-2 ${borderClass}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 ${bgClass} rounded-2xl flex items-center justify-center mb-6`}>
            <svg className={`w-8 h-8 ${textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{benefit.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{benefit.detailedContent}</p>
        </div>
      </div>
    </div>
  );
});

BenefitModal.displayName = 'BenefitModal';

// Why Choose Benefit Modal Component
const WhyChooseModal = memo(({
  isOpen,
  onClose,
  benefit
}: {
  isOpen: boolean;
  onClose: () => void;
  benefit: typeof WHY_CHOOSE_BENEFITS_DATA[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !benefit) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-2 ${benefit.borderColor}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{benefit.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{benefit.detailedContent}</p>
        </div>
      </div>
    </div>
  );
});

WhyChooseModal.displayName = 'WhyChooseModal';

// Google Reviews Modal Component
const ReviewsModal = memo(({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 border-2 border-blue-200 my-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors z-10"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
              <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
            </svg>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">ECCELLENTE</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {STAR_RATINGS.map((i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                  <span className="text-lg font-semibold text-slate-900">4.9/5</span>
                  <span className="text-sm text-slate-600">• Oltre 500 consulenti soddisfatti</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {GOOGLE_REVIEWS.map((review, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{review.author}</h3>
                  <p className="text-xs text-slate-500">{review.timeAgo}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ReviewsModal.displayName = 'ReviewsModal';

// How It Works Step Modal Component
const HowItWorksModal = memo(({
  isOpen,
  onClose,
  step
}: {
  isOpen: boolean;
  onClose: () => void;
  step: typeof HOW_IT_WORKS_STEPS[number] | null;
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !step) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border-2 border-blue-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUpAndScale 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl font-bold text-white">{step.step}</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{step.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{step.detailedContent}</p>
        </div>
      </div>
    </div>
  );
});

HowItWorksModal.displayName = 'HowItWorksModal';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openBenefitIndex, setOpenBenefitIndex] = useState<number | null>(null);
  const [openWhyChooseIndex, setOpenWhyChooseIndex] = useState<number | null>(null);
  const [openReviewsModal, setOpenReviewsModal] = useState(false);
  const [openHowItWorksIndex, setOpenHowItWorksIndex] = useState<number | null>(null);
  const [openImpresaEdileDialog, setOpenImpresaEdileDialog] = useState(false);

  // Memoize scroll handler
  const scrollToForm = useCallback(() => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback: try to find the form
      const formElement = document.querySelector('form');
      formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Memoize FAQ toggle handlers
  const handleFaqToggle = useCallback((index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  }, []);

  // Memoize benefit modal handlers
  const handleBenefitClick = useCallback((index: number) => {
    setOpenBenefitIndex(index);
  }, []);

  const handleCloseBenefitModal = useCallback(() => {
    setOpenBenefitIndex(null);
  }, []);

  // Memoize Why Choose modal handlers
  const handleWhyChooseClick = useCallback((index: number) => {
    setOpenWhyChooseIndex(index);
  }, []);

  const handleCloseWhyChooseModal = useCallback(() => {
    setOpenWhyChooseIndex(null);
  }, []);

  // Memoize reviews modal handlers
  const handleOpenReviewsModal = useCallback(() => {
    setOpenReviewsModal(true);
  }, []);

  const handleCloseReviewsModal = useCallback(() => {
    setOpenReviewsModal(false);
  }, []);

  // Memoize How It Works modal handlers
  const handleHowItWorksClick = useCallback((index: number) => {
    setOpenHowItWorksIndex(index);
  }, []);

  const handleCloseHowItWorksModal = useCallback(() => {
    setOpenHowItWorksIndex(null);
  }, []);

  useEffect(() => {
    const lenis = getLenis(); // Import this function

    if (openImpresaEdileDialog) {
      document.body.style.overflow = 'hidden';
      lenis?.stop(); // Stop Lenis
    } else {
      document.body.style.overflow = 'unset';
      lenis?.start(); // Restart Lenis
    }

    return () => {
      document.body.style.overflow = 'unset';
      lenis?.start();
    };
  }, [openImpresaEdileDialog]);

  const selectedBenefit = openBenefitIndex !== null ? BENEFITS_DATA[openBenefitIndex] : null;
  const selectedWhyChooseBenefit = openWhyChooseIndex !== null ? WHY_CHOOSE_BENEFITS_DATA[openWhyChooseIndex] : null;
  const selectedStep = openHowItWorksIndex !== null ? HOW_IT_WORKS_STEPS[openHowItWorksIndex] : null;

  return (
    <main className="min-h-screen relative overflow-hidden" itemScope itemType="https://schema.org/WebPage">
      <StructuredData />

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-4 lg:py-6" role="banner">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Retivita - Logo rete italiana consulenti assicurativi"
                width={280}
                height={96}
                quality={60}
                priority
                sizes="(max-width: 768px) 200px, 280px"
                className="w-40 h-auto mt-6 lg:mt-0"
                itemProp="logo"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* OAM Badge */}
              <a
                href="https://www.organismo-am.it/b/0/06197620963/F311BEF5-24B7-4A32-AB79-567598386DBC/g.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex flex-col gap-1 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500 leading-tight">Iscritti al registro</span>
                    <span className="text-sm font-bold text-slate-900 leading-tight">OAM M30</span>
                  </div>
                  <Image
                    src="https://www.organismo-am.it/b/0/c3f18c274847902265f07537ce366a8eJO5NMdSW1LRcd_pl_8_eq_/1.png"
                    alt="Retivita iscritto al registro OAM M30 - Organismo Agenti e Mediatori - Verifica autorizzazione"
                    width={44}
                    height={44}
                    quality={60}
                    loading="lazy"
                    className="w-11 h-11 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#090075] font-medium">
                  <span>Verifica in tempo reale</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-0 lg:pt-8 pb-20" itemScope itemType="https://schema.org/FinancialProduct">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Content */}
            <article className="space-y-8">

              {/* Main Headline */}
              <header className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-semibold lg:font-bold leading-[1.05] tracking-tight" itemProp="name">
                  <span className="block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                    La rete che fa{' '}
                    <span className="relative inline-block">
                      <span className="font-extrabold text-[#090075]">
                        crescere
                      </span>
                    </span>
                  </span>
                  <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                    il tuo business assicurativo.
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 font-light max-w-xl leading-relaxed" itemProp="description">
                  Prodotti esclusivi, alte provvigioni e supporto professionale. Unisciti a Retivita e porta la tua carriera assicurativa al livello successivo.
                </p>
              </header>
            </article>

            {/* Right: Form Card + Social Proof */}
            <div className="space-y-6">
              <FormSection />

              {/* Google Reviews Social Proof - Debajo del formulario */}
              <button
                onClick={handleOpenReviewsModal}
                className="inline-flex items-center gap-4 bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer text-left w-full"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
                    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
                  </svg>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {STAR_RATINGS.map((i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-tight">
                      <span className="font-bold text-slate-900">4.9/5</span> su Google
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Oltre 500 consulenti soddisfatti
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Retivita Section */}
      <section className="relative z-10 px-6 lg:px-12 py-10 lg:py-20" aria-labelledby="why-retivita-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-10 lg:mb-16">
            <h2 id="why-retivita-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Perché scegliere Retivita?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              La rete di distribuzione assicurativa progettata per i professionisti ambiziosi.
            </p>
          </header>

          {/* 3 Benefit Cards originales de Hero movidas aquí */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {BENEFITS_DATA.map((benefit, idx) => (
              <button
                key={idx}
                onClick={() => handleBenefitClick(idx)}
                className="flex flex-col items-start gap-3 p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg cursor-pointer text-left w-full"
              >
                <div className={`flex-shrink-0 w-12 h-12 ${benefit.color === 'blue' ? 'bg-blue-100' :
                  benefit.color === 'green' ? 'bg-green-100' :
                    benefit.color === 'indigo' ? 'bg-indigo-100' :
                      'bg-amber-100'
                  } rounded-xl flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${benefit.color === 'blue' ? 'text-blue-600' :
                    benefit.color === 'green' ? 'text-green-600' :
                      benefit.color === 'indigo' ? 'text-indigo-600' :
                        'text-amber-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {WHY_CHOOSE_BENEFITS_DATA.map((benefit, idx) => (
              <button
                key={idx}
                onClick={() => handleWhyChooseClick(idx)}
                className={`group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 ${benefit.color === 'blue' ? 'hover:border-blue-200' :
                  benefit.color === 'green' ? 'hover:border-emerald-200' :
                    'hover:border-amber-200'
                  } text-left w-full cursor-pointer`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/50" aria-labelledby="how-it-works-heading" itemScope itemType="https://schema.org/HowTo">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <h2 id="how-it-works-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4" itemProp="name">
              Come entrare nella rete
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" itemProp="description">
              Un percorso semplice, veloce e completamente gratuito.
            </p>
          </header>

              {/* Trust Image */}
          <div className="max-w-xl mx-auto">
            <Image
              src="/img3.png"
              alt="Come entrare nella rete Retivita - Processo in 3 semplici passaggi per consulenti assicurativi"
              width={600}
              height={300}
              quality={60}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleHowItWorksClick(idx)}
                className="relative group text-left w-full"
                itemScope
                itemType="https://schema.org/HowToStep"
                itemProp="step"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white" itemProp="position">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3" itemProp="name">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed" itemProp="text">
                    {step.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Image */}
            <div className="relative lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/img2.png"
                  alt="Consulente assicurativo Retivita - Cresce il business con la rete"
                  width={800}
                  height={600}
                  quality={60}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto object-cover select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
                />
              </div>
            </div>

            {/* Right: CTA Content */}
            <div className="lg:order-2">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 rounded-3xl p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-white bg-white/20 px-4 py-2 rounded-full mb-6">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>Pronto a crescere?</span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                    Non lasciare che altri occupino il tuo mercato.
                  </h2>
                  <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
                    Unisciti ai consulenti che hanno già scelto Retivita per far crescere il loro business assicurativo. Candidati oggi, gratuitamente.
                  </p>
                  <Button
                    onClick={scrollToForm}
                    className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Parla con un responsabile ora
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/20">
                    <div>
                      <div className="text-3xl font-bold text-white">+500</div>
                      <div className="text-sm text-blue-100">Consulenti attivi nella rete</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">24h</div>
                      <div className="text-sm text-blue-100">Tempo medio di risposta</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Partnerships Section */}
      {false && (
        <section className="relative z-10 px-6 lg:px-12 py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30" aria-labelledby="bank-partnerships-heading">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-12">
              <h2 id="bank-partnerships-heading" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Le nostre convenzioni bancarie
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Collaboriamo con i primari partner sul mercato per garantirti tassi competitivi e tempi rapidi
              </p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Banca Sistema */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/79/Banca_Sistema_logo.svg"
                  alt="Compagnia assicurativa partner Retivita"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Capital Fin */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
                <Image
                  src="https://www.bancaifis.it/app/uploads/2025/03/CAPITALFIN_Logo_Footer_Blu.svg"
                  alt="Compagnia assicurativa partner Retivita"
                  width={260}
                  height={104}
                  className="w-full h-auto max-h-[5.5rem] object-contain grayscale group-hover:grayscale-0 transition-all duration-300 mt-4 ml-2"
                  loading="lazy"
                />
              </div>

              {/* Fincontinuo */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
                <Image
                  src="https://www.fincontinuo.com/hubfs/fincontinuo-logo.svg"
                  alt="Compagnia assicurativa partner Retivita"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Bank Logo 4 */}
              <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px]">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ68VRQtS9RBsKX4NXmQNzByi5hqhEGf7vc1w&s"
                  alt="Compagnia assicurativa partner Retivita"
                  width={200}
                  height={80}
                  className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Last 3 logos - centered */}
              <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-wrap justify-center gap-6 lg:gap-8">
                {/* Bank Logo 5 */}
                <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_zu4rkVrkobpR88917ZnpI4RPD3zz3tXRw&s"
                    alt="Compagnia assicurativa partner Retivita"
                    width={200}
                    height={80}
                    className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>

                {/* IBL Banca */}
                <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                  <Image
                    src="https://thebanks.eu/img/logos/IBL_Banca.png"
                    alt="Compagnia assicurativa partner Retivita"
                    width={200}
                    height={80}
                    className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Bank Logo 7 */}
                <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 flex items-center justify-center min-h-[120px] w-full sm:w-auto sm:min-w-[200px]">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3zTLQW74Q-2PPo5vC0p0tkJ_xOYRUJUbDiA&s"
                    alt="Compagnia assicurativa partner Retivita"
                    width={200}
                    height={80}
                    className="w-full h-auto max-h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Compagnie assicurative certificate</span> - Garantiamo prodotti sicuri e competitivi
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">
            <div className="relative flex flex-col items-start gap-3 lg:gap-4 bg-[#151E3B] rounded-t-2xl rounded-b-none lg:rounded-2xl lg:rounded-r-none shadow-lg p-10 sm:p-8 lg:p-10 w-full">
              <header className="text-left mb-12">
                <h2 className="text-2xl lg:text-5xl font-bold mb-4" style={{ color: '#CEE5FD' }}>
                  Sei un'Agenzia o un Broker? Amplia la tua rete di distribuzione
                </h2>
                <p className="text-lg max-w-2xl mx-auto mt-8" style={{ color: '#CEE5FD' }}>
                  Offri ai tuoi sub-agenti l'accesso ai migliori prodotti assicurativi del mercato. Diventa partner di Retivita e aumenta la tua produzione senza limiti.
                </p>
              </header>
              <div className="lg:absolute lg:bottom-12 lg:left-10">
                <Dialog open={openImpresaEdileDialog} onOpenChange={setOpenImpresaEdileDialog} modal={true}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-[#151E3B] hover:bg-blue-50 h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                      Diventa Partner Retivita
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-90 slide-in-from-bottom-4 duration-500">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold">Diventa Partner Retivita</DialogTitle>
                      <DialogDescription className="text-base">
                        Unisciti alla nostra rete di agenzie partner. Ti aiuteremo a offrire ai tuoi consulenti i migliori prodotti assicurativi del mercato, con provvigioni competitive e supporto completo.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4 mt-4" onSubmit={(e) => {
                      e.preventDefault();
                      console.log('Form submitted');
                      setOpenImpresaEdileDialog(false);
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="company-name" className="block text-sm font-medium text-slate-700 mb-1">
                            Nome Agenzia / Broker
                          </label>
                          <input
                            id="company-name"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            placeholder="Nome Agenzia"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-person" className="block text-sm font-medium text-slate-700 mb-1">
                            Nome e Cognome Referente
                          </label>
                          <input
                            id="contact-person"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            placeholder="Nome e Cognome"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                              Email
                            </label>
                            <input
                              id="email"
                              type="email"
                              required
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                              placeholder="info@azienda.it"
                            />
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                              Telefono
                            </label>
                            <input
                              id="phone"
                              type="tel"
                              required
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                              placeholder="+39 333 1234567"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpenImpresaEdileDialog(false)}
                          className="flex-1 cursor-pointer"
                        >
                          Anulla
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-[#090075] hover:bg-[#151E3B] cursor-pointer"
                        >
                          Invia Richiesta
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="relative h-[500px] max-w-[600px] rounded-t-none rounded-b-2xl lg:rounded-l-none lg:rounded-r-2xl overflow-hidden">
              <img
                src="/impresa_edile.png"
                alt="Agenzia Assicurativa - Partnership Retivita"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 overflow-hidden" aria-labelledby="faq-heading" itemScope itemType="https://schema.org/FAQPage">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <h2 id="faq-heading" className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Domande Frequenti
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tutto quello che devi sapere per entrare nella rete Retivita.
            </p>
          </header>

          {/* FAQ Grid */}
          <div className="grid gap-4 lg:gap-5">
            {FAQ_ITEMS.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFaqIndex === index}
                onToggle={() => handleFaqToggle(index)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center px-4 sm:px-0">
            <div className="flex flex-col items-center gap-3 lg:gap-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-10 sm:p-8 lg:p-10 w-full max-w-lg mx-auto">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                  Hai altre domande?
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  I nostri responsabili di rete sono pronti a risponderti. Nessun impegno, candidatura gratuita.
                </p>
                <Button
                  onClick={scrollToForm}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Candidati gratuitamente
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-6">
              <Image
                src="https://creditplan.it/wp-content/uploads/2023/02/LOGO-CREDITPLAN.png"
                alt="Retivita - Rete Italiana di Consulenti Assicurativi"
                width={280}
                height={96}
                quality={60}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-auto h-8 select-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
              />
              <p className="text-sm text-slate-600 text-center md:text-left" itemProp="copyrightHolder">
                © 2025 Retivita — Rete Italiana di Consulenti Assicurativi. Tutti i diritti riservati.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a
                href="https://creditplan.it/wp-content/uploads/2023/04/Informativa-privacy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="https://creditplan.it/trasparenza/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Trasparenza
              </a>
            </div>
          </div>

          {/* Designer Credit */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Designed and developed by Matias Galliani
            </p>
          </div>
        </div>
      </footer>

      {/* Benefit Modal */}
      <BenefitModal
        isOpen={openBenefitIndex !== null}
        onClose={handleCloseBenefitModal}
        benefit={selectedBenefit}
      />

      {/* Why Choose Modal */}
      <WhyChooseModal
        isOpen={openWhyChooseIndex !== null}
        onClose={handleCloseWhyChooseModal}
        benefit={selectedWhyChooseBenefit}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={openReviewsModal}
        onClose={handleCloseReviewsModal}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={openHowItWorksIndex !== null}
        onClose={handleCloseHowItWorksModal}
        step={selectedStep}
      />

    </main>
  );
}
