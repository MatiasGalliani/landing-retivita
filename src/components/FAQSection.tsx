"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Devo avere già un portafoglio clienti per entrare nella rete?",
    answer: "No, accettiamo sia consulenti con esperienza pluriennale che professionisti alle prime armi. Offriamo un percorso di formazione e affiancamento personalizzato per aiutarti a costruire il tuo portafoglio fin da subito."
  },
  {
    question: "È necessario essere iscritti al RUI per collaborare con Retivita?",
    answer: "Sì, è necessario essere iscritti al Registro Unico degli Intermediari (RUI) tenuto dall'IVASS. Se non sei ancora iscritto, il nostro team ti supporterà nell'intero processo di iscrizione."
  },
  {
    question: "Quanto posso guadagnare come consulente nella rete Retivita?",
    answer: "Il piano provvigionale è tra i più competitivi del mercato, con percentuali crescenti al crescere del volume di premi collocati e bonus produzione."
  },
  {
    question: "Quali prodotti assicurativi posso collocare?",
    answer: "Avrai accesso a vita, previdenza integrativa, protezione reddito, TCM, polizze danni e soluzioni per aziende. Collaboriamo con le principali compagnie italiane."
  },
  {
    question: "Esistono costi di iscrizione alla rete?",
    answer: "No, l'adesione a Retivita è completamente gratuita. Nessun costo di iscrizione e nessuna fee mensile. Guadagni dalla prima polizza collocata."
  },
  {
    question: "Cosa succede se non ho ancora esperienza nel settore assicurativo?",
    answer: "Nessun problema. Offriamo un percorso di onboarding completo con formazione certificata, affiancamento e tutto il materiale necessario per iniziare a lavorare da subito."
  },
  {
    question: "Perché dovrei scegliere Retivita rispetto ad altre reti?",
    answer: "Retivita offre un piano provvigionale competitivo, un ampio catalogo prodotti, formazione continua e strumenti digitali avanzati. Con oltre 500 consulenti attivi, siamo la scelta di chi vuole crescere nel settore assicurativo."
  },
  {
    question: "Posso aderire alla rete se lavoro già come agente per un'altra compagnia?",
    answer: "Ogni situazione viene valutata individualmente. Contattaci per una consulenza gratuita e analizzeremo insieme le opzioni più adatte al tuo profilo e ai tuoi impegni contrattuali attuali."
  },
  {
    question: "È possibile lavorare in modo indipendente pur facendo parte della rete?",
    answer: "Sì, i nostri consulenti mantengono piena autonomia nella gestione del proprio lavoro e portafoglio. Retivita ti fornisce gli strumenti e il supporto, tu scegli come e quando lavorare."
  },
  {
    question: "Quanto tempo ci vuole per iniziare a produrre dopo l'adesione?",
    answer: "Il processo di onboarding è rapido. Dopo la formalizzazione della collaborazione, accedi immediatamente alla piattaforma formativa e al catalogo prodotti. La maggior parte dei nostri consulenti inizia a collocare polizze già nella prima settimana."
  }
];

export function FAQSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Domande Frequenti
          </h2>
          <p className="text-xl text-slate-600">
            Tutto quello che devi sapere per entrare nella rete Retivita
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 group"
              >
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors pr-8">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-slate-600 leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

