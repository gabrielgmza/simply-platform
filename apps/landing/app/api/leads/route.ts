import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SIMPLY_CORE_URL =
  process.env.SIMPLY_CORE_URL ??
  'https://simply-backend-888610796336.southamerica-east1.run.app';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type LeadPayload = {
  email?: string;
  name?: string;
  phone?: string;
  country?: string;
  city?: string;
  company?: string;
  type?: 'person' | 'business';
  message?: string;
  // honeypot fields (must be empty)
  website?: string;
  url?: string;
};

export async function POST(req: NextRequest) {
  let data: LeadPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cuerpo inválido' }, { status: 400 });
  }

  // Honeypot — bots auto-rellenan estos campos
  if (data.website || data.url) {
    // respondemos OK para no dar pistas al bot
    return NextResponse.json({ ok: true });
  }

  // Validación
  if (!data.email || !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ ok: false, error: 'Email inválido' }, { status: 400 });
  }
  if (!data.name || data.name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 });
  }
  if (data.email.length > 200 || data.name.length > 200) {
    return NextResponse.json({ ok: false, error: 'Datos demasiado largos' }, { status: 400 });
  }

  const [firstName, ...rest] = data.name.trim().split(/\s+/);
  const lastName = rest.join(' ') || undefined;

  const payload = {
    email: data.email.toLowerCase().trim(),
    firstName,
    lastName,
    phone: data.phone?.trim() || undefined,
    source: 'landing-prereg',
    metadata: {
      country: data.country?.trim(),
      city: data.city?.trim(),
      company: data.company?.trim(),
      type: data.type,
      message: data.message?.trim(),
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    },
  };

  try {
    const r = await fetch(`${SIMPLY_CORE_URL}/api/v1/identity/find-or-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      console.error('[leads] Simply Core error', r.status, text.slice(0, 500));
      return NextResponse.json(
        { ok: false, error: 'Error temporal. Intentá de nuevo.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[leads] fetch error', err);
    return NextResponse.json(
      { ok: false, error: 'No pudimos enviar tu solicitud. Probá más tarde.' },
      { status: 500 },
    );
  }
}
