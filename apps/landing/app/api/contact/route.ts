import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CORE_URL = process.env.NEXT_PUBLIC_PAYSUR_CORE_URL || 'https://simply-backend-888610796336.southamerica-east1.run.app';
const ENDPOINT = `${CORE_URL}/api/v1/identity/find-or-create`;

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  let body: { name?: string; email?: string; topic?: string; message?: string; website?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 }); }

  if (body.website && body.website.trim() !== '') return NextResponse.json({ ok: true });
  if (!body.email || !isEmail(body.email)) return NextResponse.json({ ok: false, error: 'Email inválido' }, { status: 400 });
  if (!body.name || body.name.trim().length < 2) return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 });

  const parts = body.name.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ') || firstName;

  const payload = {
    email: body.email.trim().toLowerCase(),
    firstName,
    lastName,
    source: `landing-contact-${(body.topic || 'general').toLowerCase()}`,
    metadata: { topic: body.topic || null, message: body.message || null },
  };

  try {
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), 10_000);
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(tm);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return NextResponse.json({ ok: false, error: data?.message || 'Error al enviar' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.name === 'AbortError' ? 'Timeout' : 'Error de conexión' }, { status: 504 });
  }
}
