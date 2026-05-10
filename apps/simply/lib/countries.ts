/**
 * Top 20 países LatAm + UE + USA con sus tipos de documento aceptados.
 * El primer documentType del array es el default sugerido para ese país.
 */

export interface CountryOption {
  code: string;        // ISO 3166-1 alpha-2
  name: string;
  flag: string;
  phoneCode: string;   // E.164 country calling code
  documentTypes: DocumentTypeOption[];
}

export interface DocumentTypeOption {
  code: string;
  name: string;
  /** Pista de formato para mostrar en el placeholder del input */
  placeholder: string;
  /** Regex de validación cliente (no estricto, backend valida final) */
  pattern?: RegExp;
}

const PASSPORT: DocumentTypeOption = {
  code: 'PASSPORT',
  name: 'Pasaporte',
  placeholder: 'Ej: AB1234567',
  pattern: /^[A-Z0-9]{5,15}$/i,
};

export const COUNTRIES: CountryOption[] = [
  // ─── LatAm ───
  {
    code: 'AR', name: 'Argentina', flag: '🇦🇷', phoneCode: '+54',
    documentTypes: [
      { code: 'DNI',  name: 'DNI',  placeholder: '12345678',     pattern: /^\d{7,8}$/ },
      { code: 'CUIT', name: 'CUIT', placeholder: '20123456789',  pattern: /^\d{11}$/ },
      PASSPORT,
    ],
  },
  {
    code: 'BR', name: 'Brasil', flag: '🇧🇷', phoneCode: '+55',
    documentTypes: [
      { code: 'CPF',  name: 'CPF',  placeholder: '123.456.789-00', pattern: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/ },
      { code: 'CNPJ', name: 'CNPJ', placeholder: '12.345.678/0001-90', pattern: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/ },
      PASSPORT,
    ],
  },
  {
    code: 'CL', name: 'Chile', flag: '🇨🇱', phoneCode: '+56',
    documentTypes: [
      { code: 'RUT', name: 'RUT', placeholder: '12.345.678-9', pattern: /^\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]$/ },
      PASSPORT,
    ],
  },
  {
    code: 'CO', name: 'Colombia', flag: '🇨🇴', phoneCode: '+57',
    documentTypes: [
      { code: 'CC', name: 'Cédula de ciudadanía', placeholder: '1234567890', pattern: /^\d{6,12}$/ },
      { code: 'CE', name: 'Cédula de extranjería', placeholder: '1234567', pattern: /^\d{6,10}$/ },
      { code: 'NIT', name: 'NIT', placeholder: '900123456-7', pattern: /^\d{8,15}-?\d?$/ },
      PASSPORT,
    ],
  },
  {
    code: 'MX', name: 'México', flag: '🇲🇽', phoneCode: '+52',
    documentTypes: [
      { code: 'CURP', name: 'CURP', placeholder: 'GOMC850515HDFRRR05', pattern: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/ },
      { code: 'INE',  name: 'INE',  placeholder: '1234567890123', pattern: /^[A-Z0-9]{13,18}$/ },
      { code: 'RFC',  name: 'RFC',  placeholder: 'GOMC850515ABC', pattern: /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/ },
      PASSPORT,
    ],
  },
  {
    code: 'PE', name: 'Perú', flag: '🇵🇪', phoneCode: '+51',
    documentTypes: [
      { code: 'DNI', name: 'DNI', placeholder: '12345678', pattern: /^\d{8}$/ },
      { code: 'CE',  name: 'Carnet de extranjería', placeholder: '123456789', pattern: /^\d{9,12}$/ },
      { code: 'RUC', name: 'RUC', placeholder: '20123456789', pattern: /^\d{11}$/ },
      PASSPORT,
    ],
  },
  {
    code: 'UY', name: 'Uruguay', flag: '🇺🇾', phoneCode: '+598',
    documentTypes: [
      { code: 'CI', name: 'Cédula de identidad', placeholder: '1.234.567-8', pattern: /^\d{1,2}\.?\d{3}\.?\d{3}-?\d$/ },
      PASSPORT,
    ],
  },
  {
    code: 'PY', name: 'Paraguay', flag: '🇵🇾', phoneCode: '+595',
    documentTypes: [
      { code: 'CI', name: 'Cédula de identidad', placeholder: '1234567', pattern: /^\d{6,9}$/ },
      PASSPORT,
    ],
  },
  {
    code: 'BO', name: 'Bolivia', flag: '🇧🇴', phoneCode: '+591',
    documentTypes: [
      { code: 'CI', name: 'Cédula de identidad', placeholder: '1234567', pattern: /^\d{6,10}$/ },
      PASSPORT,
    ],
  },
  {
    code: 'EC', name: 'Ecuador', flag: '🇪🇨', phoneCode: '+593',
    documentTypes: [
      { code: 'CI',  name: 'Cédula', placeholder: '1234567890', pattern: /^\d{10}$/ },
      { code: 'RUC', name: 'RUC',    placeholder: '1234567890001', pattern: /^\d{13}$/ },
      PASSPORT,
    ],
  },
  {
    code: 'VE', name: 'Venezuela', flag: '🇻🇪', phoneCode: '+58',
    documentTypes: [
      { code: 'CI', name: 'Cédula de identidad', placeholder: 'V-12345678', pattern: /^[VEJP]-?\d{6,9}$/i },
      PASSPORT,
    ],
  },
  {
    code: 'CR', name: 'Costa Rica', flag: '🇨🇷', phoneCode: '+506',
    documentTypes: [
      { code: 'CI', name: 'Cédula', placeholder: '1-1234-5678', pattern: /^\d-?\d{4}-?\d{4}$/ },
      PASSPORT,
    ],
  },
  {
    code: 'PA', name: 'Panamá', flag: '🇵🇦', phoneCode: '+507',
    documentTypes: [
      { code: 'CIP', name: 'Cédula', placeholder: '8-123-4567', pattern: /^[\d-]+$/ },
      PASSPORT,
    ],
  },
  {
    code: 'DO', name: 'República Dominicana', flag: '🇩🇴', phoneCode: '+1809',
    documentTypes: [
      { code: 'CIE', name: 'Cédula', placeholder: '001-1234567-8', pattern: /^\d{3}-?\d{7}-?\d$/ },
      PASSPORT,
    ],
  },
  {
    code: 'GT', name: 'Guatemala', flag: '🇬🇹', phoneCode: '+502',
    documentTypes: [
      { code: 'DPI', name: 'DPI', placeholder: '1234 56789 0101', pattern: /^\d{4}\s?\d{5}\s?\d{4}$/ },
      PASSPORT,
    ],
  },
  // ─── Norte América ───
  {
    code: 'US', name: 'Estados Unidos', flag: '🇺🇸', phoneCode: '+1',
    documentTypes: [
      { code: 'SSN', name: 'SSN', placeholder: '123-45-6789', pattern: /^\d{3}-?\d{2}-?\d{4}$/ },
      { code: 'DL',  name: "Driver's License", placeholder: 'A1234567', pattern: /^[A-Z0-9]{4,15}$/ },
      PASSPORT,
    ],
  },
  // ─── UE (top, los demás se cubren con Pasaporte) ───
  {
    code: 'ES', name: 'España', flag: '🇪🇸', phoneCode: '+34',
    documentTypes: [
      { code: 'DNI', name: 'DNI',  placeholder: '12345678A', pattern: /^\d{8}[A-Z]$/i },
      { code: 'NIE', name: 'NIE',  placeholder: 'X1234567A', pattern: /^[XYZ]\d{7}[A-Z]$/i },
      PASSPORT,
    ],
  },
  {
    code: 'IT', name: 'Italia', flag: '🇮🇹', phoneCode: '+39',
    documentTypes: [
      { code: 'CF', name: 'Codice Fiscale', placeholder: 'RSSMRA85M01H501Z', pattern: /^[A-Z0-9]{16}$/i },
      PASSPORT,
    ],
  },
  {
    code: 'FR', name: 'Francia', flag: '🇫🇷', phoneCode: '+33',
    documentTypes: [PASSPORT],
  },
  {
    code: 'DE', name: 'Alemania', flag: '🇩🇪', phoneCode: '+49',
    documentTypes: [PASSPORT],
  },
  {
    code: 'PT', name: 'Portugal', flag: '🇵🇹', phoneCode: '+351',
    documentTypes: [PASSPORT],
  },
];

export function getCountryByCode(code: string): CountryOption | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function getDocumentType(country: string, type: string): DocumentTypeOption | undefined {
  return getCountryByCode(country)?.documentTypes.find((t) => t.code === type);
}
