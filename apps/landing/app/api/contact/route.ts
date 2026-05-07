import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SIMPLY_CORE_URL =
  process.env.SIMPLY_CORE_URL ??
  'https://simply-backend-888610796336.southamerica-east1.run.app';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type ContactPayload = {
  email?: string;
  name?: string;
  topic?: string;
  message?: string;
  website?: string;
  url?: string;
};

export async function POST(req: NextRequest) {
  let data: ContactPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Cuerpo inválido' }, { status: 400 });
  }

  if (data.website || data.url) {
    return NextResponse.json({ ok: true });
  }

  if (!data.email || !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ ok: false, error: 'Email inválido' }, { status: 400 });
  }
  if (!data.name || data.name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 });
  }
  if (!data.message || data.message.trim().length < 5) {
    return NextResponse.json({ ok: false, error: 'Mensaje muy corto' }, { status: 400 });
  }
  if (data.message.length > 5000) {
    return NextResponse.json({ ok: false, error: 'Mensaje demasiado largo' }, { status: 400 });
  }

  const [firstName, ...rest] = data.name.trim().split(/\s+/);
  const lastName = rest.join(' ') || undefined;

  const payload = {
    email: data.email.toLowerCase().trim(),
    firstName,
    lastName,
    source: `landing-contact-${(data.topic || 'general').toLowerCase()}`,
    metadata: {
      topic: data.topic,
      message: data.message.trim(),
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
      console.error('[contact] Simply Core error', r.status, text.slice(0, 500));
      return NextResponse.json(
        { ok: false, error: 'Error temporal. Intentá de nuevo.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] fetch error', err);
    return NextResponse.json(
      { ok: false, error: 'No pudimos enviar tu mensaje. Probá más tarde.' },
      { status: 500 },
    );
  }
}
