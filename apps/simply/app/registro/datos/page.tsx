"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User } from "lucide-react";
import {
  Button,
  CardElevated,
  FormField,
  Input,
  Select,
  useSession,
} from "@simply/ui";
import { COUNTRIES, getCountryByCode, getDocumentType } from "@/lib/countries";

export default function RegistroDatosPage() {
  const router = useRouter();
  const { session, loaded, update } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("AR");
  const [documentType, setDocumentType] = useState("DNI");
  const [documentNumber, setDocumentNumber] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+54");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si no hay sesión, mandar a registro desde cero
  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.replace("/registro");
      return;
    }
    // Pre-llenar con datos previos si existen
    const s = session as any;
    if (s.firstName) setFirstName(s.firstName);
    if (s.lastName) setLastName(s.lastName);
    if (s.country) setCountry(s.country);
  }, [loaded, session, router]);

  // Cuando cambia el país, ajustar tipo de doc default y código de teléfono
  const countryData = useMemo(() => getCountryByCode(country), [country]);
  useEffect(() => {
    if (!countryData) return;
    const firstDoc = countryData.documentTypes[0];
    if (firstDoc) setDocumentType(firstDoc.code);
    setPhoneCountryCode(countryData.phoneCode);
    setDocumentNumber("");
  }, [country, countryData]);

  // Validación cliente del documento
  const docTypeData = useMemo(
    () => getDocumentType(country, documentType),
    [country, documentType],
  );
  const documentValid = useMemo(() => {
    if (!documentNumber) return false;
    if (!docTypeData?.pattern) return documentNumber.length >= 4;
    return docTypeData.pattern.test(documentNumber.trim());
  }, [documentNumber, docTypeData]);

  const phoneValid = phone.replace(/\D/g, "").length >= 6;
  const formValid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    documentValid &&
    phoneValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid || !session) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/update-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: (session as any).customerId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          country,
          documentType,
          documentNumber: documentNumber.trim(),
          phoneCountryCode,
          phone: phone.replace(/\D/g, ""),
          profileStatus: "REGISTERED",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error guardando datos");

      update({
        firstName: data.firstName,
        lastName: data.lastName,
        profileStatus: data.profileStatus,
      } as any);

      router.push("/registro/dni");
    } catch (e: any) {
      setError(typeof e.message === "string" ? e.message : "Error guardando datos");
    } finally {
      setLoading(false);
    }
  }

  if (!loaded || !session) {
    return <div className="text-center py-12 text-white/60">Cargando...</div>;
  }

  return (
    <div className="space-y-6 animate-page-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <User className="w-6 h-6 text-accent-400" />
        </div>
        <h1 className="text-2xl font-semibold">Datos personales</h1>
        <p className="text-sm text-white/60">
          Tu identidad y país. El resto lo extraemos del documento en el siguiente paso.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <CardElevated className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nombre">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Juan"
                required
                autoFocus
              />
            </FormField>
            <FormField label="Apellido">
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pérez"
                required
              />
            </FormField>
          </div>

          <FormField label="País de residencia">
            <Select value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Tipo de documento">
            <Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              {countryData?.documentTypes.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Número de documento">
            <Input
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
              placeholder={docTypeData?.placeholder || ""}
              required
            />
            {documentNumber && !documentValid && (
              <p className="text-xs text-amber-300/80 mt-1">
                Verificá el formato. Esperado: {docTypeData?.placeholder}
              </p>
            )}
          </FormField>

          <FormField label="Teléfono">
            <div className="flex gap-2">
              <Select
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                className="!w-28"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.phoneCode}>
                    {c.flag} {c.phoneCode}
                  </option>
                ))}
              </Select>
              <Input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ""))}
                placeholder="11 1234 5678"
                className="flex-1"
                required
              />
            </div>
          </FormField>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={!formValid}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Continuar
          </Button>

          <p className="text-xs text-white/40 text-center">
            Tu información está cifrada y solo se usa para verificación.
          </p>
        </CardElevated>
      </form>
    </div>
  );
}
