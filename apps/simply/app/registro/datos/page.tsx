"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User, AlertCircle } from "lucide-react";
import {
  Button,
  CardElevated,
  FormField,
  Input,
  Select,
  useSession,
} from "@simply/ui";
import Stepper from "@/components/registro/Stepper";
import { COUNTRIES, getCountryByCode, getDocumentType } from "@/lib/countries";

interface Errors {
  firstName?: string;
  lastName?: string;
  documentNumber?: string;
  phone?: string;
  general?: string;
}

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
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.replace("/registro");
      return;
    }
    const s = session as any;
    if (s.firstName) setFirstName(s.firstName);
    if (s.lastName) setLastName(s.lastName);
    if (s.country) setCountry(s.country);
    if (s.phoneCountryCode) setPhoneCountryCode(s.phoneCountryCode);
    if (s.phone) setPhone(s.phone);
  }, [loaded, session, router]);

  const countryData = useMemo(() => getCountryByCode(country), [country]);
  useEffect(() => {
    if (!countryData) return;
    const firstDoc = countryData.documentTypes[0];
    if (firstDoc) setDocumentType(firstDoc.code);
    setPhoneCountryCode(countryData.phoneCode);
    setDocumentNumber("");
  }, [country, countryData]);

  const docTypeData = useMemo(
    () => getDocumentType(country, documentType),
    [country, documentType],
  );

  function validate(): Errors {
    const e: Errors = {};
    if (firstName.trim().length < 2) e.firstName = "Mínimo 2 caracteres";
    if (lastName.trim().length < 2) e.lastName = "Mínimo 2 caracteres";

    const docNum = documentNumber.trim();
    if (!docNum) {
      e.documentNumber = "Requerido";
    } else if (docTypeData?.pattern && !docTypeData.pattern.test(docNum)) {
      e.documentNumber = `Formato esperado: ${docTypeData.placeholder}`;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      e.phone = "Requerido";
    } else if (cleanPhone.length < 6) {
      e.phone = "Mínimo 6 dígitos";
    } else if (cleanPhone.length > 15) {
      e.phone = "Máximo 15 dígitos";
    }

    return e;
  }

  // Validación en vivo solo de campos tocados
  useEffect(() => {
    const e = validate();
    setErrors(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName, documentNumber, phone, country, documentType]);

  const allValid = Object.keys(validate()).length === 0;

  function markTouched(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      documentNumber: true,
      phone: true,
    });
    const e2 = validate();
    setErrors(e2);
    if (!allValid || !session) return;

    setLoading(true);
    try {
      // 1. Validar phone único
      const cleanPhone = phone.replace(/\D/g, "");
      const checkRes = await fetch("/api/auth/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneCountryCode, phone: cleanPhone }),
      });
      const checkData = await checkRes.json();

      if (checkData.exists) {
        const myId = (session as any).customerId;
        if (checkData.customer.id !== myId) {
          setErrors({ phone: `Este teléfono ya está registrado en otra cuenta (${checkData.customer.emailMasked})` });
          setLoading(false);
          return;
        }
      }

      // 2. Validar documento único (ya existía pero lo aseguramos)
      const docCheck = await fetch("/api/auth/check-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          documentType,
          documentNumber: documentNumber.trim(),
        }),
      });
      const docData = await docCheck.json();
      if (docData.exists) {
        const myId = (session as any).customerId;
        if (docData.customer.id !== myId && !docData.customer.emailIsFake) {
          setErrors({
            general: `Este documento ya tiene una cuenta verificada (${docData.customer.emailMasked}). Si es tuya, contactanos para recuperarla.`,
          });
          setLoading(false);
          return;
        }
      }

      // 3. Update customer
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
          phone: cleanPhone,
          profileStatus: "REGISTERED",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error guardando datos");

      update({
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        phone: data.phone,
        phoneCountryCode: data.phoneCountryCode,
        profileStatus: data.profileStatus,
      } as any);

      router.push("/registro/dni");
    } catch (e: any) {
      setErrors({ general: typeof e.message === "string" ? e.message : "Error guardando datos" });
    } finally {
      setLoading(false);
    }
  }

  if (!loaded || !session) {
    return <div className="text-center py-12 text-white/60">Cargando...</div>;
  }

  return (
    <div className="space-y-7 animate-page-in">
      <Stepper current="datos" />

      <div className="text-center space-y-3">
        <div className="wizard-icon-bubble">
          <User className="w-6 h-6 text-blue-300" />
        </div>
        <h1 className="wizard-title">Datos personales</h1>
        <p className="wizard-subtitle">
          Tu identidad y país. El resto lo extraemos del documento en el siguiente paso.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <CardElevated className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nombre">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => markTouched("firstName")}
                placeholder="Juan"
                autoFocus
              />
              {touched.firstName && errors.firstName && (
                <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
              )}
            </FormField>
            <FormField label="Apellido">
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => markTouched("lastName")}
                placeholder="Pérez"
              />
              {touched.lastName && errors.lastName && (
                <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>
              )}
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
              onBlur={() => markTouched("documentNumber")}
              placeholder={docTypeData?.placeholder || ""}
              inputMode={docTypeData?.code && /^\d+$/.test(docTypeData.placeholder.replace(/\D/g, "")) ? "numeric" : "text"}
            />
            {touched.documentNumber && errors.documentNumber && (
              <p className="text-xs text-red-400 mt-1">{errors.documentNumber}</p>
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
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                onBlur={() => markTouched("phone")}
                placeholder="1112345678"
                className="flex-1"
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
            )}
          </FormField>

          {errors.general && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={!allValid}
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
