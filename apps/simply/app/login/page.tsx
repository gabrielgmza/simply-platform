"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { Button, CardElevated, FormField, Input, useSession } from "@simply/ui";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error iniciando sesión");
      login({
        customerId: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      router.push("/destinatario");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <Mail className="w-6 h-6 text-accent-400" />
        </div>
        <h1 className="text-2xl font-semibold">Identificate</h1>
        <p className="text-sm text-white/60">Solo tu email para guardar la operación.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <CardElevated className="space-y-4">
          <FormField label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoFocus
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nombre">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </FormField>
            <FormField label="Apellido">
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </FormField>
          </div>
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {error}
            </div>
          )}
          <Button
            type="submit"
            loading={loading}
            disabled={!email || !firstName || !lastName}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Continuar
          </Button>
        </CardElevated>
      </form>
    </div>
  );
}
