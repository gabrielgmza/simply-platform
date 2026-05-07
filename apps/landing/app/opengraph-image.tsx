import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Simply | Tu dinero, sin fricción';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            'radial-gradient(circle at 75% 6%, rgba(37,99,235,0.45), transparent 35%), radial-gradient(circle at 12% 38%, rgba(37,99,235,0.25), transparent 40%), linear-gradient(180deg, #000 0%, #030303 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 30,
            opacity: 0.75,
            letterSpacing: '0.34em',
            textTransform: 'lowercase',
            marginBottom: 36,
          }}
        >
          simply
        </div>
        <div style={{ display: 'flex', fontSize: 110, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.95 }}>
          Tu dinero,
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 110,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 0.95,
            color: '#2f7cff',
          }}
        >
          sin fricción.
        </div>
        <div style={{ display: 'flex', fontSize: 30, opacity: 0.7, marginTop: 44 }}>
          AI-first fintech · Personas · Empresas · Cripto
        </div>
      </div>
    ),
    { ...size },
  );
}
