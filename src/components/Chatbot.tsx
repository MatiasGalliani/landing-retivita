'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { DialogTitle } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: 'Ciao! Sono il tuo assistente digitale di Retivita. Come posso aiutarti a scoprire le opportunità della nostra rete di consulenti assicurativi?',
  sender: 'bot',
  timestamp: new Date(),
};

const QUICK_REPLIES = [
  "Come funziona la rete Retivita?",
  'Quali prodotti posso collocare?',
  'Come funziona il piano provvigionale?',
  'Devo essere già iscritto al RUI?',
  'C\'è un costo per aderire alla rete?',
  'Che tipo di formazione offrite?',
  'Perché scegliere Retivita?',
  'Posso aderire se non ho esperienza?',
  'Come avvengono i pagamenti delle provvigioni?',
  'Quanto tempo ci vuole per iniziare?'
] as const;

const QUICK_REPLIES_PAGE_SIZE = 5;
const QUICK_REPLIES_TOTAL_PAGES = Math.ceil(
  QUICK_REPLIES.length / QUICK_REPLIES_PAGE_SIZE
);

const PREDEFINED_RESPONSES: Record<typeof QUICK_REPLIES[number], string> = {
  "Come funziona la rete Retivita?":
    "Retivita è una rete di distribuzione assicurativa che ti permette di collocare prodotti delle migliori compagnie italiane. Accedi a un catalogo ampio, a provvigioni competitive, formazione continua e supporto commerciale dedicato. Puoi lavorare in piena autonomia.",
  'Quali prodotti posso collocare?':
    "Avrai accesso a vita, previdenza integrativa, TCM, protezione reddito, polizze danni e soluzioni per aziende. Collaboriamo con le principali compagnie del mercato italiano per garantirti sempre i prodotti più competitivi.",
  'Come funziona il piano provvigionale?':
    "Il piano provvigionale è tra i più competitivi del mercato, con percentuali crescenti al crescere del volume di premi collocati. Include bonus al raggiungimento degli obiettivi e provvigioni ricorrenti sul portafoglio clienti acquisito.",
  'Devo essere già iscritto al RUI?':
    "Sì, è necessario essere iscritti al Registro Unico degli Intermediari (RUI) tenuto dall'IVASS. Se non sei ancora iscritto, il nostro team ti supporterà nell'intero processo di iscrizione, rendendolo semplice e veloce.",
  'C\'è un costo per aderire alla rete?':
    "No, l'adesione a Retivita è completamente gratuita. Nessun costo di iscrizione e nessuna fee mensile. Inizi a guadagnare dalla prima polizza collocata, senza costi fissi.",
  'Che tipo di formazione offrite?':
    "Mettiamo a disposizione una piattaforma di e-learning sempre aggiornata, webinar settimanali con esperti del settore, materiale commerciale professionale e affiancamento da professionisti esperti. Investiamo nella tua crescita professionale.",
  'Perché scegliere Retivita?':
    "Retivita offre provvigioni competitive, un ampio catalogo prodotti, formazione certificata, strumenti digitali avanzati (CRM, firma digitale) e un supporto commerciale dedicato. Con oltre 500 consulenti attivi, siamo la rete di chi vuole crescere nel settore assicurativo.",
  'Posso aderire se non ho esperienza?':
    "Assolutamente sì! Accettiamo anche professionisti alle prime armi. Offriamo un percorso di formazione completo e un affiancamento personalizzato per aiutarti a costruire il tuo portafoglio fin da subito.",
  'Come avvengono i pagamenti delle provvigioni?':
    "Le provvigioni vengono liquidate rapidamente e hai accesso in tempo reale al tuo estratto conto provvigionale tramite il nostro CRM. I pagamenti sono puntuali e trasparenti.",
  'Quanto tempo ci vuole per iniziare?':
    "Il processo è veloce! Dopo la candidatura, un nostro responsabile ti contatta entro 24 ore. L'onboarding è rapido e la maggior parte dei consulenti inizia a collocare polizze già nella prima settimana."
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickRepliesPage, setQuickRepliesPage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (userText: string): string => {
    if (PREDEFINED_RESPONSES[userText as typeof QUICK_REPLIES[number]]) {
      return PREDEFINED_RESPONSES[userText as typeof QUICK_REPLIES[number]];
    }

    const lowerText = userText.toLowerCase();

    if (lowerText.includes('guadagn') || lowerText.includes('provvigion') || lowerText.includes('quanto posso')) {
      return 'Il piano provvigionale di Retivita è tra i più competitivi del mercato assicurativo. Le percentuali crescono al crescere del volume prodotto e incluono bonus e provvigioni ricorrenti sul portafoglio. Candidati per ricevere i dettagli!';
    }

    if (lowerText.includes('requisiti') || lowerText.includes('condizioni') || lowerText.includes('rui') || lowerText.includes('ivass')) {
      return 'Il requisito principale è l\'iscrizione al RUI (Registro Unico degli Intermediari) tenuto dall\'IVASS. Se non sei ancora iscritto, ti aiutiamo noi nell\'iter di iscrizione. Vuoi candidarti?';
    }

    if (lowerText.includes('tempo') || lowerText.includes('quanto ci vuole') || lowerText.includes('veloce') || lowerText.includes('iniziare')) {
      return 'Il processo è veloce! Dopo la candidatura ti contattiamo entro 24 ore. L\'onboarding è rapido e la maggior parte dei consulenti inizia a collocare polizze già nella prima settimana.';
    }

    if (lowerText.includes('responsabile') || lowerText.includes('parlare') || lowerText.includes('chiamare') || lowerText.includes('contatto')) {
      return 'Perfetto! Un nostro responsabile di rete sarà felice di aiutarti. Compila il form sulla pagina con i tuoi dati e ti contatteremo entro 24 ore, senza impegno!';
    }

    if (lowerText.includes('costo') || lowerText.includes('quanto costa') || lowerText.includes('gratuito')) {
      return 'L\'adesione a Retivita è completamente gratuita! Nessun costo di iscrizione, nessuna fee mensile. Inizi a guadagnare dalla prima polizza collocata, senza costi fissi.';
    }

    if (lowerText.includes('prodotti') || lowerText.includes('polizze') || lowerText.includes('assicurazioni')) {
      return 'Con Retivita puoi collocare vita, previdenza integrativa, TCM, protezione reddito, polizze danni e soluzioni per aziende. Collaboriamo con le principali compagnie italiane per offrirti sempre i prodotti più competitivi.';
    }

    if (lowerText.includes('ciao') || lowerText.includes('salve') || lowerText.includes('buongiorno') || lowerText.includes('buonasera')) {
      return 'Ciao! 👋 Sono qui per aiutarti a scoprire le opportunità della rete Retivita. Cosa vorresti sapere?';
    }

    if (lowerText.includes('grazie')) {
      return 'Figurati! Sono qui per questo. C\'è altro che posso fare per te?';
    }

    // Default response
    return 'Grazie per la tua domanda! Per una risposta precisa e personalizzata, ti consiglio di parlare con un nostro responsabile di rete. Compila il form sulla pagina e ti contatteremo subito, oppure continua a farmi domande!';
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-blue-100">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-center">
          <VisuallyHidden.Root>
            <DialogTitle>Chat con un responsabile Retivita</DialogTitle>
          </VisuallyHidden.Root>
          <Image
            src="https://creditplan.it/wp-content/uploads/2025/10/Eugenio.svg"
            alt="Eugenio"
            width={100}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <span
                className={`text-xs mt-1 block ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} - {message.timestamp.toLocaleDateString('it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 bg-white border-t border-slate-100">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${quickRepliesPage * 100}%)` }}
          >
            {Array.from({ length: QUICK_REPLIES_TOTAL_PAGES }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                className="min-w-full flex flex-wrap gap-2"
              >
                {QUICK_REPLIES.slice(
                  pageIndex * QUICK_REPLIES_PAGE_SIZE,
                  pageIndex * QUICK_REPLIES_PAGE_SIZE + QUICK_REPLIES_PAGE_SIZE
                ).map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    disabled={isTyping}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors duration-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        {QUICK_REPLIES_TOTAL_PAGES > 1 && (
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={() =>
                setQuickRepliesPage(prev => (prev + 1) % QUICK_REPLIES_TOTAL_PAGES)
              }
              disabled={isTyping}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:via-indigo-700 px-5 py-2 rounded-full shadow-lg shadow-blue-500/40 transition-transform duration-200 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label={quickRepliesPage === QUICK_REPLIES_TOTAL_PAGES - 1 ? 'Mostra le prime domande' : 'Mostra altre domande'}
            >
              <span>
                {quickRepliesPage === QUICK_REPLIES_TOTAL_PAGES - 1
                  ? 'Torna alle prime domande'
                  : 'Scopri altre domande'}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${quickRepliesPage === QUICK_REPLIES_TOTAL_PAGES - 1 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

