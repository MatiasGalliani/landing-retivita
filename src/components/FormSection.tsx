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
});

export function FormSection() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      mail: "",
      telefono: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const payload = {
        nome: values.nome,
        cognome: values.cognome,
        mail: values.mail,
        telefono: values.telefono,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch('https://accelera-crm-production.up.railway.app/api/leads/retivita', {
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
              Candidati alla Rete
            </CardTitle>
            <p className="text-sm lg:text-base text-slate-600">
              Compila il form per essere contattato da un responsabile
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#090075] hover:bg-[#0a0090] text-white font-bold text-lg cursor-pointer"
              >
                {isLoading ? "Invio in corso..." : "Invia la Candidatura →"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
