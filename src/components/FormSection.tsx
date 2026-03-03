"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nome: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  cognome: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
  mail: z.string().email("Inserisci un indirizzo email valido"),
  telefono: z.string().min(10, "Il numero di telefono deve contenere almeno 10 cifre"),
  impiego: z.string().min(1, "Seleziona il tuo ruolo attuale"),
  nettoMensile: z.string().min(1, "Inserisci gli anni di esperienza nel settore").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Inserisci un valore valido"
  ),
  importoRichiesto: z.string().min(1, "Inserisci il volume premi stimato").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Inserisci un importo valido"
  ),
});

const IMPIEGO_OPTIONS = [
  "Agente monomandatario",
  "Agente plurimandatario",
  "Broker assicurativo",
  "Consulente finanziario / promotore",
  "Sub-agente",
  "Nessuna esperienza nel settore",
] as const;

export function FormSection() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      mail: "",
      telefono: "",
      impiego: "",
      nettoMensile: "",
      importoRichiesto: "",
    },
  });

  const onNext = async () => {
    const isValid = await form.trigger(['nome', 'cognome', 'mail', 'telefono']);
    if (isValid) {
      setCurrentStep(2);
      setSubmitError(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const payload = {
        nome: values.nome,
        cognome: values.cognome,
        mail: values.mail,
        telefono: values.telefono,
        impiego: values.impiego,
        nettoMensile: Number(values.nettoMensile),
        importoRichiesto: Number(values.importoRichiesto),
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/forms/quinto-pensionati-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Errore sconosciuto' }));
        throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);

      setIsLoading(false);
      router.push("/grazie");
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Si è verificato un errore durante l\'invio del form. Riprova più tardi.';
      setSubmitError(errorMessage);
    }
  };

  return (
    <div className="relative" id="form-section">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-10"></div>
      <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-[#090075]"></div>
        <CardHeader className="space-y-3 pb-6">
          <div className="text-center">
            <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
              {currentStep === 1 ? "Candidati alla Rete" : "Ultimo passaggio"}
            </CardTitle>
            <p className="text-sm lg:text-base text-slate-600">
              {currentStep === 1
                ? "Compila il form per essere contattato da un responsabile"
                : "Dimmi di più sulla tua esperienza nel settore"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-6">
          {/* Error Message */}
          {submitError && !isLoading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Errore nell'invio</p>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
                <button
                  onClick={() => setSubmitError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                  aria-label="Chiudi errore"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <Form {...form}>
            {currentStep === 1 ? (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Inserisci il tuo nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cognome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cognome</FormLabel>
                      <FormControl>
                        <Input placeholder="Inserisci il tuo cognome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Inserisci la tua email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Inserisci il tuo telefono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={onNext}
                  className="w-full h-12 bg-[#090075] hover:bg-[#0a0090] text-white font-bold text-lg cursor-pointer"
                >
                  Procedi con la Candidatura →
                </Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="impiego"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ruolo attuale</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Seleziona il tuo ruolo</option>
                          {IMPIEGO_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nettoMensile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anni di esperienza nel settore</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Es. 5"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="importoRichiesto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume premi annuo stimato (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Es. 50000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    Indietro
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg"
                  >
                    {isLoading ? "Invio in corso..." : "Invia la Candidatura →"}
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
