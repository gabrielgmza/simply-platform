import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Simply | Tu dinero, sin fricción';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background: 'linear-gradient(135deg, #000 0%, #050a1a 50%, #0a1530 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 56,
            letterSpacing: '0.4em',
            color: '#fff',
            textTransform: 'lowercase',
            marginBottom: 40,
          }}
        >
          simply
        </div>
        <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.04em' }}>
          Tu dinero,
        </div>
        <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.04em', color: '#3b82f6' }}>
          sin fricción.
        </div>
        <div style={{ fontSize: 28, color: '#a1a1aa', marginTop: 32, maxWidth: 900 }}>
          AI-first fintech · Personas · Empresas · Cripto
        </div>
      </div>
    ),
    { ...size },
  );
}
